import "./pipingExpansionJoins.css"
import React, { useState , useEffect} from 'react'
import NavBar from '../../components/navBar/navBar'
import PITLogo from "../../assets/images/pitlogo.svg"
import RoleDropDown from '../../components/roleDropDown/roleDropDown'

import IdleTimer from 'react-idle-timer'
import {useNavigate} from "react-router";
import CSPtrackerExpansionJoinsDataTable from "../../components/csptrackerExpansionJoinsDataTable/csptrackerExpansionJoinsDataTable"
import HotTable from "@handsontable/react"

import SaveIcon from "../../assets/images/save.svg"
import AlertF from "../../components/alert/alert"
import CSPTrackerRequestPopUp from "../../components/csptrackerRequestPopUp/csptrackerRequestPopUp"
import CSPTrackerdRequestsDataTable from "../../components/csptrackerRequestsDataTable/csptrackerRequestsDataTable"

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import Reports from "../../assets/images/view_requests.svg"
import Back from "../../assets/images/back.svg"
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

const PipingExpansionJoins = () => {

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
    const [endPreparationData, setEndPreparationData] = useState([])

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

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/expansionJoinsStatusDataByProject/" + currentProject, options)
            .then(response => response.json())
            .then(async json => {
                let counter = [{name: "MATERIALS", value: json.materials}, {name: "HOLD", value: json.hold}, {name: "OK-REV0", value: json.ok_rev0}, {name: "OK-REVN", value: json.ok_revn}, {name: "EXCLUDED", value: json.excluded}, {name: "DELETED", value: json.deleted}, {name: "HOLD-REVN", value: json.hold_revn}]
                
                await setCounter(counter)
            })

    },[updateData, currentProject])

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
                
                await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getExpansionJoinsByProject/" + projects[0].id, options)
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

                await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/csptracker/endPreparations", options)
                .then(response => response.json())
                .then(async json => {
                    let end_data = []
                    for(let i = 0; i < json.rows.length; i++){
                        end_data.push(json.rows[i].state)
                    }
                    await setEndPreparationData(end_data)
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
            })
    }, [])

    useEffect(async()=>{
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getExpansionJoinsByProject/" + currentProject, options)
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
        rows.push({id: "", tag:"", spec: "", p1bore: "", p2bore: "", rating: "", end_preparation: "", description_iso: "", face_to_face: "", bolt_type: ""})
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

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/submitExpansionJoins", options)
        .then(response => response.json())
        .then(async json =>{
            if(json.success){
                await setSuccessAlert(true)
                await setNewData({})
                await setDataChanged(!dataChanged)
            }
        })
    }


    async function updateDataMethod(){
        setUpdateData(!updateData)
    }

    async function downloadReport(){
        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/downloadExpansionJoinsByProject/" + currentProject)
        .then(response => response.json())
        .then(json => {
            let rows = JSON.parse(json)

            const headers = ["TAG", "Spec", "P1Bore", "P2Bore", "Rating", "End Preparation", "Description ISO", "Face to face", "FLG Short Code", "Ready in E3D date", "Updated date", "Comments", "Ready to Load", "Ready in 3D", "Updated"]
            const fileName = "Expansion Joins Report"

            for(let i = 0; i < rows.length; i++){
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
    let table = <CSPtrackerExpansionJoinsDataTable currentProject={currentProject} currentRole = {currentRole} updateDataMethod = {updateDataMethod.bind(this)} updateData = {updateData} uploadDrawingSuccess = {uploadSuccess.bind(this)} updateDrawingSuccess = {updateSuccess.bind(this)} drawingUploadError={drawingUploadError.bind(this)}/>
    if(currentRole === "Materials" || currentRole === "Design"){
        editBtn = <label class="switchBtn" style={{width:"145px"}}>
                    <p className="navBar__button__text" style={{width:"80px", marginTop:"4px"}}>Edit mode</p>
                    <input type="checkbox" id="edit" onClick={()=>handleToggle()}/>
                    <div class="slide round"></div>
                </label>   
                   
        if(currentTab === "Edit"){

        }else{
            editBtn = <label class="switchBtn" style={{width:"145px"}}>
            <p className="navBar__button__text" style={{width:"80px", marginTop:"4px"}}>Edit mode</p>
            <input type="checkbox" id="edit" onClick={()=>handleToggle()}/>
            <div class="slide round"></div>
        </label>
        }
    }

    if(currentTab === "View"){
        table = <CSPtrackerExpansionJoinsDataTable currentProject={currentProject} currentRole = {currentRole} updateDataMethod = {updateDataMethod.bind(this)} updateData = {updateData} uploadDrawingSuccess = {uploadSuccess.bind(this)} updateDrawingSuccess = {updateSuccess.bind(this)} drawingUploadError={drawingUploadError.bind(this)}/>
        exportBtn = <button className="action__btn" name="export" value="export" onClick={() => downloadReport()}>Export</button>
        addRowBtn = null
        saveBtn = null
        
    }else if(currentTab === "Edit"){
        let cells = []
        let cols
        if(currentRole === "Design"){
            addRowBtn = <button class="btn btn-sm btn-success" onClick={() => addRow()} style={{fontSize:"18px", width:"35px", height:"35px", borderRadius:"10px", float:"right", marginTop:"15px"}}>+</button>
            cols = [{ data: "tag", type:'text'}, {data: "spec", type:'dropdown', strict:"true", source: specData}, {data: "p1bore", type:'dropdown', strict:"true", source: diametersData}, {data: "p2bore", type:'dropdown', strict:"true", source: diametersData}, {data: "rating", type:"dropdown", strict:true, source: ratingsData}, {data: "end_preparation", type:'dropdown', strict:"true", source: endPreparationData}, {data: "description_iso", type:'text'}, {data: "face_to_face", type:'text'}, {data: "bolt_type",  type:'text', readOnly:true}, {data: "comments",  type:'text'}]
            for(let i = 0; i < editData.length; i++){
                cells.push({
                    row: i,
                    col: 7,
                    className: 'insts__disabled__cell'})
                cells.push({
                    row: i,
                    col: 9,
                    className: 'insts__disabled__cell'})
            }
        }else{
            cols = [{ data: "tag", type:'text', readOnly:true}, {data: "spec",  type:'text', readOnly:true}, {data: "p1bore",  type:'text', readOnly:true}, {data: "p2bore", type:'text', readOnly:true}, {data: "rating",  type:'text', readOnly:true}, {data: "end_preparation", type:'text', readOnly:true}, {data: "description_iso", type:'text', readOnly:true}, {data: "face_to_face", type:'text', readOnly:true}, {data: "bolt_type", type:"dropdown", strict: true, source: boltTypesData}, {data: "comments",  type:'text', readOnly:true}]
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
                    col: 4,
                    className: 'insts__disabled__cell'})
                cells.push({
                    row: i,
                    col: 5,
                    className: 'insts__disabled__cell'})
                cells.push({
                    row: i,
                    col: 6,
                    className: 'insts__disabled__cell'})
                cells.push({
                    row: i,
                    col: 8,
                    className: 'insts__disabled__cell'})
                cells.push({
                    row: i,
                    col: 10,
                    className: 'insts__disabled__cell'})
                cells.push({
                    row: i,
                    col: 11,
                    className: 'insts__disabled__cell'})   
            }
        }

        table = <HotTable
        data={editData}
        colHeaders = {["<b>TAG</b>","<b>SPEC</b>", "<b>P1BORE</b>", "<b>P2BORE</b>", "<b>RATING</b>", "<b>END PREPARATION</b>", "<b>ISO DESCRIPTION/b>", "<b>FACE TO FACE</b>", "<b>FLG SHORT CODE</b>", "<b>COMMENTS</b>"]}
        rowHeaders={true}
        width="2200"
        height="635"
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
        cell={cells}        />
        
        dataTableHeight= "700px"
        saveBtn = <button className="navBar__button" onClick={()=> saveChanges()} style={{marginTop:"7px"}}><img src={SaveIcon} alt="save" className="navBar__icon"></img><p className="navBar__button__text">Save</p></button>
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
                <AlertF type="success" text="Changes saved!" margin="0px"/>
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
            <div className="isotracker__row">
                  <div className="isotracker__column">
                      <img src={PITLogo} alt="PITLogo" className="isoTrackerLogo__image2" style={{height:"85px"}}/>
                      
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
            <table className="isotracker__table__container">
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
                      <tr className="isotracker__table__tray__and__table__container" style={{height: dataTableHeight}}>
                          <td className="discplines__table__table" style={{height: dataTableHeight}} >
                              <div  style={{height: dataTableHeight, width:"2200px"}} className="isotracker__table__table__container">
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

export default PipingExpansionJoins;