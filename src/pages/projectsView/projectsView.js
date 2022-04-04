import React, { useState , useEffect} from 'react'
import NavBar from '../../components/navBar/navBar'
import PITLogo from "../../assets/images/pitlogo.svg"

import IdleTimer from 'react-idle-timer'
import {useNavigate} from "react-router";

import SaveIcon from "../../assets/images/save.svg"
import FolderIcon from "../../assets/images/FolderOpen.png"
import BackIcon from "../../assets/images/back.svg"

import ProjectsViewDataTable from '../../components/projectsViewDataTable/projectsViewDataTable';

import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import './projectsView.css'

import AlertF from "../../components/alert/alert"
import ProjectsHoursDataTable from '../../components/projectsHoursDataTable/projectsHoursDataTable';


/*
const COLORS = ['#D2D2D2', '#FFCA42', '#7BD36D', '#FF3358'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if(index === 0){
        index = "Pen"
    }else if(index === 1){
        index = "Pro"
    }else if(index === 2){
        index = "A"
    }else if(index === 3){
        index = "R"
    }
  
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
          {index}
      </text>
    );
  };
  
*/
const ProjectsView = () => {

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

    const [currentTab, setCurrentTab] = useState("View")
    const [saveBtn, setSaveBtn] = useState()
    const [updatedRows, setUpdatedRows] = useState([])
    const [observations, setObservations] = useState()
    const [hours, setHours] = useState()
    const [counter, setCounter] = useState([])
    const [content, setContent] = useState(null)
    const [projectsButton, setProjectsButton] = useState(null)
    const [saveButton, setSaveButton] = useState(null)
    const [usersButton, setUsersButton] = useState(null)
    const [backButton, setBackButton] = useState(null)

    const [updateData, setUpdateData] = useState(false)    

    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)

    const history = useNavigate()

    useEffect(()=>{
        if(!secureStorage.getItem("user")){
            history("/"+process.env.REACT_APP_PROJECT+"/");
        }
        
    }, [])

    var currentUser = secureStorage.getItem('user')



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
                let counter = [{name: "Pending", value: json.pending}, {name: "In progress", value: json.progress}, {name: "Accepted", value: json.accepted}, {name: "Rejected", value: json.rejected}]
                
                await setCounter(counter)
            })
            

    },[updateData])

    useEffect(async () =>{
        if(currentTab === "View"){
            setSaveButton(<button className="navBar__button" onClick={()=> saveChanges()}><img src={SaveIcon} alt="save" className="navBar__icon"></img><p className="navBar__button__text">Save</p></button>)
            setProjectsButton(<button className="navBar__button" style={{width:"130px"}} onClick={()=> setCurrentTab("Projects")}><img src={FolderIcon} alt="pro" className="navBar__icon"></img><p className="navBar__button__text">Projects</p></button>)
            setContent(<ProjectsViewDataTable updateObservations={updateObservations.bind(this)} updateHours={updateHours.bind(this)} updateData={updateData} updateStatus={updateStatus.bind(this)} changeAdmin={changeAdmin.bind(this)}/>)
            setBackButton(<button className="navBar__button" onClick={()=>back()} style={{width:"100px"}}><img src={BackIcon} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="navBar__button__text">Back</p></button>)
        }else{
            setSaveButton(null)
            setProjectsButton(null)
            setContent(<ProjectsHoursDataTable/>)
            setBackButton(<button className="navBar__button" onClick={()=> setCurrentTab("View")} style={{width:"100px"}}><img src={BackIcon} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="navBar__button__text">Back</p></button>)
        }
        
    }, [currentTab, updateData])

    

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

    async function changeAdmin(admin, id){
        const body = {
            admin: admin,
            task_id: id,
            currentAdmin: secureStorage.getItem("user")
          }
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
          body: JSON.stringify(body)
        }
        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/changeAdminProjectTask", options)
        .then(response => response.json())
          .then(json =>{
            if(json.success){
                setUpdateData(!updateData)
            }
          })
    }
    
    function back(){
        history("/"+process.env.REACT_APP_PROJECT+"/pitrequests")
    }

    async function updateStatus(updatedRow){
        let currentRows = updatedRows
        currentRows.push(updatedRow)
        await setUpdatedRows(currentRows)
    }

    async function updateObservations(observations){
        await setObservations(observations)
        await setUpdateData(!updateData)
    }

    async function updateHours(hours){
        await setHours(hours)
        await setUpdateData(!updateData)
    }

    async function saveChanges(){
        let err = false
        await setUpdateData(!updateData)
        let hoursArray = []
        if(hours){

            Object.entries(hours)
            .map(async ([incidence_number, hours]) => 
                await hoursArray.push([incidence_number, hours])
            )

        }

        for(let i = 0; i < hoursArray.length; i++){
            let body = {
                incidence_number: hoursArray[i][0],
                hours: hoursArray[i][1],
              }
              let options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
              }
              fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/projects/updateHours", options)
              .then(response => response.json())
              .then(async json => {
                if(!json.success){
                    err = true
                }
              })
        }
        let observationsArray = []
        if(observations){

            Object.entries(observations)
            .map(async ([incidence_number, observation]) => 
                
                await observationsArray.push([incidence_number, observation])
            )

        }

        for(let i = 0; i < observationsArray.length; i++){
            let body = {
                task_id: observationsArray[i][0],
                observation: observationsArray[i][1],
              }
              let options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
              }
              
              fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/projects/updateObservations", options)
              .then(response => response.json())
              .then(async json => {
                if(!json.success){
                    err = true
                }
              })
            }
        for(let i = 0; i < updatedRows.length; i++){

            let body = {
                task_id: updatedRows[i][0],
                status_id: updatedRows[i][1],
                email: secureStorage.getItem("user")
              }
              let options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
              }
              
              fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/projects/updateStatus", options)
              .then(response => response.json())
              .then(async json => {
                if(!json.success){
                    err = true
                }
              })
        }
        if(err){
            setError(true)
        }else{
            setSuccess(true)
        }
        await setUpdatedRows([])
        await setUpdateData(!updateData)
        
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
            <IdleTimer
                timeout={1000 * 60 * 15}
                onIdle={handleOnIdle}
                debounce={250}
            />
            <NavBar onChange={value => setCurrentTab(currentTab)}/>
            
            <div className="isotracker__row">
                  <div className="isotracker__column">
                      <img src={PITLogo} alt="PITLogo" className="isoTrackerLogo__image2" style={{height:"110px"}}/>
                      
                      
                  </div>
            </div>
            <table className="projects__table__container">
                      <tr className="isotracker__table__navBar__container" style={{height:"65px "}}>
                          <th  className="isotracker__table__navBar">
                              <div style={{display:"flex"}}>
                                  <div>
                                    {backButton}
                                    {saveButton}
                                    {projectsButton}
                                    {usersButton}
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
                  </table>
                  <center className="actionBtns__container">   
                    <div style={{display:"flex", marginTop:"10px"}}>
                    </div>
                    
                  </center>
                  <br></br>
         </div>
    )
}

export default ProjectsView;