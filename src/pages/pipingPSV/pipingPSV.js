import "./pipingPSV.css"
import React, { useState , useEffect} from 'react'
import NavBar from '../../components/navBar/navBar'
import PITLogo from "../../assets/images/pitlogo.svg"
import RoleDropDown from '../../components/roleDropDown/roleDropDown'

import IdleTimer from 'react-idle-timer'
import {useNavigate} from "react-router";
import CSPTrackerPSVDataTable from "../../components/csptrackerPSVDataTable/csptrackerPSVDataTable"
import HotTable from "@handsontable/react"

import SaveIcon from "../../assets/images/save.svg"
import AlertF from "../../components/alert/alert"

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import CSPTrackerKeyParams from "../../components/csptrackerKeyParams/csptrackerKeyParams"

import { PieChart, Pie, Tooltip, Cell } from 'recharts';

const COLORS = ['#D2D2D2', '#FFCA42', '#7BD36D', '#99C6F8', '#FFDBE9', '#FF3358', '#F39F18'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 1.3;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    if(percent === 0){
        return null
    }else{
        if(index === 0){
            index = "MAT"
        }else if(index === 1){
            index = "HOLD"
        }else if(index === 2){
            index = "OK-REV0"
        }else if(index === 3){
            index = "OK-REVN"
        }else if(index === 4){
            index = "EXCLUDED"
        }else if(index === 5){
            index = "DELETED"
        }else if(index === 6){
            index = "HOLD-REVN"
        }
      
        return (
          <text x={x} y={y} fill="black"  textAnchor={'middle'} dominantBaseline="central">
              {index}
          </text>
        );
    }
    
  };

const PipingPSV = () => {

    const CryptoJS = require("crypto-js");
    const SecureStorage = require("secure-web-storage");
    var SECRET_KEY = 'sanud2ha8shd72h';

    var secureStorage = new SecureStorage(localStorage, {
        hash: function hash(key) {
            key = CryptoJS.SHA256(key, SECRET_KEY);
    
            return key.toString();
        },
        encrypt: function encrypt(data) {
            data = CryptoJS.AES.encrypt(data, SECRET_KEY);
    
            data = data.toString();
    
            return data;
        },
        decrypt: function decrypt(data) {
            data = CryptoJS.AES.decrypt(data, SECRET_KEY);
    
            data = data.toString(CryptoJS.enc.Utf8);
    
            return data;
        }
    });
    const settings = {
        licenseKey: 'non-commercial-and-evaluation',
        colWidths: [250, 150, 180, 180, 270, 260, 170, 200, 200, 290, 280, 100, 100, 100, 300]
    }

    const [currentRole, setCurrentRole] = useState();
    const [currentTab, setCurrentTab] = useState("View")
    const [roles, setRoles] = useState();

    const [successAlert, setSuccessAlert] = useState(false);
    const [uploadDrawingSuccess, setUploadDrawingSuccess] = useState(false);
    const [updateDrawingSuccess, setUpdateDrawingSuccess] = useState(false)
    const [noTagError, setNoTagError] = useState(false);
    const [invalidFieldError, setInvalidFieldError] = useState(false);
    const [errorIndex, setErrorIndex] = useState(null);
    const [warningBlankRequest, setWarningBlankRequest] = useState(false)
    const [requestSuccess, setRequestSuccess] = useState(false)
    const [existsRequest, setExistsRequest] = useState(false)
    const [errorPid, seterrorPid] = useState(false)

    const [editData, setEditData] = useState({})
    const [newData, setNewData] = useState([])
    const [diametersData, setDiametersData] = useState()
    const [specData, setSpecData] = useState()
    const [boltTypesData, setBoltTypesData] = useState()
    const [projectFilter, setProjectFilter] = useState([])
    const [currentProject, setCurrentProject] = useState()
    const [duplicated, setDuplicated] = useState(false)

    const [ratingsData, setRatingsData] = useState([])

    const [updateData, setUpdateData] = useState(false)  
    const [dataChanged, setDataChanged] = useState(false)  

    const history = useNavigate()

    const [counter, setCounter] = useState([])

    useEffect(()=>{
        if(!secureStorage.getItem("user")){
            history("/"+process.env.REACT_APP_PROJECT+"/");
        }
    }, [])

    var currentUser = secureStorage.getItem('user')

    useEffect(()=>{
        const body = {
            user: currentUser,
        }
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }
       

        fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/api/roles/user", options)
            .then(response => response.json())
            .then(json => {
                setRoles(json.roles);
                if(secureStorage.getItem('role') !== null){
                    setCurrentRole(secureStorage.getItem('role'))
                }else{
                    secureStorage.setItem('role', json.roles[0])
                    setCurrentRole(secureStorage.getItem('role'))
                }
                }
            )
            .catch(error => {
                console.log(error);
            })       
            
    },[currentRole]);

    useEffect(async()=>{

        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/psvStatusDataByProject/" + currentProject, options)
            .then(response => response.json())
            .then(async json => {
                let counter = [{name: "MATERIALS", value: json.materials}, {name: "HOLD", value: json.hold}, {name: "OK-REV0", value: json.ok_rev0}, {name: "OK-REVN", value: json.ok_revn}, {name: "EXCLUDED", value: json.excluded}, {name: "DELETED", value: json.deleted}, {name: "HOLD-REVN", value: json.hold_revn}]
                
                await setCounter(counter)
            })

    },[updateData, currentProject, dataChanged])

    useEffect(async()=>{
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getProjectsByEmail/" + secureStorage.getItem("user"), options)
            .then(response => response.json())
            .then(async json => {
                let projects = []
                for(let i = 0; i < json.projects.length; i++){
                    projects.push({id: json.projects[i].id, project: json.projects[i].name})
                }
                setProjectFilter(projects)
                await setCurrentProject(projects[0].id)
                
                await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getPSVByProject/" + currentProject, options)
                .then(response => response.json())
                .then(async json => {
                    await setEditData(json.rows)
                })

                await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getDiameters", options)
                .then(response => response.json())
                .then(async json => {
                    let diameters_data = []
                    for(let i = 0; i < json.diameters.length; i++){
                        diameters_data.push(json.diameters[i].dn)
                    }
                    await setDiametersData(diameters_data)
                })

                await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getSpecsByProject/"+ projects[0].id, options)
                .then(response => response.json())
                .then(async json => {
                    let spec_data = []
                    for(let i = 0; i < json.specs.length; i++){
                        spec_data.push(json.specs[i].spec)
                    }
                    await setSpecData(spec_data)
                })

                await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/csptracker/boltTypes", options)
                .then(response => response.json())
                .then(async json => {
                    let bolt_types_data = []
                    for(let i = 0; i < json.rows.length; i++){
                        bolt_types_data.push(json.rows[i].type)
                    }
                    await setBoltTypesData(bolt_types_data)
                })

                await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/csptracker/ratings", options)
                .then(response => response.json())
                .then(async json => {
                    let ratings_data = []
                    for(let i = 0; i < json.rows.length; i++){
                        ratings_data.push(json.rows[i].rating)
                    }
                    await setRatingsData(ratings_data)
                })
            })
    }, [])

    useEffect(async()=>{
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getPSVByProject/" + currentProject, options)
        .then(response => response.json())
        .then(async json => {
            await setEditData(json.rows)
        })

        await setNewData({})
    }, [currentProject, dataChanged])


    function uploadSuccess(){
        setUploadDrawingSuccess(true)
    }

    function updateSuccess(){
        setUpdateDrawingSuccess(true)
    }

    function drawingUploadError(){
    }

    function errorBlankRequest(){
        setWarningBlankRequest(true)
    }

    function successRequest(){
        setRequestSuccess(true)
    }

    function existsErrorRequest(){
        setExistsRequest(true)
    }

    function errorPidRequest(){
        seterrorPid(true)
    }

    function handleOnIdle(){
        saveChanges()
        const body = {
            user: currentUser,
        }
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }
        fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/exitEditCSP", options)
            .then(response => response.json())
            .then(async json => {

            })
        secureStorage.clear()
        history("/" + process.env.REACT_APP_PROJECT)
    }

    async function handleToggle(){
        if(currentTab === "View"){
            await setCurrentTab("Edit")
        }else{
            await setCurrentTab("View")
            await saveChanges()
        }
    }

    async function addRow(){
        let rows = editData
        rows.push({tag:"", spec_inlet: "", p1bore_inlet: "", rating_inlet: "", flg_inlet: "", bolt_longitude_inlet: "", spec_outlet: "", p2bore_outlet: "", rating_outlet: "", flg_outlet: "", bolt_longitude_outlet: "", h1: "", a: "", b: ""})
        await setEditData(rows)
        await setUpdateData(!updateData)
      }

    async function handleChange(changes, source){
        if (source !== 'loadData'){
            let data_aux = editData
            for(let i = 0; i < changes.length; i+=4){       
                let row_id = changes[i][0]
                let row = editData[row_id]
                let new_data = newData
                new_data[row_id] = row
                await setEditData(data_aux)
                await setNewData(new_data)
            }
        }
    }

    async function saveChanges(){
        let new_rows = []
        Object.entries(newData)
        .map( ([key, value]) => new_rows.push(value))

        
        const body = {
            rows: new_rows,
            project_id: currentProject,
            role: currentRole
        }
       
        let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/submitPSV", options)
        .then(response => response.json())
        .then(async json =>{
            if(json.success){
                await setSuccessAlert(true)
                await setNewData({})
                await setDataChanged(!dataChanged)
            }else{
                await setNewData({})
                await setDataChanged(!dataChanged)
                await setDuplicated(true)
            }
        })
    }


    async function updateDataMethod(){
        setUpdateData(!updateData)
    }

    async function downloadReport(){
        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/downloadPSVByProject/" + currentProject)
        .then(response => response.json())
        .then(json => {
            let rows = JSON.parse(json)

            const headers = ["TAG", "Spec Inlet", "P1Bore Inlet", "Rating Inlet", "FLG Short Code Inlet", "Bolt Longitude Inlet", "Spec Outlet", "P2Bore Outlet", "Rating Outlet", "FLG Short Code Outlet", "Bolt Longitude Outlet", "H1", "A", "B", "Ready to load date", "Ready in E3D date", "Updated date",  "Comments", "Ready to Load", "Ready in 3D", "Updated"]
            const fileName = "PSV report"

            for(let i = 0; i < rows.length; i++){
                console.log(rows[i])
                if(rows[i].ready_load_date){
                    rows[i].ready_load_date = rows[i].ready_load_date.toString().substring(8,10) + "-" + rows[i].ready_load_date.toString().substring(5,7) + "-" + rows[i].ready_load_date.toString().substring(0,4)
                }else{
                    rows[i].ready_load_date = ""
                }

                if(rows[i].ready_e3d_date){
                    rows[i].ready_e3d_date = rows[i].ready_e3d_date.toString().substring(8,10) + "-" + rows[i].ready_e3d_date.toString().substring(5,7) + "-" + rows[i].ready_e3d_date.toString().substring(0,4)
                }else{
                    rows[i].ready_e3d_date = ""
                }

                if(rows[i].updated_at){
                    rows[i].updated_at = rows[i].updated_at.toString().substring(8,10) + "-" + rows[i].updated_at.toString().substring(5,7) + "-" + rows[i].updated_at.toString().substring(0,4)
                }else{
                    rows[i].updated_at = ""
                }

            }

            const apiData = rows
            const fileType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
            const header_cells = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1', 'J1', 'K1', 'L1', 'M1', 'N1', 'O1', 'P1', 'Q1', 'R1', 'S1', 'T1', 'U1', 'V1', 'W1', 'X1', 'Y1', 'Z1']
            const fileExtension = ".xlsx";

            let wscols = []
            for(let i = 0; i < headers.length; i++){
                wscols.push({width:35})
            }

            const ws = XLSX.utils.json_to_sheet(apiData);   
            ws["!cols"] = wscols
            for(let i = 0; i < headers.length; i++){
                ws[header_cells[i]].v = headers[i]
            }
            const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
            const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
            const data = new Blob([excelBuffer], { type: fileType });
            FileSaver.saveAs(data, fileName + fileExtension);
        })
    }

    document.body.style.zoom = 0.8

    var dataTableHeight = "580px"

    let editBtn, addRowBtn, saveBtn, exportBtn
    let table = <CSPTrackerPSVDataTable currentRole = {currentRole} updateDataMethod = {updateDataMethod.bind(this)} updateData = {updateData} uploadDrawingSuccess = {uploadSuccess.bind(this)} updateDrawingSuccess = {updateSuccess.bind(this)} drawingUploadError={drawingUploadError.bind(this)} currentProject={currentProject}/>
    if(currentRole === "Materials" || currentRole === "Design"){
        editBtn = <label class="switchBtn__general" style={{width:"145px"}}>
                    <p className="navBar__button__text__general" style={{width:"100px", marginTop:"5px"}}>Edit mode &nbsp;&nbsp;&nbsp;</p>
                    <input type="checkbox" id="edit" onClick={()=>handleToggle()}/>
                    <div class="slide__general round"></div>
                </label>   
                   
    }else{
        editBtn = <label class="switchBtn__general" style={{width:"145px"}}>
        <p className="navBar__button__text__general" style={{width:"100px", marginTop:"5px"}}>Edit mode &nbsp;</p>
        <input type="checkbox" id="edit" disabled/>
        <div class="slide__general round"></div>
        </label>
        
    }

    if(currentRole === "3D Admin"){
        editBtn = null /*<label class="switchBtn__general" style={{width:"145px"}}>
                    <p className="navBar__button__text__general" style={{width:"100px", marginTop:"5px"}}>KeyParams &nbsp;&nbsp;&nbsp;</p>
                    <input type="checkbox" id="edit" onClick={()=>handleToggleKP()}/>
                    <div class="slide__general__admin round" style={{marginLeft:"90px"}}></div>
                </label> */ 
    }

    if(currentTab === "View"){
        table = <CSPTrackerPSVDataTable currentRole = {currentRole} updateDataMethod = {updateDataMethod.bind(this)} updateData = {updateData} uploadDrawingSuccess = {uploadSuccess.bind(this)} updateDrawingSuccess = {updateSuccess.bind(this)} drawingUploadError={drawingUploadError.bind(this)} currentProject={currentProject}/>
        exportBtn = <button className="action__btn" name="export" value="export" onClick={() => downloadReport()}>Export</button>
        addRowBtn = null
        
    }else if(currentTab === "Edit"){
        let cells = []
        let cols
        if(currentRole === "Design"){
            addRowBtn = <button class="btn btn-sm btn-success" onClick={() => addRow()} style={{fontSize:"18px", width:"35px", height:"35px", borderRadius:"10px", float:"right", marginTop:"15px"}}>+</button>
            cols = [{ data: "tag", type:'text'}, {data: "spec_inlet", type:'dropdown', strict:"true", source: specData}, {data: "p1bore_inlet", type:'dropdown', strict:"true", source: diametersData}, {data: "rating_inlet", type:'dropdown', strict:"true", source: ratingsData}, {data: "flg_inlet", type:'text', readOnly:true}, {data: "bolt_longitude_inlet", type:"text", readOnly:true}, {data: "spec_outlet", type:'dropdown', strict:"true", source: specData}, {data: "p2bore_outlet", type:'dropdown', strict:"true", source: diametersData}, {data: "rating_outlet", type:'dropdown', strict:"true", source: ratingsData}, {data: "flg_outlet", type:"text", readOnly:true}, {data: "bolt_longitude_outlet", type:"text", readOnly:true}, {data:"h1", type:"text"}, {data:"a", type:"text"}, {data:"b", type:"text"}, {data:"comments", type:"text"}]
            for(let i = 0; i < editData.length; i++){
                cells.push({
                    row: i,
                    col: 4,
                    className: 'insts__disabled__cell'})
                cells.push({
                    row: i,
                    col: 5,
                    className: 'insts__disabled__cell'})
                cells.push({
                    row: i,
                    col: 9,
                    className: 'insts__disabled__cell'})
                cells.push({
                    row: i,
                    col: 10,
                    className: 'insts__disabled__cell'})
            }
        }else{
            cols = [{ data: "tag", type:'text', readOnly:true}, {data: "spec_inlet", type:'text', readOnly:true}, {data: "p1bore_inlet", type:'text', readOnly:true}, {data: "rating_inlet", type:'text', readOnly:true}, {data: "flg_inlet", type:'dropdown', strict:"true", source: boltTypesData}, {data: "bolt_longitude_inlet", type:"text"}, {data: "spec_outlet", type:'text', readOnly:true}, {data: "p2bore_outlet", type:'text', readOnly:true}, {data: "rating_outlet", type:'text', readOnly:true}, {data: "flg_outlet", type:"dropdown", strict:true, source: boltTypesData}, {data: "bolt_longitude_outlet", type:"text"}, {data:"h1", type:"text", readOnly:true}, {data:"a", type:"text", readOnly:true}, {data:"b", type:"text", readOnly:true}, {data:"comments", type:"text", readOnly:true}]
            for(let i = 0; i < editData.length; i++){
                cells.push({
                    row: i,
                    col: 0,
                    className: 'insts__disabled__cell'})
                cells.push({
                    row: i,
                    col: 1,
                    className: 'insts__disabled__cell'})
                cells.push({
                    row: i,
                    col: 2,
                    className: 'insts__disabled__cell'})
                cells.push({
                    row: i,
                    col: 3,
                    className: 'insts__disabled__cell'})
                cells.push({
                    row: i,
                    col: 6,
                    className: 'insts__disabled__cell'})
                cells.push({
                    row: i,
                    col: 7,
                    className: 'insts__disabled__cell'})
                cells.push({
                    row: i,
                    col: 8,
                    className: 'insts__disabled__cell'})
                cells.push({
                    row: i,
                    col: 11,
                    className: 'insts__disabled__cell'})
                cells.push({
                    row: i,
                    col: 12,
                    className: 'insts__disabled__cell'})
                cells.push({
                    row: i,
                    col: 13,
                    className: 'insts__disabled__cell'})
                cells.push({
                    row: i,
                    col: 14,
                    className: 'insts__disabled__cell'})    
            }
        }
        
        table = <HotTable
        data={editData}
        colHeaders = {["TAG","SPEC INLET", "P1BORE INLET", "RATING INLET", "FLG SHORT CODE INLET", "BOLT LONGITUDE INLET", "SPEC OUTLET", "P2BORE OUTLET", "RATING OUTLET", "FLG SHORT CODE OUTLET", "BOLT LONGITUDE OUTLET","H1", "A", "B", "COMMENTS"]}
        rowHeaders={true}
        width="2200"
        height="530"
        settings={settings} 
        manualColumnResize={true}
        manualRowResize={true}
        filters={true}
        afterChange={handleChange}
        fixedColumnsLeft={1}
        dropdownMenu= {[
            'make_read_only',
            '---------',
            'alignment',
            '---------',
            'filter_by_condition',
            '---------',
            'filter_operators',
            '---------',
            'filter_by_condition2',
            '---------',
            'filter_by_value',
            '---------',
            'filter_action_bar',
            ]}
        columns= {cols}
        cell={cells}
        />
        
        dataTableHeight= "700px"
        saveBtn = <button className="navBar__button" onClick={()=> saveChanges()} style={{marginRight:"5px", fontSize:"18px", width:"100px", height:"35px", borderRadius:"10px", marginRight:"-30px"}}><img src={SaveIcon} alt="save" className="navBar__icon" style={{marginTop:"9px"}}></img><p className="navBar__button__text">Save</p></button>
    }

    return(
        
        <body>
            {updateData}
            <IdleTimer
                timeout={1000 * 60 * 15}
                onIdle={handleOnIdle}
                debounce={250}
            />
            <div
            className={`alert alert-success ${successAlert ? 'alert-shown' : 'alert-hidden'}`}
            onTransitionEnd={() => setSuccessAlert(false)}
            >
                <AlertF type="success" text="Changes saved successfully!" margin="-40px"/>
            </div>
            <div
            className={`alert alert-success ${uploadDrawingSuccess ? 'alert-shown' : 'alert-hidden'}`}
            onTransitionEnd={() => setUploadDrawingSuccess(false)}
            >
                <AlertF type="success" text="Drawing uploaded successfully!" margin="0px"/>
            </div>
            <div
            className={`alert alert-success ${updateDrawingSuccess ? 'alert-shown' : 'alert-hidden'}`}
            onTransitionEnd={() => setUpdateDrawingSuccess(false)}
            >
                <AlertF type="success" text="Drawing updated successfully!" margin="0px"/>
            </div>
            <div
            className={`alert alert-success ${noTagError ? 'alert-shown' : 'alert-error-hidden'}`}
            onTransitionEnd={() => setNoTagError(false)}
            >
                <AlertF type="waring" text={errorIndex} margin="0px"/>
            </div>
            <div
            className={`alert alert-success ${invalidFieldError ? 'alert-shown' : 'alert-error-hidden'}`}
            onTransitionEnd={() => setInvalidFieldError(false)}
            >
                <AlertF type="error" subtext="At least one of the entries had an invalid field!" margin="0px"/>
            </div>
            <div
            className={`alert alert-success ${requestSuccess? 'alert-shown' : 'alert-error-hidden'}`}
            onTransitionEnd={() => setRequestSuccess(false)}
            >
                <AlertF type="success" text="SP requested successfully!" margin="0px"/>
            </div>
            <div
            className={`alert alert-success ${warningBlankRequest ? 'alert-shown' : 'alert-error-hidden'}`}
            onTransitionEnd={() => setWarningBlankRequest(false)}
            >
                <AlertF type="warning" text="All fileds need to be filled!" margin="0px"/>
            </div>
            <div
            className={`alert alert-success ${duplicated ? 'alert-shown' : 'alert-error-hidden'}`}
            onTransitionEnd={() => setDuplicated(false)}
            >
                <AlertF type="warning" text="Some values were duplicated and didn't save!" margin="0px"/>
            </div>
            <div
            className={`alert alert-success ${existsRequest ? 'alert-shown' : 'alert-error-hidden'}`}
            onTransitionEnd={() => setExistsRequest(false)}
            >
                <AlertF type="error" subtext="An SP with that SPTag already exists!" margin="0px"/>
            </div>
            <div
            className={`alert alert-success ${errorPid ? 'alert-shown' : 'alert-error-hidden'}`}
            onTransitionEnd={() => seterrorPid(false)}
            >
                <AlertF type="error" subtext="The specified P&ID is invalid!" margin="0px"/>
            </div>
            <div style={{zoom:1.125, marginLeft:"10%"}}>
                <NavBar onChange={value => setCurrentTab(currentTab)}/>
            </div>
            <div className="isotracker__row" style={{marginBottom:"-10px"}}>
                  <div className="isotracker__column">
                      <img src={PITLogo} alt="PITLogo" className="isoTrackerLogo__image2" style={{height:"85px"}}/>
                      <label className="discipline__title" style={{marginLeft:"500px", marginBottom:"-50px"}}>Pressure Safety Valve (PSV)</label>
                      <div className="roleSelector__containerF">
                              <RoleDropDown style={{paddingLeft: "2px"}} onChange={value => setCurrentRole(value)} roles = {roles}/>
                      </div>
                      
                  </div>
                  <PieChart width={600} height={420}>
                    <Pie data={counter} dataKey="value" cx="50%" cy="60%"  outerRadius={120} fill="#8884d8" label={renderCustomizedLabel}>
                    {counter.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                    </Pie>
                    <Tooltip/>
                </PieChart>
            </div>
            <table className="isotracker__table__container__general">
                      <tr className="isotracker__table__navBar__container" style={{height:"65px "}}>
                          <th  className="isotracker__table__navBar">
                              <div style={{display:"flex"}}>
                                {editBtn}
                                {saveBtn}   
                                <div style={{display:"flex", float:"right", marginTop:"10px"}}>
                                    <label for="projectFilter" className="inst__project__label">Project: </label>
                                    <select id="projectFilter" className="inst__projectFilterSelect" onChange={(e) => setCurrentProject(e.target.value)}>
                                        {projectFilter.map(project =>(
                                            <option value={project.id}>{project.project}</option>
                                        ))}
                                    </select>
                                </div>
                              </div>                           
                          </th>
                      </tr>
                      <tr className="isotracker__table__tray__and__table__container" style={{height: "600px"}}>
                          <td className="discplines__table__table" style={{height: "600px"}} >
                              <div  style={{height: "600px", width:"2200px"}} className="isotracker__table__table__container">
                                {table}
                                {addRowBtn}
                              </div>
                          </td>
                          
                      </tr>
                  </table>
                  <center className="actionBtns__container">   
                    <div style={{display:"flex", marginTop:"10px"}}>
                        {exportBtn}
                    </div>
                    
                  </center>
                  <br></br>
         </body>
    )
}

export default PipingPSV;