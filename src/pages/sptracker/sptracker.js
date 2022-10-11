import "./sptracker.css"
import React, { useState , useEffect} from 'react'
import NavBar from '../../components/navBar/navBar'
import CSPTrackerLogo from "../../assets/images/csptracker.svg"
import RoleDropDown from '../../components/roleDropDown/roleDropDown'

import IdleTimer from 'react-idle-timer'
import {useNavigate} from "react-router";
import CSPTrackerdDataTable from "../../components/csptrackerDataTable/csptrackerDataTable"
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

const COLORS = ['#D2D2D2', '#FFCA42', '#7BD36D', '#99C6F8', '#94DCAA', '#FF3358'];

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
        }
      
        return (
          <text x={x} y={y} fill="black"  textAnchor={'middle'} dominantBaseline="central">
              {index}
          </text>
        );
    }
    
  };

const CSPTracker = () => {

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
        colWidths: 250,
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

    const [editData, setEditData] = useState()
    const [descriptionPlaneData, setDescriptionPlaneData] = useState()
    const [diametersData, setDiametersData] = useState()
    const [ratingData, setRatingData] = useState()
    const [specData, setSpecData] = useState()
    const [endPreparationData, setEndPrepartaionData] = useState()
    const [boltTypesData, setBoltTypesData] = useState()
    const [pidData, setPidData] = useState()
    const [projectsData, setProjectsData] = useState()

    const [busy, setBusy] = useState(false)
    const [editingUser, setEditingUser] = useState()

    const [updateData, setUpdateData] = useState(false)    

    const history = useNavigate()

    const [counter, setCounter] = useState([])

    useEffect(()=>{
        if(!secureStorage.getItem("user")){
            history("/"+process.env.REACT_APP_PROJECT+"/");
        }
    }, [])

    var currentUser = secureStorage.getItem('user')

    let p1bore, p2bore, p3bore = ""

    if(process.env.REACT_APP_MMDN === "1"){ //Diametros en funcion de mm o nps
        p1bore = "p1diameter_nps"
        p2bore = "p2diameter_nps"
        p3bore = "p3diameter_nps"
    }else{
        p1bore = "p1diameter_dn"
        p2bore = "p2diameter_dn"
        p3bore = "p3diameter_dn"
    }

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
        const body = {
            user: currentUser,
        }
        let options = {
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

        options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }
        //Get de los datos para la grafica de status
        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/spStatusData", options)
            .then(response => response.json())
            .then(async json => {
                let counter = [{name: "Materials", value: json.materials}, {name: "Hold", value: json.hold}, {name: "OK-REV0", value: json.ok_rev0}, {name: "OK-REVN", value: json.ok_revn}, {name: "Excluded", value: json.excluded}, {name: "Deleted", value: json.deleted}]
                
                await setCounter(counter)
            })

    },[updateData])

    useEffect(async()=>{
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }
        //Get de todos los datos del sptracker
        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/csptracker", options)
            .then(response => response.json())
            .then(async json => {
                await setEditData(json.rows)
            })

        if(currentTab === "View"){   //Si estamos en la vista normal
            
            //Get de los datos para rellenar los dropdowns
            await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getListsData", options)
            .then(response => response.json())
            .then(async json => {
                await setDescriptionPlaneData(json.descriptionPlaneData)
                await setDiametersData(json.diametersData)
                await setRatingData(json.ratingData)
                await setSpecData(json.specData)
                await setEndPrepartaionData(json.endPreparationData)
                await setBoltTypesData(json.boltTypesData)
                await setPidData(json.pidData)
                await setProjectsData(json.projectsData)
            })
        }    
    }, [currentTab])

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

    async function handleToggle(){ //Cambio entre vistas
        if(currentTab === "View"){ //Si estamos en la vista normal pasamos a la vista de edicion
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
            fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/editCSP", options)
            .then(response => response.json())
            .then(async json => {
                if(json.user){
                    await setBusy(true)
                    await setEditingUser(json.user)
                }else{
                    await setBusy(false)
                }
                await setCurrentTab("Edit")
            })
            
        }else{ //Y al reves
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
                if(json.success){
                    await saveChanges()
                    await setCurrentTab("View")
                }
            })
            
        }
    }

    async function handleToggleKP(){ //Podemos entrar al keyparams
        if(currentTab === "View"){
            await setCurrentTab("CSP KeyParams")
            
        }else{
            //await saveChangesKP()
            await setCurrentTab("View")
            
        }
    }

    async function addRow(){ //Añade una fila
        let rows = editData
        rows.push({tag:"", quantity: "", description: "", description_plan_code: "", drawing_filename: "", description_iso: "", ident: "", p1diameter_dn: "", p1diameter_nps: "", p2diameter_dn: "", p2diameter_nps: "", p3diameter_dn: "", p3diameter_nps: "", rating: "", spec: "", type: "", end_preparation: "", description_drawing: "", face_to_face: "", bolt_type: "", ready_load: "", ready_e3d: "", comments: "", pid: "", line_id: "", requisition: "", equipnozz: "", utility_station: ""})
        await setEditData(rows)
        await setUpdateData(!updateData)
      }

    async function saveChanges(){ //Guardamos los cambios del like excel

        const body = {
            rows: editData,
            email: currentUser
        }
        let options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }

        //Get de los tags
        fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/tags", options)
        .then(response => response.json())
        .then(async json =>{
            let unique = true
            if(json.none){

            }else{
                let tags = []
                for(let i = 0; i < editData.length; i++){
                    if(tags.indexOf(editData[i].tag) > -1 && editData[i].tag !== null){
                        unique = false
                        await setErrorIndex("Repeated tag at entry " + i +"!")             
                    }else{
                        tags.push(editData[i].tag)
                    }
                }
            }
            
            if(!unique){ //Si hay algun tag repetido da error
                await setNoTagError(true)
            }
            options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            }
            //Guardamos los datos
            await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/submitCSP", options)
            .then(response => response.json())
            .then(async json =>{
                if(json.success){
                    await setSuccessAlert(true)

                }
            })

            //Actualizamos las fechas de los elementos actualizados
            await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/update_ready_load", options)
            .then(response => response.json())
            .then(async json =>{

            }) 
                                
        })                
             
    }

    function back(){
        history("/"+process.env.REACT_APP_PROJECT+"/pitrequests")
    }

    async function updateDataMethod(){
        setUpdateData(!updateData)
    }

    async function downloadReport(){ //Reporte
        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/downloadCSP/")
        .then(response => response.json())
        .then(json => {
            const headers = ["Tag", "Project", "Spec", "P1Bore", "P2Bore", "P3Bore", "Rating", "End preparation", "Line ID", "P&ID", "Type", "Drawing description", "Quantity", "Requisition", "Description", "Iso description", "Ident", "Face to face", "FLG Short Code", "Equipment + Nozzle", "Utility Station", "Request date", "Ready to load date", "Ready in E3D date", "Comments", "Ready to Load", "Ready in 3D", "Updated"]
            const apiData = JSON.parse(json)
            const fileName = "CSPTracker report"

            const fileType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
            const header_cells = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1', 'J1', 'K1', 'L1', 'M1', 'N1', 'O1', 'P1', 'Q1', 'R1', 'S1', 'T1', 'U1', 'V1', 'W1', 'X1', 'Y1', 'Z1', 'A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'G2']
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

    var dataTableHeight = "570px"

    let editBtn, addRowBtn, saveBtn, exportBtn, requestBtn, notificationsBtn, designNotificationsBtn, backBtn = null
    let table = <CSPTrackerdDataTable currentRole = {currentRole} updateDataMethod = {updateDataMethod.bind(this)} updateData = {updateData} uploadDrawingSuccess = {uploadSuccess.bind(this)} updateDrawingSuccess = {updateSuccess.bind(this)} drawingUploadError={drawingUploadError.bind(this)}/>
    if(currentRole === "Materials"){ //En funcion de la tab y el rol ponemos unos componentes u otros
        editBtn = <label class="switchBtn" style={{width:"145px"}}>
                    <p className="navBar__button__text" style={{width:"80px", marginTop:"4px"}}>Edit mode</p>
                    <input type="checkbox" id="edit" onClick={()=>handleToggle()}/>
                    <div class="slide round"></div>
                </label>   
                   
        if(currentTab === "Edit"){
            notificationsBtn = null
            backBtn = null
        }
        else if(currentTab !== "Requests"){
            backBtn = <button className="navBar__button" onClick={()=>back()} style={{width:"100px"}}><img src={Back} alt="hold" className="navBar__icon" style={{marginRight:"0px", marginTop:"5px"}}></img><p className="navBar__button__text">Back</p></button>
            notificationsBtn = <button className="navBar__button" onClick={()=>setCurrentTab("Requests")} style={{width:"120px", marginTop:"5px"}}><img src={Reports} alt="hold" className="navBar__icon" style={{marginRight:"4px"}}></img><p className="navBar__button__text">Requests</p></button>
        }else{
            backBtn = <button className="navBar__button" onClick={()=>back()} style={{width:"100px", marginTop:"5px"}}><img src={Back} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="navBar__button__text">Back</p></button>
            notificationsBtn = <button className="navBar__button" onClick={()=>setCurrentTab("View")} style={{backgroundColor:"#99C6F8", width:"120px", marginTop:"5px"}}><img src={Back} alt="hold" className="navBar__icon" style={{marginRight:"4px"}}></img><p className="navBar__button__text">Back</p></button>
            editBtn = <label class="switchBtn" style={{width:"145px"}}>
            <p className="navBar__button__text" style={{width:"80px", marginTop:"4px"}}>Edit mode</p>
            <input type="checkbox" id="edit" disabled/>
            <div class="slide round"></div>
        </label>
        }
    }

    if(currentRole === "3D Admin"){
        backBtn = <button className="navBar__button" onClick={()=>back()} style={{width:"100px",marginTop:"5px"}}><img src={Back} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="navBar__button__text">Back</p></button>
        editBtn = <label class="switchBtn" style={{width:"155px"}}>
                    <p className="navBar__button__text" style={{width:"90px", marginTop:"4px"}}>KeyParams</p>
                    <input type="checkbox" id="edit" onClick={()=>handleToggleKP()}/>
                    <div class="slide round" style={{marginLeft:"90px"}}></div>
                </label>  
    }

    if(currentRole === "Design"){
        backBtn = <button className="navBar__button" onClick={()=>back()} style={{width:"100px", marginTop:"5px"}}><img src={Back} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="navBar__button__text">Back</p></button>
        requestBtn = <CSPTrackerRequestPopUp errorBlankRequest={errorBlankRequest.bind(this)} successRequest={successRequest.bind(this)} existsErrorRequest={existsErrorRequest.bind(this)} errorPidRequest={errorPidRequest.bind(this)}/>
    }



    if(currentTab === "View"){
        table = <CSPTrackerdDataTable currentRole = {currentRole} updateDataMethod = {updateDataMethod.bind(this)} updateData = {updateData} uploadDrawingSuccess = {uploadSuccess.bind(this)} updateDrawingSuccess = {updateSuccess.bind(this)} drawingUploadError={drawingUploadError.bind(this)}/>
        exportBtn = <button className="action__btn" name="export" value="export" onClick={() => downloadReport()}>Export</button>
        addRowBtn = null
        saveBtn = null
        backBtn = <button className="navBar__button" onClick={()=>back()} style={{width:"100px", marginTop:"5px"}}><img src={Back} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="navBar__button__text">Back</p></button>

        
    }else if(currentTab === "Edit"){
        if(!busy){
            //Like excel de sptracker
            table = <HotTable
            data={editData}
            colHeaders = {["<b>TAG</b>","<b>PROJECT</b>", "<b>SPEC</b>", "<b>P1BORE</b>", "<b>P2BORE</b>", "P3BORE", "<b>RATING</b>", "<b>END PREPARATION</b>", "<b>LINE ID</b>", "<b>P&ID</b>", "<b>TYPE</b>", "<b>DRAWING DESCRIPTION</b>", "<b>QUANTITY</b>", "REQUISITION", "<b>DESCRIPTION</b>", "<b>ISO DESCRIPTION</b>", "<b>IDENT</b>", "FACE TO FACE", "<b>FLG SHORT CODE</b>", "EQUIPMENT + NOZZLE", "UTILITY STATION", "COMMENTS"]}
            rowHeaders={true}
            width="2200"
            height="635"
            settings={settings} 
            manualColumnResize={true}
            manualRowResize={true}
            filters={true}
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
            columns= {[{ data: "tag", type:'text'}, {data: "project", readOnly: "true"}, {data: "spec", type:"dropdown", strict:"true", source: specData}, {data: p1bore, type:"dropdown", strict:"true", source: diametersData}, {data: p2bore, type:"dropdown", strict:"true", source: diametersData}, {data: p3bore, type:"dropdown", strict:"true", source: diametersData}, {data: "rating", type:"dropdown", strict:"true", source: ratingData}, {data: "end_preparation", type:"dropdown", strict:"true", source: endPreparationData}, {data: "line_id", type:"text"}, {data: "pid", type:"dropdown", strict:"true", source: pidData}, {data: "type", type:"text"}, {data: "description_plan_code", type:"dropdown", allowInvalid:true, source: descriptionPlaneData}, {data:"quantity", type:"numeric"}, { data: "requisition", type:'text'}, { data: "description", type:'text'}, {data: "description_iso", type:"text"},{data: "ident", type:"text"}, {data: "face_to_face", type:"text"}, {data: "bolt_type", type:"dropdown", strict:"true", source: boltTypesData}, {data:"equipnozz", type:"text"}, {data:"utility_station", type:"text"}, {data:"comments", type:"text"}]}
            />
          
            dataTableHeight= "700px"
            addRowBtn = <button class="btn btn-sm btn-success" onClick={() => addRow()} style={{marginRight:"5px", fontSize:"18px", width:"35px", height:"35px", borderRadius:"10px", float:"right", marginTop:"8px"}}>+</button>
            backBtn = null
            saveBtn = <button className="navBar__button" onClick={()=> saveChanges()} style={{marginTop:"7px"}}><img src={SaveIcon} alt="save" className="navBar__icon"></img><p className="navBar__button__text">Save</p></button>
        }else{
            table = <div className="connected__panel"><p className="connected__text">The user {editingUser} is already editing!</p></div>
        }    

    }else if(currentTab === "Requests"){
        backBtn = null
        table = <CSPTrackerdRequestsDataTable updateDataMethod = {updateDataMethod.bind(this)} updateData = {updateData} />
    }else if(currentTab === "CSP KeyParams"){
        backBtn = null
        table = <CSPTrackerKeyParams success={()=> setSuccessAlert(true)}/>
    }


    return(
        
        <body>
            {updateData}
            <IdleTimer
                timeout={1000 * 60 * 15}
                onIdle={handleOnIdle}
                debounce={250}
            />
            <NavBar onChange={value => setCurrentTab(currentTab)}/>
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
            <div className="isotracker__row">
                  <div className="isotracker__column">
                      <img src={CSPTrackerLogo} alt="CSPTrackerLogo" className="isoTrackerLogo__image2" style={{height:"85px"}}/>
                      
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
                                {requestBtn}
                                {editBtn}
                                {notificationsBtn}
                                {designNotificationsBtn}
                                {saveBtn}   
                                {backBtn}
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

export default CSPTracker;