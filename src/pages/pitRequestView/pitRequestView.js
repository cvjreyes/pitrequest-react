import React, { useState , useEffect} from 'react'
import NavBar from '../../components/navBar/navBar'
import PITLogo from "../../assets/images/pitlogo.svg"
import RoleDropDown from '../../components/roleDropDown/roleDropDown'

import IdleTimer from 'react-idle-timer'
import {useNavigate} from "react-router";
import QTrackerViewDataTable from '../../components/qtrackerViewDataTable/qtrackerViewDataTable'

import UsersDataTable from "../../components/usersDataTable/usersDataTable"
import SaveIcon from "../../assets/images/save.svg"
import FolderIcon from "../../assets/images/FolderOpen.png"
import BackIcon from "../../assets/images/back.svg"
import UsersIcon from "../../assets/images/user.png"
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import AddUserPopUp from '../../components/addUserPopUp/addUserPopUp';

import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import './pitRequestView.css'
import ProjectsHoursDataTable from '../../components/projectsHoursDataTable/projectsHoursDataTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import AlertF from "../../components/alert/alert"
import RequestAccessDataTable from '../../components/requestAccessDataTable/requestAccessDataTable'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

const COLORS = ['#D2D2D2', '#FFCA42', '#7BD36D', '#FF3358', '#99C6F8', '#FC9303'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 1.45;
    const x = cx + radius * Math.cos(-midAngle * RADIAN) + 1;
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if(percent === 0){
        return null
    }else{
        if(index === 0){
            index = "Pending"
        }else if(index === 1){
            index = "In progress"
        }else if(index === 2){
            index = "Ready"
        }else if(index === 3){
            index = "Rejected"
        }else if(index === 4){
            index = "Materials"
        }else if(index === 5){
            index = "Ready to Load"
        }
      
        return (
          <text className='label__piechart' x={x} y={y} fill="black" textAnchor={'middle'} dominantBaseline="central">
              {index}
          </text>
        );
    }
    
  };
  

const PitRequestView = () => {

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
    const [saveBtn, setSaveBtn] = useState()
    const [updatedRows, setUpdatedRows] = useState([])
    const [hours, setHours] = useState([])
    const [counter, setCounter] = useState([])
    const [content, setContent] = useState(null)
    const [saveButton, setSaveButton] = useState(null)
    const [completedTable, setCompletedTable] = useState(null)
    const [usersButton, setUsersButton] = useState(null)
    const [addUserButton, setAddUserButton] = useState(null)
    const [exportReport, setExportReport] = useState(null)
    const [exportUsersReport, setExportUsersReport] = useState(null)
    const [backToMenuButton, setBackToMenuButton] = useState(null)
    const [updatedRowsPrio, setUpdatedRowsPrio] = useState([])
    const [projectsButton, setProjectsButton] = useState(null)
    const [requestAccessButton, setRequestAccessButton] = useState(null)
    const [projectFilter, setProjectFilter] = useState([])
    const [usersProjectsFilters, setUsersProjectsFilters] = useState([])
    const [projectDropDown, setProjectDropDown] = useState(null)
    const [currentProject, setCurrentProject] = useState("All")
    const [showAll, setShowAll] = useState(false)
    const [buscadorProyecto, setBuscadorProyecto] = useState(null)

    const [alertComponentCount, setAlertComponentCount] = useState(null)

    const [notReadyWarning, setNotReadyWarning] = useState(false)

    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)

    const [updateData, setUpdateData] = useState(false)    

    const history = useNavigate()

    useEffect(()=>{
        if(!secureStorage.getItem("user")){
            history("/"+process.env.REACT_APP_PROJECT+"/");
        }        
        if(secureStorage.getItem("tab") === "Users"){
            setCurrentTab("Users")
        }
        let options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }
        //Select de los todos los proyectos 
        fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getAllProjects", options)
            .then(response => response.json())
            .then(async json => {
                let projects = []
                for(let i = 0; i < json.projects.length; i++){
                    projects.push(json.projects[i].name)
                }
                setProjectFilter(projects)
            })
        
        //Select los proyectos que tiene el usuario asignado
        fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getProjectsByEmail/" + secureStorage.getItem("user"), options)
            .then(response => response.json())
            .then(async json => {
                let projects = []
                for(let i = 0; i < json.projects.length; i++){
                    projects.push(json.projects[i].name)
                }
                setUsersProjectsFilters(projects)
            })
        
        //Comprobamos si el admin tiene incidencias abiertas de mas de dos semanas
        fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/urgent/" + secureStorage.getItem('user'), options)
        .then(response => response.json())
        .then(async json => {
            if(json.urgent > 0){
                setAlertComponentCount(<div className={`alert alert-success alert-shown`}>
                <AlertF type="warning" text={`You have ${json.urgent} urgent incidences!`} margin="-27px"/>
                </div>)
                setTimeout(() => {
                    setAlertComponentCount(null)
                }, 3000);
            }
        })
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
            
            
            if(secureStorage.getItem("role") === "3D Admin"){ //Si el user es 3d admin tiene la opcion de guardar cambios y acceder a la ventana de usuarios
                setSaveBtn(<button className="navBar__button" onClick={()=> saveChanges()}><img src={SaveIcon} alt="save" className="navBar__icon"></img><p className="navBar__button__text">Save</p></button>)
                setUsersButton(<button className="navBar__button" onClick={()=>setCurrentTab("Users")} style={{width:"100px"}}><img src={UsersIcon} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="navBar__button__text">Users</p></button>)
            }else{
                setSaveBtn(null)
                setUsersButton(null)
            }
            
    },[currentRole]);

    useEffect(async ()=>{
        const body = {
            user: currentUser,
        }
        let options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        } 
        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/statusData", options)
            .then(response => response.json())
            .then(async json => {
                let counter = [{name: "Pending", value: json.pending}, {name: "In progress", value: json.progress}, {name: "Accepted", value: json.accepted}, {name: "Rejected", value: json.rejected}, {name: "Materials", value: json.materials}, {name: "Ready to Load", value: json.readytoload}]
                await setCounter(counter)
                // console.log("Counter: " + JSON.stringify(counter));
            })
            

    },[updateData])

    useEffect(async ()=>{ //Si se activa el toggle de showAll se muestran todas las incidencias, no solo las que estan abiertas
        // console.log("show all use effect: " + showAll);
        setContent(<QTrackerViewDataTable updateObservations={updateObservations.bind(this)} updateHours={updateHours.bind(this)} updateData={updateData} updateStatus={updateStatus.bind(this)} updatePriority={updatePriority.bind(this)} changeAdmin={changeAdmin.bind(this)} currentProject={currentProject} showAll={showAll} alertCount={showAlertCount.bind(this)} currentUser= {currentUser}/>)
    },[showAll])

    useEffect(async () =>{
        
        if(currentRole === "3D Admin"){ //Si el user es 3d admin
            if(currentTab === "View"){ //Si el tab actual es la vista
                secureStorage.setItem("tab", "View")
                setSaveButton(<button className="navBar__button" onClick={()=> saveChanges()}><img src={SaveIcon} alt="save" className="navBar__icon"></img><p className="navBar__button__text">Save</p></button>)
                setAddUserButton(null)
                setExportReport(<button className="action__btn" name="export" value="export" onClick={() => downloadReport()}>Export</button>)
                setUsersButton(<button className="navBar__button" onClick={()=>setCurrentTab("Users")} style={{width:"100px"}}><img src={UsersIcon} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="navBar__button__text">Users</p></button>)
                setContent(<QTrackerViewDataTable updateObservations={updateObservations.bind(this)} updateHours={updateHours.bind(this)} updateData={updateData} updateStatus={updateStatus.bind(this)} updatePriority={updatePriority.bind(this)} changeAdmin={changeAdmin.bind(this)} currentProject={currentProject} showAll={showAll} alertCount={showAlertCount.bind(this)}/>)
                setExportUsersReport(null)
                setProjectsButton(<button className="navBar__button" style={{width:"130px"}} onClick={()=> setCurrentTab("Projects")}><img src={FolderIcon} alt="pro" className="navBar__icon"></img><p className="navBar__button__text">Projects</p></button>)
                setBackToMenuButton(<button className="navBar__button" onClick={()=>back()} style={{width:"100px"}}><img src={BackIcon} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="navBar__button__text">Back</p></button>)
                setRequestAccessButton(null)
                setBuscadorProyecto(<div><button style={{display:"flex", float:"right", width:"150px", marginRight:"-100px"}} className="navBar__button" onClick={()=> saveChanges()}><FontAwesomeIcon icon="fa-duotone fa-magnifying-glass" /><p className="navBar__button__text">Buscador</p></button></div>)
                //Aqui tenemos un select con los proyectos que tiene el usuario
                //Si queremos que aparazcan todos tenemos que cambiar el usersProjectsFilters => projectFilter
                setProjectDropDown(<div style={{display:"flex", float:"right"}}><div style={{display: "inline-block"}}><label for="projectFilter" className="project__label" style={{marginLeft: "-280px", marginRight: "230px"}}>Project: </label><select style={{float:"right"}} id="projectFilter" className="projectFilterSelect"  onChange={(e) => setCurrentProject(e.target.value)}>
                        <option disabled selected value> -- select an option -- </option>
                        {usersProjectsFilters.map(project =>(
                            <option>{project}</option>
                        ))}
                    </select>
                <button className="navBar__button__buscador" onClick={()=> saveChanges()}><FontAwesomeIcon className="navBar__icon__buscador" icon={faMagnifyingGlass} /></button>
                </div>
                </div>)
                setCompletedTable(<div style={{display:"flex", float:"right"}}>
                        <label className="showAllSwitchBtn">
                            <p className="showAll__text">Completed</p>
                            <input type="checkbox" id="edit" style={{marginLeft: "30px"}} onClick={()=> setShowAll(!showAll)}/>
                            <div className="slide round"></div>
                        </label>
                    </div>)
            }else if(currentTab === "Users"){ //Si es la tabla de usuarios
                secureStorage.setItem("tab", "Users")
                setExportUsersReport(<button className="action__btn" name="export" value="export" onClick={() => downloadUsersReport()}>Export</button>)
                setExportReport(null)
                setAddUserButton(<AddUserPopUp addUser={addUser.bind(this)}/>)
                setProjectsButton(<button className="navBar__button" style={{width:"130px"}} onClick={()=> setCurrentTab("Projects")}><img src={FolderIcon} alt="pro" className="navBar__icon"></img><p className="navBar__button__text">Projects</p></button>)
                setSaveButton(null)
                setUsersButton(null)
                setContent(<UsersDataTable updateData={updateData} deleteUser={deleteUser.bind(this)} submitRoles={submitRoles.bind(this)} submitProjects={submitProjects.bind(this)}/>)
                setBackToMenuButton(<button className="navBar__button" onClick={()=> setCurrentTab("View")} style={{width:"100px"}}><img src={BackIcon} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="navBar__button__text">Back</p></button>)
                setRequestAccessButton(<button className="navBar__button" onClick={()=>setCurrentTab("Access")} style={{width:"170px"}}><img src={UsersIcon} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="navBar__button__text">Access requests</p></button>)
                setProjectDropDown(null)
                setCompletedTable(null)
                setBuscadorProyecto(null)
            }else if(currentTab === "Access"){ //Si es la tabla de gestion de peticiones de acceso
                secureStorage.setItem("tab", "Access")
                setExportUsersReport(null)
                setExportReport(null)
                setAddUserButton(null)
                setProjectsButton(null)
                setSaveButton(null)
                setUsersButton(null)
                setContent(<RequestAccessDataTable updateData={updateData} user={secureStorage.getItem("user")} acceptRequest={acceptRequest.bind(this)} rejectRequest={rejectRequest.bind(this)}/>)
                setBackToMenuButton(<button className="navBar__button" onClick={()=> setCurrentTab("Users")} style={{width:"100px"}}><img src={BackIcon} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="navBar__button__text">Back</p></button>)
                setRequestAccessButton(null)
                setProjectDropDown(null)
                setCompletedTable(null)
                setBuscadorProyecto(null)
            }else if(currentTab === "Projects"){ //Si estamos en la vista de proyectos
                secureStorage.setItem("tab", "Projects")
                setProjectsButton(null)
                setContent(<ProjectsHoursDataTable/>)
                setBackToMenuButton(<button className="navBar__button" onClick={()=> setCurrentTab("View")} style={{width:"100px"}}><img src={BackIcon} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="navBar__button__text">Back</p></button>)
                setSaveButton(null)
                setAddUserButton(null)
                setExportReport(null)
                setUsersButton(null)
                setExportUsersReport(null)
                setRequestAccessButton(null)
                setProjectDropDown(null)
                setCompletedTable(null)
                setBuscadorProyecto(null)
            }
        }else{ //Si no es 3d admin se muestra la vista de incidencias normal
            setContent(<QTrackerViewDataTable updateObservations={updateObservations.bind(this)} updateHours={updateHours.bind(this)} updateData={updateData} updateStatus={updateStatus.bind(this)} updatePriority={updatePriority.bind(this)} changeAdmin={changeAdmin.bind(this)} currentProject={currentProject} showAll={showAll} alertCount={showAlertCount.bind(this)} currentUser= {currentUser}/>)
            setBackToMenuButton(<button className="navBar__button" onClick={()=>back()} style={{width:"100px"}}><img src={BackIcon} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="navBar__button__text">Back</p></button>)
            setSaveButton(null)
            setAddUserButton(null)
            setExportReport(null)
            setProjectsButton(null)
            setUsersButton(null)
            setExportUsersReport(null)
            setRequestAccessButton(null)
            setProjectDropDown(null)
            setBuscadorProyecto(null)
            // console.log("Show all 2: " + showAll);
            setCompletedTable(<div style={{display:"flex", float:"right"}}>
                <label className="showAllSwitchBtn">
                    <p className="showAll__text">Completed</p>
                    <input type="checkbox" id="edit" style={{marginLeft: "30px"}} onClick={()=> setShowAll(!showAll)}/>
                    <div className="slide round"></div>
                </label>
            </div>)
        }
        
    }, [currentTab, updateData, currentRole, currentProject, showAll])

    function back(){
        history("/"+process.env.REACT_APP_PROJECT+"/pitrequests")
    }

    function showAlertCount(count){
        
    }
    async function submitRoles(id, roles){
        
        localStorage.setItem("update", true)
        const body = {
            id: id,
            roles: roles
        }

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }

        //Post de roles de un usuario
        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/users/manageRoles", options)
        .then(response => response.json())
        .then(async json =>{
            if(json.success){
                setSuccess(true)
                await setUpdateData(!updateData)
            }
        })
        await setUpdateData(!updateData)
    }

    async function deleteUser(id){
        
        localStorage.setItem("update", true)


        const options = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        }

        //Post del delete de un usuario
        fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/api/user/"+id, options)
        .then(response => response.json())
        .then(json =>{
            if(json.error){
                setError(true)
            }else{
                setSuccess(true)
            }
        })

       setUpdateData(!updateData)

    }

    async function addUser(username, email, roles){
        
        localStorage.setItem("update", true)

        const body = {
            username: username,
            email: email,
            roles: roles
        }

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }

        //Post de la creacion de usuario
        fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/createUser", options)
        .then(response => response.json())
        .then(json =>{
            if(json.success){
                setSuccess(true)
            }else {
                setError(true)
            }
        })
        setUpdateData(!updateData)
        
    }

    async function submitProjects(id, projects){
        const body ={
            userid: id,
            projects: projects
          }
      
          const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
          }
          
          //Submit de proyectos
          fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/updateProjects/", options)
          .then(response => response.json())
          .then(json =>{
              if(json.success){
                  setSuccess(true)
                }else{
                    setError(true)
                }
            })
          await setUpdateData(!updateData)

    }


    function handleOnIdle(){
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

    async function changeAdmin(admin, incidence_number, type){
        const body = {
            admin: admin,
            incidence_number: incidence_number,
            type: type,
            currentAdmin: secureStorage.getItem("user")
          }
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
          body: JSON.stringify(body)
        }

        //Post del cambio de admins
        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/changeAdmin", options)
        .then(response => response.json())
          .then(json =>{
            if(json.success){
                setUpdateData(!updateData)
                setSuccess(true)
            }
          })
    }

    async function downloadReport(){

        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getNWC", options)
        .then(response => response.json())
        .then(async json => {
          var rows = []
          var row = null
            for(let i = 0; i < json.rows.length; i++){
                row = {incidence_number: json.rows[i].incidence_number, project:json.rows[i].project, carta: json.rows[i].carta, user: json.rows[i].user, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), observations: json.rows[i].observations, spref: json.rows[i].spref, name: null, pipe: null, sending: null, items: null, scope: null, description: json.rows[i].description, hours: json.rows[i].hours, admin: json.rows[i].admin, ar_date: json.rows[i].accept_reject_date}
                  
                  if(json.rows[i].status === 0){
                    row.status = "Pending"
                  }else if(json.rows[i].status === 1){
                      row.status = "In progress"
                  }else if(json.rows[i].status === 2){
                      row.status = "Ready"
                  }else if(json.rows[i].status === 3){
                      row.status = "Rejected"
                  }else if(json.rows[i].status === 4){
                      row.status = "Materials"
                  }

                  if(json.rows[i].accept_reject_date){
                   
                    row.ar_date = json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19)
                  
                  }
                
                
                rows.push(row)
            }
            await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getNVN", options)
            .then(response => response.json())
            .then(async json => {
            var row = null
                for(let i = 0; i < json.rows.length; i++){
                    row = {incidence_number: json.rows[i].incidence_number, project:json.rows[i].project, carta: json.rows[i].carta, user: json.rows[i].user, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), observations: json.rows[i].observations, spref: null, name: json.rows[i].name, pipe: null, sending: null, items: null, scope: null, description: json.rows[i].description, hours: json.rows[i].hours, admin: json.rows[i].admin, ar_date: json.rows[i].accept_reject_date}
                    
                    if(json.rows[i].status === 0){
                        row.status = "Pending"
                      }else if(json.rows[i].status === 1){
                          row.status = "In progress"
                      }else if(json.rows[i].status === 2){
                          row.status = "Ready"
                      }else if(json.rows[i].status === 3){
                          row.status = "Rejected"
                      }else if(json.rows[i].status === 4){
                          row.status = "Materials"
                      }

                      if(json.rows[i].accept_reject_date){
                        row.ar_date = json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19)
                    }
                      rows.push(row)
                }
                
                await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getNRI", options)
                .then(response => response.json())
                .then(async json => {
                var row = null
                    for(let i = 0; i < json.rows.length; i++){
                        row = {incidence_number: json.rows[i].incidence_number, project:json.rows[i].project, carta: json.rows[i].carta, user: json.rows[i].user, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), observations: json.rows[i].observations, spref: null, name: null, pipe: json.rows[i].pipe, items: null, scope: null, description: json.rows[i].description,hours: json.rows[i].hours, admin: json.rows[i].admin, ar_date: json.rows[i].accept_reject_date}
                                             
                        if(json.rows[i].status === 0){
                            row.status = "Pending"
                          }else if(json.rows[i].status === 1){
                              row.status = "In progress"
                          }else if(json.rows[i].status === 2){
                              row.status = "Ready"
                          }else if(json.rows[i].status === 3){
                              row.status = "Rejected"
                          }else if(json.rows[i].status === 4){
                              row.status = "Materials"
                          }

                        if(json.rows[i].accept_reject_date){
                    row.ar_date = json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19)
                  }
                        
                        rows.push(row)
                    }
                    
                    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getNRB", options)
                    .then(response => response.json())
                    .then(async json => {
                    var row = null
                        for(let i = 0; i < json.rows.length; i++){
                            row = {incidence_number: json.rows[i].incidence_number, project:json.rows[i].project, carta: json.rows[i].carta, user: json.rows[i].user, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), observations: json.rows[i].observations, spref: null, name: null, pipe: json.rows[i].pipe, items: null, scope: null, description: json.rows[i].description, hours: json.rows[i].hours, admin: json.rows[i].admin, ar_date: json.rows[i].accept_reject_date}
                            
                            if(json.rows[i].status === 0){
                                row.status = "Pending"
                              }else if(json.rows[i].status === 1){
                                  row.status = "In progress"
                              }else if(json.rows[i].status === 2){
                                  row.status = "Ready"
                              }else if(json.rows[i].status === 3){
                                  row.status = "Rejected"
                              }else if(json.rows[i].status === 4){
                                  row.status = "Materials"
                              }
            
                            
                              if(json.rows[i].accept_reject_date){
                                row.ar_date = json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19)
                                }
                              rows.push(row)
                        }
                        
                        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getNRIDS", options)
                        .then(response => response.json())
                        .then(async json => {
                        var row = null
                            for(let i = 0; i < json.rows.length; i++){
                                row = {incidence_number: json.rows[i].incidence_number, project:json.rows[i].project, carta: json.rows[i].carta, user: json.rows[i].user, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), observations: json.rows[i].observations, spref: null, name: json.rows[i].name, pipe: null, sending: null, items: null, scope: null, description: null, hours: json.rows[i].hours, admin: json.rows[i].admin, ar_date: json.rows[i].accept_reject_date}
                               
                                if(json.rows[i].status === 0){
                                    row.status = "Pending"
                                  }else if(json.rows[i].status === 1){
                                      row.status = "In progress"
                                  }else if(json.rows[i].status === 2){
                                      row.status = "Ready"
                                  }else if(json.rows[i].status === 3){
                                      row.status = "Rejected"
                                  }else if(json.rows[i].status === 4){
                                      row.status = "Materials"
                                  }
                                
                                  if(json.rows[i].accept_reject_date){
                                    row.ar_date = json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19)
                                }
                                  rows.push(row)
                            }
                            
                            await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getRP", options)
                            .then(response => response.json())
                            .then(async json => {
                            var row = null
                                for(let i = 0; i < json.rows.length; i++){
                                    row = {incidence_number: json.rows[i].incidence_number, project:json.rows[i].project, carta: json.rows[i].carta, user: json.rows[i].user, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), observations: json.rows[i].observations, spref: null, name: null, pipe: null, sending: null, items: json.rows[i].items_to_report, scope: json.rows[i].scope, description: json.rows[i].description, hours: json.rows[i].hours, admin: json.rows[i].admin, ar_data: json.rows[i].accept_reject_date}
                                    
                                    if(json.rows[i].status === 0){
                                        row.status = "Pending"
                                      }else if(json.rows[i].status === 1){
                                          row.status = "In progress"
                                      }else if(json.rows[i].status === 2){
                                          row.status = "Ready"
                                      }else if(json.rows[i].status === 3){
                                          row.status = "Rejected"
                                      }else if(json.rows[i].status === 4){
                                          row.status = "Materials"
                                      }
                                    
                                      if(json.rows[i].accept_reject_date){
                                        row.ar_date = json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19)
                                      }
                                    rows.push(row)
                                }

                                // Sort the array based on the second element
                                rows.sort(function(first, second) {
                                  return second.created_at.localeCompare(first.created_at);
                                });

                                await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getIS", options)
                                .then(response => response.json())
                                .then(async json => {
                                    var row = null
                                    for(let i = 0; i < json.rows.length; i++){
                                        row = {incidence_number: json.rows[i].incidence_number, project:json.rows[i].project, carta: json.rows[i].carta, user: json.rows[i].user, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), observations: json.rows[i].observations, spref: null, name: null, pipe: null, sending: null, sending:  json.rows[i].sending, items: null, scope: null, description: json.rows[i].description,hours: json.rows[i].hours, admin: json.rows[i].admin, ar_date: json.rows[i].accept_reject_date}
                                        
                                        if(json.rows[i].status === 0){
                                            row.status = "Pending"
                                          }else if(json.rows[i].status === 1){
                                              row.status = "In progress"
                                          }else if(json.rows[i].status === 2){
                                              row.status = "Ready"
                                          }else if(json.rows[i].status === 3){
                                              row.status = "Rejected"
                                          }else if(json.rows[i].status === 4){
                                              row.status = "Materials"
                                          }
                                        
                                        if(json.rows[i].accept_reject_date){
                                            row.ar_date = json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19)
                                        }
                                        rows.push(row)
                                    }

                                    // Sort the array based on the second element
                                    rows.sort(function(first, second) {
                                    return second.created_at.localeCompare(first.created_at);
                                    });
                                    
                                        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getDIS", options)
                                        .then(response => response.json())
                                        .then(async json => {
                                            var row = null
                                            for(let i = 0; i < json.rows.length; i++){
                                                row = {incidence_number: json.rows[i].incidence_number, project:json.rows[i].project, carta: json.rows[i].carta, user: json.rows[i].user, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), observations: json.rows[i].observations, spref: null, name: null, pipe: null, sending: null, sending:  json.rows[i].sending, items: null, scope: null, description: json.rows[i].description,hours: json.rows[i].hours, admin: json.rows[i].admin, ar_date: json.rows[i].accept_reject_date}
                                                
                                                if(json.rows[i].status === 0){
                                                    row.status = "Pending"
                                                }else if(json.rows[i].status === 1){
                                                    row.status = "In progress"
                                                }else if(json.rows[i].status === 2){
                                                    row.status = "Ready"
                                                }else{
                                                    row.status = "Rejected"
                                                }
                                                
                                                if(json.rows[i].accept_reject_date){
                                                    row.ar_date = json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19)
                                                }
                                                rows.push(row)
                                            }
                                            await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getPER", options)
                                            .then(response => response.json())
                                            .then(async json => {
                                                var row = null
                                                for(let i = 0; i < json.rows.length; i++){
                                                    row = {incidence_number: json.rows[i].incidence_number, project:json.rows[i].project, carta: json.rows[i].carta, user: json.rows[i].user, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), observations: json.rows[i].observations, spref: null, name: null, pipe: null, sending: null, sending:  json.rows[i].sending, items: null, scope: null, description: json.rows[i].description,hours: json.rows[i].hours, admin: json.rows[i].admin, ar_date: json.rows[i].accept_reject_date}
                                                    
                                                    if(json.rows[i].status === 0){
                                                        row.status = "Pending"
                                                    }else if(json.rows[i].status === 1){
                                                        row.status = "In progress"
                                                    }else if(json.rows[i].status === 2){
                                                        row.status = "Ready"
                                                    }else{
                                                        row.status = "Rejected"
                                                    }
                                                    
                                                    if(json.rows[i].accept_reject_date){
                                                        row.ar_date = json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19)
                                                    }
                                                    rows.push(row)
                                                }

                                                await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getMOD", options)
                                                .then(response => response.json())
                                                .then(async json => {
                                                    var row = null
                                                    for(let i = 0; i < json.rows.length; i++){
                                                        row = {incidence_number: json.rows[i].incidence_number, project:json.rows[i].project, carta: json.rows[i].carta, user: json.rows[i].user, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), observations: json.rows[i].observations, spref: null, name: null, pipe: null, sending: null, sending:  json.rows[i].sending, items: null, scope: null, description: json.rows[i].description,hours: json.rows[i].hours, admin: json.rows[i].admin, ar_date: json.rows[i].accept_reject_date}
                                                        
                                                        if(json.rows[i].status === 0){
                                                            row.status = "Pending"
                                                        }else if(json.rows[i].status === 1){
                                                            row.status = "In progress"
                                                        }else if(json.rows[i].status === 2){
                                                            row.status = "Ready"
                                                        }else{
                                                            row.status = "Rejected"
                                                        }
                                                        
                                                        if(json.rows[i].accept_reject_date){
                                                            row.ar_date = json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19)
                                                        }
                                                        rows.push(row)
                                                }

                                                await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getDSO", options)
                                                .then(response => response.json())
                                                .then(async json => {
                                                    var row = null
                                                    for(let i = 0; i < json.rows.length; i++){
                                                        row = {incidence_number: json.rows[i].incidence_number, project:json.rows[i].project, carta: json.rows[i].carta, user: json.rows[i].user, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), observations: json.rows[i].observations, spref: null, name: null, pipe: null, sending: null, sending:  json.rows[i].sending, items: null, scope: null, description: json.rows[i].description,hours: json.rows[i].hours, admin: json.rows[i].admin, ar_date: json.rows[i].accept_reject_date}
                                                        
                                                        if(json.rows[i].status === 0){
                                                            row.status = "Pending"
                                                        }else if(json.rows[i].status === 1){
                                                            row.status = "In progress"
                                                        }else if(json.rows[i].status === 2){
                                                            row.status = "Ready"
                                                        }else{
                                                            row.status = "Rejected"
                                                        }
                                                        
                                                        if(json.rows[i].accept_reject_date){
                                                            row.ar_date = json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19)
                                                        }
                                                        rows.push(row)
                                                    }

                                                    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getDOR", options)
                                                    .then(response => response.json())
                                                    .then(async json => {
                                                        var row = null
                                                        for(let i = 0; i < json.rows.length; i++){
                                                            row = {incidence_number: json.rows[i].incidence_number, project:json.rows[i].project, carta: json.rows[i].carta, user: json.rows[i].user, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), observations: json.rows[i].observations, spref: null, name: null, pipe: null, sending: null, sending:  json.rows[i].sending, items: null, scope: null, description: json.rows[i].description,hours: json.rows[i].hours, admin: json.rows[i].admin, ar_date: json.rows[i].accept_reject_date}
                                                            
                                                            if(json.rows[i].status === 0){
                                                                row.status = "Pending"
                                                            }else if(json.rows[i].status === 1){
                                                                row.status = "In progress"
                                                            }else if(json.rows[i].status === 2){
                                                                row.status = "Ready"
                                                            }else{
                                                                row.status = "Rejected"
                                                            }
                                                            
                                                            if(json.rows[i].accept_reject_date){
                                                                row.ar_date = json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19)
                                                            }
                                                            rows.push(row)
                                                        }

                                                        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getCIT", options)
                                                        .then(response => response.json())
                                                        .then(async json => {
                                                            var row = null
                                                            for(let i = 0; i < json.rows.length; i++){
                                                                row = {incidence_number: json.rows[i].incidence_number, project:json.rows[i].project, carta: json.rows[i].carta, user: json.rows[i].user, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), observations: json.rows[i].observations, spref: null, name: null, pipe: null, sending: null, sending:  json.rows[i].sending, items: null, scope: null, description: json.rows[i].description,hours: json.rows[i].hours, admin: json.rows[i].admin, ar_date: json.rows[i].accept_reject_date}
                                                                
                                                                if(json.rows[i].status === 0){
                                                                    row.status = "Pending"
                                                                }else if(json.rows[i].status === 1){
                                                                    row.status = "In progress"
                                                                }else if(json.rows[i].status === 2){
                                                                    row.status = "Ready"
                                                                }else{
                                                                    row.status = "Rejected"
                                                                }
                                                                
                                                                if(json.rows[i].accept_reject_date){
                                                                    row.ar_date = json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19)
                                                                }
                                                                rows.push(row)
                                                            }

                                                        // Sort the array based on the second element
                                                        rows.sort(function(first, second) {
                                                        return second.created_at.localeCompare(first.created_at);
                                                        });

                                                        const headers = ["Reference", "Project", "Carta", "User", "Date", "Observations", "SPREF", "Name", "Pipe", "Sending", "Items", "Scope", "Description", "Hours", "Admin", "Accepted/Rejected date", "Status"]
                                                        const apiData = rows
                                                        const fileName = "QueryTracker report"

                                                        const fileType =
                                                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
                                                        const header_cells = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1', 'J1', 'K1', 'L1', 'M1', 'N1', 'O1', 'P1', 'Q1', 'R1', 'S1']
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
                                                    })
                                                })
                                            })
                                        })
                                    })

                                })

                            })

                        })

                    })

                })

            })
            
        })
    }

    async function downloadUsersReport(){
        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/downloadUsers/")
        .then(response => response.json())
        .then(async json => {
            let users = json.rows
            let roles = []
            let projects = []
            for(let i = 0; i < users.length; i++){
                await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getRolesByEmail/" + users[i].email)
                .then(response => response.json())
                .then(json => {

                    if(json.rows){
                        let user_roles = []
                        for(let i = 0; i < json.rows.length; i++){
                            user_roles.push(json.rows[i].name)
                        }
                        roles.push(user_roles)
                    }else{
                        roles.push(["None"])
                    }
                })
            }
            for(let i = 0; i < users.length; i++){
                await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getProjectsByEmailExport/" + users[i].email)
                .then(response => response.json())
                .then(json => {
                    if(json.rows){
                        let user_projects = []
                        for(let i = 0; i < json.rows.length; i++){
                            user_projects.push(json.rows[i].name)
                        }
                        projects.push(user_projects)
                    }else{
                        projects.push(["None"])
                    }
                })

            }
            

            for(let i = 0; i < users.length; i++){
                users[i].roles = roles[i].toString()
                users[i].projects = projects[i].toString()
            }

           
            const headers = ["Username", "Email", "Roles", "Projects"]
            const apiData = users
            const fileName = "Users"

            const fileType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
            const header_cells = ['A1', 'B1', 'C1', 'D1']
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

    async function updateStatus(updatedRow){
        let currentRows = updatedRows
        currentRows.push(updatedRow)
        await setUpdatedRows(currentRows)
    }

    async function updateObservations(newObservations){
          let body = {
            incidence_number: newObservations[0],
            observation: newObservations[1],
          }
          let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
          }
          
          //Post de las nuevas observaciones
          await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/updateObservations", options)
          .then(response => response.json())
          .then(async json => {
            if(!json.success){
                setError(true)
            }else{
                setSuccess(true)
                setUpdateData(!updateData)
            }
          })
    }

    async function updateHours(newhours){
        let body = {
            incidence_number: newhours[0],
            hours: newhours[1],
          }
          let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
          }
          
          //Post de las nuevas horas
          await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/updateHours", options)
          .then(response => response.json())
          .then(async json => {
            if(!json.success){
                setError(true)
            }else{
                setSuccess(true)
                setUpdateData(!updateData)
            }
          })
    }

    async function updatePriority(updatedRow){
        let currentRows = updatedRowsPrio
        currentRows.push(updatedRow)
        await setUpdatedRowsPrio(currentRows)
    }

    async function saveChanges(){
        let err = false
        let notReady = false

        for(let i = 0; i < hours.length; i++){ //Por cada cambio en las horas
            let body = {
                incidence_number: hours[i][0],
                hours: hours[i][1],
              }
              let options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
              }

              console.log("Option Hours" + JSON.stringify(body));
              //Actualizamos las horas
              await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/updateHours", options)
              .then(response => response.json())
              .then(async json => {
                console.log("Update Hours: " + JSON.stringify(json));
                if(!json.success){
                    err = true
                }
                
              })
        }

        for(let i = 0; i < updatedRows.length; i++){ //Por cada cambio en el status
            let body = {
                incidence_number: updatedRows[i][0],
                status_id: updatedRows[i][1],
                project: updatedRows[i][2],
                type: updatedRows[i][3],
                email: secureStorage.getItem("user")
              }
              let options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
              }
              
              //Actualizamos el status
              await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/updateStatus", options)
              .then(response => response.json())
              .then(async json => {
                if(!json.success){
                    err = true
                }else if(json.notReady){
                    notReady = true
                }
              })
        }
        if(err){
            setError(true)
        }else if(notReady){
            setNotReadyWarning(true)
        }else{
            setSuccess(true)
        }

        setUpdatedRows([])
        for(let i = 0; i < updatedRowsPrio.length; i++){ //Por cada cambio en la prioridad

            let body = {
                incidence_number: updatedRowsPrio[i][0],
                priority_id: updatedRowsPrio[i][1],
                project: updatedRowsPrio[i][2],
                type: updatedRowsPrio[i][3],
                email: secureStorage.getItem("user")
              }
              let options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
              }
              
              //Actualizamos la prioridad
              fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/updatePriority", options)
              .then(response => response.json())
              .then(async json => {
                
              })
        }

        await setUpdatedRowsPrio([])
        await setUpdateData(!updateData)
    }

    async function editProjects(){
        setCurrentTab("Projects")
    }

    async function changeRole(value){ //Al cambiar el rol cambiamos la vista
        setCurrentRole(value)
        await setUpdateData(!updateData)
        if(currentTab === "View"){
            setContent(<QTrackerViewDataTable updateObservations={updateObservations.bind(this)} updateHours={updateHours.bind(this)} updateData={updateData} updateStatus={updateStatus.bind(this)} updatePriority={updatePriority.bind(this)} changeAdmin={changeAdmin.bind(this)} showAll={showAll} alertCount={showAlertCount.bind(this)} currentUser= {currentUser} />)
        }
    }

    async function acceptRequest(id){ //Aceptar una request por su id
        let body = {
            id: id,
            user: currentUser
          }
          let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
          }
          
          await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/acceptAccessRequest", options)
          .then(response => response.json())
          .then(async json => {
            if(json.success){
                await setSuccess(true)
                await setUpdateData(!updateData)
            }
          })
    }

    async function rejectRequest(id){ //Rechazar una request por su id
        let body = {
            id: id,
            user: currentUser
          }
          let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
          }
          
          await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/rejectAccessRequest", options)
          .then(response => response.json())
          .then(async json => {
            if(json.success){
                await setSuccess(true)
                await setUpdateData(!updateData)
            }
          })
    }

    document.body.style.zoom = 0.8

    var dataTableHeight = "600px"

    return(
        
        <div>
            {updateData}
            <div
                className={`alert alert-success ${success ? 'alert-shown' : 'alert-hidden'}`}
                onTransitionEnd={() => setSuccess(false)}
                >
                <AlertF type="success" text="Changes saved successfully!" margin="-100px"/>
            </div>
            <div
                className={`alert alert-success ${error ? 'alert-shown' : 'alert-hidden'}`}
                onTransitionEnd={() => setError(false)}
                >
                <AlertF type="error" subtext="A problem occurred while saving changes!" />
            </div>
            <div
                className={`alert alert-success ${notReadyWarning ? 'alert-shown' : 'alert-hidden'}`}
                onTransitionEnd={() => setNotReadyWarning(false)}
                >
                <AlertF type="warning" text="Hours missing on completion!" />
            </div>
            {alertComponentCount}
            <IdleTimer
                timeout={1000 * 60 * 15}
                onIdle={handleOnIdle}
                debounce={250}
            />
            <div style={{zoom:1.125}}>
                <NavBar onChange={value => setCurrentTab(currentTab)}/>
            </div>
            
            <div className="isotracker__row">
                <div className="isotracker__column">
                    <img src={PITLogo} alt="PITLogo" className="isoTrackerLogo__image2" style={{height:"110px"}}/>
                    
                    <div className="roleSelector__containerF">
                        <RoleDropDown style={{paddingLeft: "2px"}} onChange={value => changeRole(value)} roles = {roles}/>
                    </div>
                    
                </div>
                <PieChart width={600} height={400}>
                    <Pie data={counter} dataKey="value" cx="50%" cy="60%"  outerRadius={120} fill="#8884d8" label={renderCustomizedLabel}>
                    {counter.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                    </Pie>
                    <Tooltip/>
                </PieChart>
            </div>
            <table className="isotracker__table__container">
                <tbody>
                    <tr className="isotracker__table__navBar__container" style={{height:"65px "}}>
                        <th  className="isotracker__table__navBar">
                            <div style={{display:"flex"}}>
                                <div>
                                {backToMenuButton}
                                {saveButton}
                                {projectsButton}
                                {usersButton}
                                {requestAccessButton}
                                {completedTable}
                                {projectDropDown}
                                
                                </div>
                                
                            </div>                           
                            
                        </th>
                    </tr>
                    <tr className="isotracker__table__tray__and__table__container" style={{height: dataTableHeight}}>
                        <td className="discplines__table__table" style={{height: dataTableHeight}} >
                            <div  style={{height: dataTableHeight, width:"2200px"}} className="isotracker__table__table__container">
                                {content}
                            </div>
                        </td>
                        
                    </tr>
                </tbody>
            </table>
            <center className="actionBtns__container">   
            <div style={{display:"flex", marginTop:"10px"}}>
                {addUserButton}
                {exportReport}
                {exportUsersReport}
            </div>
            
            </center>
            <br></br>
         </div>
    )
}

export default PitRequestView;