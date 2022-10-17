import React from 'react';
import 'antd/dist/antd.css';
import { Table } from 'antd';
import QtrackerNWCSpecPopUp from '../qtrackerNWCSpecPopUp/qtrackerNWCSpecPopUp';
import QtrackerNVNSpecPopUp from '../qtrackerNVNSpecPopUp/qtrackerNVNSpecPopUp';
import QtrackerNRISpecPopUp from '../qtrackerNRISpecPopUp/qtrackerNRISpecPopUp';
import QtrackerNRIDSSpecPopUp from '../qtrackerNRIDSSpecPopUp/qtrackerNRIDSSpecPopUp';
import QtrackerRPSpecPopUp from '../qtrackerRPSpecPopUp/qtrackerRPSpecPopUp';
import './qtrackerViewDataTable.css'
import AttachIcon from "../../assets/images/attach.png"
import ChangeAdminPopUp from '../changeAdminPopUp/changeAdminPopUp';
import QtrackerISSpecPopUp from '../qtrackerISSpecPopUp/qtrackerISSpecPopUp';
import ObservationsPopUp from '../observationsPopUp/observationsPopUp';
import ObservationsViewPopUp from '../observationsViewPopUp/observationsViewPopUp';
import moment from 'moment';

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

class QTrackerViewDataTable extends React.Component{ //Tabla de incidencias
  state = {
    searchText: '',
    searchedColumn: '',
    data: [],
    displayData: [],
    pendingData: [],
    filterData: ["", "", "", "", "", "", "", ""],
    observations: {},
    tab: this.props.currentTab,
    selectedRows: [],
    selectedRowsKeys: [],
    updateData: this.props.updateData,
    username: "",
    acronyms : null,
    steps: [],
    filters: [],
    hours: {},
    showAll: this.props.showAll,
    alertCount: 0
  };

  async statusChange(incidence_number, status, project, type){ //Cambio de status de una incidencia
    let status_id 
    if(status === "pending"){
      status_id = 0
    }else if(status === "progress"){
      status_id = 1
    }else if(status === "ready"){
      status_id = 2
    }else if(status === "rejected"){
      status_id = 3
    }else if(status === "materials"){
      status_id = 4
    }

   await this.props.updateStatus([incidence_number, status_id, project, type])  
  }

  async priorityChange(incidence_number, priority, project, type){ //Cambio de prioridad de una incidencia
    let priority_id
    if(priority === "low"){
      priority_id = 0
    }else if(priority === "medium"){
      priority_id = 1
    }else if(priority === "high"){
      priority_id = 2
    }

   await this.props.updatePriority([incidence_number, priority_id, project, type])  
  }


  async componentDidMount(){
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }

    //Get de las incidencias tipo NWC
    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getNWCByProjects/"+secureStorage.getItem("user"), options)
        .then(response => response.json())
        .then(async json => {
          var rows = []
          var pendingRows = []
          var row = null
          let alertCount = 0
          if(json.rows){
            for(let i = 0; i < json.rows.length; i++){ //Por cada incidencia
                if (json.rows[i].description){

                }
                let carta = ""
                if(json.rows[i].carta){ //Si tiene carta la ponemos 
                  carta = " - " + json.rows[i].carta
                }
                if(json.rows[i].attach === 1){ //Si tiene attach
                  if(json.rows[i].accept_reject_date != null){ //Si aun no ha sido aceptada/rechazada
                    //Creamos la fila sin fecha de accept/reject
                    row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNWCSpecPopUp incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19).toString().substring(0,10), key: json.rows[i].incidence_number}
                  }else{//En caso contrario la creamos con la fecha
                    row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNWCSpecPopUp incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: "", key: json.rows[i].incidence_number}
                  }
                }else{ //Si no tiene attach lo mismo pero sin attach
                  if(json.rows[i].accept_reject_date != null){
                    row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNWCSpecPopUp incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                  }else{
                    row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNWCSpecPopUp incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: "", key: json.rows[i].incidence_number}
                  }
                }

                if(secureStorage.getItem("role") === "3D Admin"){ //Si el rol es 3dadmin ponemos botones y desplegables para modificar la incidencia
                  //Permitimos poner las horas a la incidencia
                  row["hours"] = <input style={{width: "55px"}} type="text" defaultValue={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                  //Permitimos cambiar el admin
                  row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="NWC" changeAdmin = {this.changeAdmin.bind(this)}/>
                  //Todos los posibles estados
                  if(json.rows[i].status === 0){
                      row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NWC")} >
                      <option value="pending" defaultValue>Pending</option>
                      <option value="progress">In progress</option>
                      <option value="materials">Materials</option>
                      <option value="ready">Ready</option>
                      <option value="rejected">Rejected</option>
                    </select>
                      row.color = "#www"
                  }else if(json.rows[i].status === 1){
                    row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NWC")}>
                    <option value="pending">Pending</option>
                    <option value="progress" defaultValue style={{backgroundColor:"#yyy"}}>In progress</option>
                    <option value="materials">Materials</option>
                    <option value="ready">Ready</option>
                    <option value="rejected">Rejected</option>
                  </select>
                      row.color = "#yyy"
                  }else if(json.rows[i].status === 2){
                    row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NWC")}>
                    <option value="pending">Pending</option>
                    <option value="progress">In progress</option>
                    <option value="materials">Materials</option>
                    <option value="ready" defaultValue>Ready</option>
                    <option value="rejected">Rejected</option>
                    </select>
                      row.color = "#ggg"
                  }else if(json.rows[i].status === 3){
                    row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NWC")}>
                    <option value="pending">Pending</option>
                    <option value="progress">In progress</option>
                    <option value="materials">Materials</option>
                    <option value="ready">Ready</option>
                    <option value="rejected" defaultValue>Rejected</option>
                   </select>
                      row.color = "#rrr"
                  }else{
                    row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NWC")}>
                    <option value="pending">Pending</option>
                    <option value="progress">In progress</option>
                    <option value="materials" defaultValue>Materials</option>
                    <option value="ready">Ready</option>
                    <option value="rejected">Rejected</option>
                   </select>
                      row.color = "#bbb"
                  }

                  if(json.rows[i].priority === 0 || !json.rows[i].priority){
                    row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NWC")} >
                    <option value="low" defaultValue>Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  }else if(json.rows[i].priority === 1){
                    row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NWC")}>
                    <option value="low">Low</option>
                    <option value="medium" defaultValue>Medium</option>
                    <option value="high">High</option>
                  </select>
                  }else if(json.rows[i].priority === 2){
                    row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NWC")}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high" defaultValue>High</option>
                    </select>
                  }

                  // console.log(secureStorage.getItem("user") === json.rows[i].email);

                  // console.log("secure: " + secureStorage.getItem("user"));
                  // console.log("rows: " + json.rows[i].email);
                  if(secureStorage.getItem("user") === json.rows[i].email){
                    row.observations = <ObservationsPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations} updateData={this.props.updateData} updateObservations={this.updateObservations.bind(this)}/>
                  } else {
                    row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                  }

                }else{ //Si no es 3damdin simplemente creamos una vista view only
                  row["admin"] = json.rows[i].admin
                  if(json.rows[i].priority === 0){
                    row.priority = "Low"
                  }else if(json.rows[i].priority === 1){
                      row.priority = "Medium"
                  }else if(json.rows[i].priority === 2){
                      row.priority = "High"
                  }

                  if(json.rows[i].status === 0){
                    row.status = "Pending"
                    row.color = "#www"
                  }else if(json.rows[i].status === 1){
                      row.status = "In progress"
                      row.color = "#yyy"
                  }else if(json.rows[i].status === 2){
                      row.status = "Ready"
                      row.color = "#ggg"
                  }else if(json.rows[i].status === 3){
                      row.status = "Rejected"
                      row.color = "#rrr"
                  }else{
                    row.status = "Materials"
                    row.color = "#bbb"
                  }

                  row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                }
                
                const today = moment()
                const createdDate = moment(row.created_at)

                if (!createdDate.add(2, 'weeks').isSameOrAfter(today) && !(json.rows[i].status === 2 || json.rows[i].status === 3)) {
                  row.color = "#ppp" 
                  if(this.props.currentUser === json.rows[i].email){
                    alertCount++
                  }
                }

                if(json.rows[i].status === 0 || json.rows[i].status === 1 || json.rows[i].status === 4){
                  pendingRows.push(row)
                }
            }
          }
            //Repetimos lo mismo para todas las incidencias
            await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getNVNByProjects/"+secureStorage.getItem("user"), options)
            .then(response => response.json())
            .then(async json => {
            var row = null
              if(json.rows){
                for(let i = 0; i < json.rows.length; i++){
                  
                  let carta = ""
                  if(json.rows[i].carta){
                    carta = " - " + json.rows[i].carta
                  }
                  if(json.rows[i].attach === 1){
                    if(json.rows[i].accept_reject_date != null){
                      row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19).toString().substring(0,10), key: json.rows[i].incidence_number}
                    }else{
                      row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: "", key: json.rows[i].incidence_number}
                    }
                  }else{
                    if(json.rows[i].accept_reject_date != null){
                      row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                    }else{
                      row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: "", key: json.rows[i].incidence_number}
                    }
                  }
                    if(secureStorage.getItem("role") === "3D Admin"){
                      row["hours"] = <input style={{width: "55px"}} type="text" defaultValue={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                      row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="NVN" changeAdmin = {this.changeAdmin.bind(this)}/>
                      if(json.rows[i].status === 0){
                          row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NVN")} >
                          <option value="pending" defaultValue>Pending</option>
                          <option value="progress">In progress</option>
                          <option value="materials">Materials</option>
                          <option value="ready">Ready</option>
                          <option value="rejected">Rejected</option>
                        </select>
                          row.color = "#www"
                      }else if(json.rows[i].status === 1){
                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NVN")}>
                        <option value="pending">Pending</option>
                        <option value="progress" defaultValue style={{backgroundColor:"#yyy"}}>In progress</option>
                        <option value="materials">Materials</option>
                        <option value="ready">Ready</option>
                        <option value="rejected">Rejected</option>
                      </select>
                          row.color = "#yyy"
                      }else if(json.rows[i].status === 2){
                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NVN")}>
                        <option value="pending">Pending</option>
                        <option value="progress">In progress</option>
                        <option value="materials">Materials</option>
                        <option value="ready" defaultValue>Ready</option>
                        <option value="rejected">Rejected</option>
                        </select>
                          row.color = "#ggg"
                      }else if(json.rows[i].status === 3){
                          row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NVN")}>
                        <option value="pending">Pending</option>
                        <option value="progress">In progress</option>
                        <option value="materials">Materials</option>
                        <option value="ready">Ready</option>
                        <option value="rejected" defaultValue>Rejected</option>
                       </select>
                          row.color = "#rrr"
                      }else{
                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NVN")}>
                        <option value="pending">Pending</option>
                        <option value="progress">In progress</option>
                        <option value="materials" defaultValue>Materials</option>
                        <option value="ready">Ready</option>
                        <option value="rejected">Rejected</option>
                       </select>
                          row.color = "#bbb"
                      }
                      if(json.rows[i].priority === 0 || !json.rows[i].priority){
                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NVN")} >
                        <option value="low" defaultValue>Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                      }else if(json.rows[i].priority === 1){
                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NVN")}>
                        <option value="low">Low</option>
                        <option value="medium" defaultValue>Medium</option>
                        <option value="high">High</option>
                      </select>
                      }else if(json.rows[i].priority === 2){
                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NVN")}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high" defaultValue>High</option>
                        </select>
                      }
                      
                      if(secureStorage.getItem("user") === json.rows[i].email){
                        row.observations = <ObservationsPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations} updateData={this.props.updateData} updateObservations={this.updateObservations.bind(this)}/>
                      } else {
                        row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                      }
    
                    }else{
                      row["admin"] = json.rows[i].admin

                      if(json.rows[i].priority === 0){
                        row.priority = "Low"
                      }else if(json.rows[i].priority === 1){
                          row.priority = "Medium"
                      }else if(json.rows[i].priority === 2){
                          row.priority = "High"
                      }

                      if(json.rows[i].status === 0){
                        row.status = "Pending"
                        row.color = "#www"
                      }else if(json.rows[i].status === 1){
                          row.status = "In progress"
                          row.color = "#yyy"
                      }else if(json.rows[i].status === 2){
                          row.status = "Ready"
                          row.color = "#ggg"
                      }else if(json.rows[i].status === 3){
                        row.status = "Rejected"
                        row.color = "#rrr"
                      }else{
                        row.status = "Materials"
                        row.color = "#bbb"
                      }

                      row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                    }

                    const today = moment()
                    const createdDate = moment(row.created_at)

                    if (!createdDate.add(2, 'weeks').isSameOrAfter(today) && !(json.rows[i].status === 2 || json.rows[i].status === 3)) {
                      row.color = "#ppp" 
                      if(this.props.currentUser === json.rows[i].email){
                        alertCount++
                      }
                    }
    
                    if(json.rows[i].status === 0 || json.rows[i].status === 1 || json.rows[i].status === 4){
                      pendingRows.push(row)
                    }
                    }
              }
                
                await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getNRIByProjects/"+secureStorage.getItem("user"), options)
                .then(response => response.json())
                .then(async json => {
                var row = null
                    if(json.rows){
                    for(let i = 0; i < json.rows.length; i++){
                      let carta = ""
                      if(json.rows[i].carta){
                        carta = " - " + json.rows[i].carta
                      }
                      if(json.rows[i].attach === 1){
                        if(json.rows[i].accept_reject_date != null){
                          row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNRISpecPopUp incidence_number={json.rows[i].incidence_number} pipe={json.rows[i].pipe} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19).toString().substring(0,10),key: json.rows[i].incidence_number}
                        }else{
                          row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNRISpecPopUp incidence_number={json.rows[i].incidence_number} pipe={json.rows[i].pipe} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: "", key: json.rows[i].incidence_number}
                        }
                      }else{
                        if(json.rows[i].accept_reject_date != null){
                          row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNRISpecPopUp incidence_number={json.rows[i].incidence_number} pipe={json.rows[i].pipe} description={json.rows[i].description}/>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                        }else{
                          row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNRISpecPopUp incidence_number={json.rows[i].incidence_number} pipe={json.rows[i].pipe} description={json.rows[i].description}/>, ar_date: "", key: json.rows[i].incidence_number}
                        }
                      }
                        if(secureStorage.getItem("role") === "3D Admin"){
                          row["hours"] = <input style={{width: "55px"}} type="text" defaultValue={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                          row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="NRI" changeAdmin = {this.changeAdmin.bind(this)}/>
                          if(json.rows[i].status === 0){
                              row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRI")} >
                              <option value="pending" defaultValue>Pending</option>
                              <option value="progress">In progress</option>
                              <option value="materials">Materials</option>
                              <option value="ready">Ready</option>
                              <option value="rejected">Rejected</option>
                            </select>
                              row.color = "#www"
                          }else if(json.rows[i].status === 1){
                            row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRI")}>
                            <option value="pending">Pending</option>
                            <option value="progress" defaultValue style={{backgroundColor:"#yyy"}}>In progress</option>
                            <option value="materials">Materials</option>
                            <option value="ready">Ready</option>
                            <option value="rejected">Rejected</option>
                          </select>
                              row.color = "#yyy"
                          }else if(json.rows[i].status === 2){
                            row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRI")}>
                            <option value="pending">Pending</option>
                            <option value="progress">In progress</option>
                            <option value="materials">Materials</option>
                            <option value="ready" defaultValue>Ready</option>
                            <option value="rejected">Rejected</option>
                            </select>
                              row.color = "#ggg"
                          }else if(json.rows[i].status === 3){
                            row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRI")}>
                            <option value="pending">Pending</option>
                            <option value="progress">In progress</option>
                            <option value="materials">Materials</option>
                            <option value="ready">Ready</option>
                            <option value="rejected" defaultValue>Rejected</option>
                           </select>
                              row.color = "#rrr"
                          }else{
                            row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRI")}>
                            <option value="pending">Pending</option>
                            <option value="progress">In progress</option>
                            <option value="materials" defaultValue>Materials</option>
                            <option value="ready">Ready</option>
                            <option value="rejected">Rejected</option>
                           </select>
                              row.color = "#bbb"
                          }

                          if(json.rows[i].priority === 0 || !json.rows[i].priority){
                            row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRI")} >
                            <option value="low" defaultValue>Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                          }else if(json.rows[i].priority === 1){
                            row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRI")}>
                            <option value="low">Low</option>
                            <option value="medium" defaultValue>Medium</option>
                            <option value="high">High</option>
                          </select>
                          }else if(json.rows[i].priority === 2){
                            row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRI")}>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high" defaultValue>High</option>
                            </select>
                          }
                          if(secureStorage.getItem("user") === json.rows[i].email){
                            row.observations = <ObservationsPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations} updateData={this.props.updateData} updateObservations={this.updateObservations.bind(this)}/>
                          } else {
                            row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                          }


                        }else{
                          row["admin"] = json.rows[i].admin

                          if(json.rows[i].priority === 0){
                            row.priority = "Low"
                          }else if(json.rows[i].priority === 1){
                              row.priority = "Medium"
                          }else if(json.rows[i].priority === 2){
                              row.priority = "High"
                          }

                          if(json.rows[i].status === 0){
                            row.status = "Pending"
                            row.color = "#www"
                          }else if(json.rows[i].status === 1){
                              row.status = "In progress"
                              row.color = "#yyy"
                          }else if(json.rows[i].status === 2){
                              row.status = "Ready"
                              row.color = "#ggg"
                          }else if(json.rows[i].status === 3){
                            row.status = "Rejected"
                            row.color = "#rrr"
                          }else{
                            row.status = "Materials"
                            row.color = "#bbb"
                          }

                          row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                        }

                        const today = moment()
                        const createdDate = moment(row.created_at)

                        if (!createdDate.add(2, 'weeks').isSameOrAfter(today) && !(json.rows[i].status === 2 || json.rows[i].status === 3)) {
                          row.color = "#ppp" 
                          if(this.props.currentUser === json.rows[i].email){
                            alertCount++
                          }
                        }
        
                        if(json.rows[i].status === 0 || json.rows[i].status === 1 || json.rows[i].status === 4){
                          pendingRows.push(row)
                        }
        
                    }
                  }
                    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getNRBByProjects/"+secureStorage.getItem("user"), options)
                    .then(response => response.json())
                    .then(async json => {
                    var row = null
                        if(json.rows){
                        for(let i = 0; i < json.rows.length; i++){
                          let carta = ""
                          if(json.rows[i].carta){
                            carta = " - " + json.rows[i].carta
                          }
                          if(json.rows[i].attach === 1){
                            if(json.rows[i].accept_reject_date != null){
                              row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNRISpecPopUp incidence_number={json.rows[i].incidence_number} pipe={json.rows[i].pipe} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19).toString().substring(0,10), key: json.rows[i].incidence_number}
                            }else{
                              row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNRISpecPopUp incidence_number={json.rows[i].incidence_number} pipe={json.rows[i].pipe} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: "", key: json.rows[i].incidence_number}
                            }
                          }else{
                            if(json.rows[i].accept_reject_date != null){
                              row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNRISpecPopUp incidence_number={json.rows[i].incidence_number} pipe={json.rows[i].pipe} description={json.rows[i].description}/>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                            }else{
                              row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNRISpecPopUp incidence_number={json.rows[i].incidence_number} pipe={json.rows[i].pipe} description={json.rows[i].description}/>, ar_date: "", key: json.rows[i].incidence_number}
                            }
                          }
                            if(secureStorage.getItem("role") === "3D Admin"){
                              row["hours"] = <input style={{width: "55px"}} type="text" defaultValue={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                              row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="NRB" changeAdmin = {this.changeAdmin.bind(this)}/>
                              if(json.rows[i].status === 0){
                                  row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRB")} >
                                  <option value="pending" defaultValue>Pending</option>
                                  <option value="progress">In progress</option>
                                  <option value="materials">Materials</option>
                                  <option value="ready">Ready</option>
                                  <option value="rejected">Rejected</option>
                                </select>
                                  row.color = "#www"
                              }else if(json.rows[i].status === 1){
                                row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRB")}>
                                <option value="pending">Pending</option>
                                <option value="progress" defaultValue style={{backgroundColor:"#yyy"}}>In progress</option>
                                <option value="materials">Materials</option>
                                <option value="ready">Ready</option>
                                <option value="rejected">Rejected</option>
                              </select>
                                  row.color = "#yyy"
                              }else if(json.rows[i].status === 2){
                                row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRB")}>
                                <option value="pending">Pending</option>
                                <option value="progress">In progress</option>
                                <option value="materials">Materials</option>
                                <option value="ready" defaultValue>Ready</option>
                                <option value="rejected">Rejected</option>
                                </select>
                                  row.color = "#ggg"
                              }else if(json.rows[i].status === 3){
                                row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRB")}>
                                <option value="pending">Pending</option>
                                <option value="progress">In progress</option>
                                <option value="materials">Materials</option>
                                <option value="ready">Ready</option>
                                <option value="rejected" defaultValue>Rejected</option>
                               </select>
                                  row.color = "#rrr"
                              }else{
                                row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRB")}>
                                <option value="pending">Pending</option>
                                <option value="progress">In progress</option>
                                <option value="materials" defaultValue>Materials</option>
                                <option value="ready">Ready</option>
                                <option value="rejected">Rejected</option>
                               </select>
                                  row.color = "#bbb"
                              }

                              if(json.rows[i].priority === 0 || !json.rows[i].priority){
                                row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRB")} >
                                <option value="low" defaultValue>Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                              </select>
                              }else if(json.rows[i].priority === 1){
                                row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRB")}>
                                <option value="low">Low</option>
                                <option value="medium" defaultValue>Medium</option>
                                <option value="high">High</option>
                              </select>
                              }else if(json.rows[i].priority === 2){
                                row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRB")}>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high" defaultValue>High</option>
                                </select>
                              }

                              if(secureStorage.getItem("user") === json.rows[i].email){
                                row.observations = <ObservationsPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations} updateData={this.props.updateData} updateObservations={this.updateObservations.bind(this)}/>
                              } else {
                                row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                              }
                            
                            }else{
                              row["admin"] = json.rows[i].admin

                              if(json.rows[i].priority === 0){
                                row.priority = "Low"
                              }else if(json.rows[i].priority === 1){
                                  row.priority = "Medium"
                              }else if(json.rows[i].priority === 2){
                                  row.priority = "High"
                              }

                              if(json.rows[i].status === 0){
                                row.status = "Pending"
                                row.color = "#www"
                              }else if(json.rows[i].status === 1){
                                  row.status = "In progress"
                                  row.color = "#yyy"
                              }else if(json.rows[i].status === 2){
                                  row.status = "Ready"
                                  row.color = "#ggg"
                              }else if(json.rows[i].status === 3){
                                row.status = "Rejected"
                                row.color = "#rrr"
                              }else{
                                row.status = "Materials"
                                row.color = "#bbb"
                              }

                              row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                            }

                            const today = moment()
                            const createdDate = moment(row.created_at)

                            if (!createdDate.add(2, 'weeks').isSameOrAfter(today) && !(json.rows[i].status === 2 || json.rows[i].status === 3)) {
                              row.color = "#ppp" 
                              if(this.props.currentUser === json.rows[i].email){
                                alertCount++
                              }
                            }
            
                            if(json.rows[i].status === 0 || json.rows[i].status === 1 || json.rows[i].status === 4){
                              pendingRows.push(row)
                            }
                        }
                      }
                        
                        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getNRIDSByProjects/"+secureStorage.getItem("user"), options)
                        .then(response => response.json())
                        .then(async json => {
                        var row = null
                            if(json.rows){
                            for(let i = 0; i < json.rows.length; i++){
                              let carta = ""
                              if(json.rows[i].carta){
                                carta = " - " + json.rows[i].carta
                              }
                              if(json.rows[i].accept_reject_date != null){
                                row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: "", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNRIDSSpecPopUp incidence_number={json.rows[i].incidence_number} name={json.rows[i].name}/>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                              }else{
                                row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: "", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNRIDSSpecPopUp incidence_number={json.rows[i].incidence_number} name={json.rows[i].name}/>, ar_date: "", key: json.rows[i].incidence_number}
                              }
                                if(secureStorage.getItem("role") === "3D Admin"){
                                  row["hours"] = <input style={{width: "55px"}} type="text" defaultValue={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                                  row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="NRIDS" changeAdmin = {this.changeAdmin.bind(this)}/>
                                  if(json.rows[i].status === 0){
                                      row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRIDS")} >
                                      <option value="pending" defaultValue>Pending</option>
                                      <option value="progress">In progress</option>
                                      <option value="materials">Materials</option>
                                      <option value="ready">Ready</option>
                                      <option value="rejected">Rejected</option>
                                    </select>
                                      row.color = "#www"
                                  }else if(json.rows[i].status === 1){
                                    row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRIDS")}>
                                    <option value="pending">Pending</option>
                                    <option value="progress" defaultValue style={{backgroundColor:"#yyy"}}>In progress</option>
                                    <option value="materials">Materials</option>
                                    <option value="ready">Ready</option>
                                    <option value="rejected">Rejected</option>
                                  </select>
                                      row.color = "#yyy"
                                  }else if(json.rows[i].status === 2){
                                    row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRIDS")}>
                                    <option value="pending">Pending</option>
                                    <option value="progress">In progress</option>
                                    <option value="materials">Materials</option>
                                    <option value="ready" defaultValue>Ready</option>
                                    <option value="rejected">Rejected</option>
                                    </select>
                                      row.color = "#ggg"
                                  }else if(json.rows[i].status === 3){
                                    row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRIDS")}>
                                    <option value="pending">Pending</option>
                                    <option value="progress">In progress</option>
                                    <option value="materials">Materials</option>
                                    <option value="ready">Ready</option>
                                    <option value="rejected" defaultValue>Rejected</option>
                                   </select>
                                      row.color = "#rrr"
                                  }else{
                                    row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRIDS")}>
                                    <option value="pending">Pending</option>
                                    <option value="progress">In progress</option>
                                    <option value="materials" defaultValue>Materials</option>
                                    <option value="ready">Ready</option>
                                    <option value="rejected">Rejected</option>
                                   </select>
                                      row.color = "#bbb"
                                  }

                                  if(json.rows[i].priority === 0 || !json.rows[i].priority){
                                    row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRIDS")} >
                                    <option value="low" defaultValue>Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                  </select>
                                  }else if(json.rows[i].priority === 1){
                                    row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRIDS")}>
                                    <option value="low">Low</option>
                                    <option value="medium" defaultValue>Medium</option>
                                    <option value="high">High</option>
                                  </select>
                                  }else if(json.rows[i].priority === 2){
                                    row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRIDS")}>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high" defaultValue>High</option>
                                    </select>
                                  }
                                  if(secureStorage.getItem("user") === json.rows[i].email){
                                    row.observations = <ObservationsPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations} updateData={this.props.updateData} updateObservations={this.updateObservations.bind(this)}/>
                                  } else {
                                    row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                                  }

                                }else{
                                  row["admin"] = json.rows[i].admin

                                  if(json.rows[i].priority === 0){
                                    row.priority = "Low"
                                  }else if(json.rows[i].priority === 1){
                                      row.priority = "Medium"
                                  }else if(json.rows[i].priority === 2){
                                      row.priority = "High"
                                  }

                                  if(json.rows[i].status === 0){
                                    row.status = "Pending"
                                    row.color = "#www"
                                  }else if(json.rows[i].status === 1){
                                      row.status = "In progress"
                                      row.color = "#yyy"
                                  }else if(json.rows[i].status === 2){
                                      row.status = "Ready"
                                      row.color = "#ggg"
                                  }else if(json.rows[i].status === 3){
                                      row.status = "Rejected"
                                      row.color = "#rrr"
                                  }else{
                                    row.status = "Materials"
                                    row.color = "#bbb"
                                  }
                                  row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                                }

                                const today = moment()
                                const createdDate = moment(row.created_at)

                                if (!createdDate.add(2, 'weeks').isSameOrAfter(today) && !(json.rows[i].status === 2 || json.rows[i].status === 3)) {
                                  row.color = "#ppp" 
                                  if(this.props.currentUser === json.rows[i].email){
                                    alertCount++
                                  }
                                }
                
                                if(json.rows[i].status === 0 || json.rows[i].status === 1 || json.rows[i].status === 4){
                                  pendingRows.push(row)
                                }
    
                            }
                          }
                            await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getRPByProjects/"+secureStorage.getItem("user"), options)
                            .then(response => response.json())
                            .then(async json => {
                            var row = null
                                if(json.rows){
                                for(let i = 0; i < json.rows.length; i++){
                                  let carta = ""
                                  if(json.rows[i].carta){
                                    carta = " - " + json.rows[i].carta
                                  }
                                  if(json.rows[i].accept_reject_date != null){
                                    row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerRPSpecPopUp incidence_number={json.rows[i].incidence_number} items={json.rows[i].items_to_report} scope={json.rows[i].scope} description={json.rows[i].description}/>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                                  }else{
                                    row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...".substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerRPSpecPopUp incidence_number={json.rows[i].incidence_number} items={json.rows[i].items_to_report} scope={json.rows[i].scope} description={json.rows[i].description}/>, ar_date: "", key: json.rows[i].incidence_number}
                                  }
                                    if(secureStorage.getItem("role") === "3D Admin"){
                                      row["hours"] = <input style={{width: "55px"}} type="text" defaultValue={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                                      row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="RP" changeAdmin = {this.changeAdmin.bind(this)}/>
                                      if(json.rows[i].status === 0){
                                          row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "RP")} >
                                          <option value="pending" defaultValue>Pending</option>
                                          <option value="progress">In progress</option>
                                          <option value="materials">Materials</option>
                                          <option value="ready">Ready</option>
                                          <option value="rejected">Rejected</option>
                                        </select>
                                          row.color = "#www"
                                      }else if(json.rows[i].status === 1){
                                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "RP")}>
                                        <option value="pending">Pending</option>
                                        <option value="progress" defaultValue style={{backgroundColor:"#yyy"}}>In progress</option>
                                        <option value="materials">Materials</option>
                                        <option value="ready">Ready</option>
                                        <option value="rejected">Rejected</option>
                                      </select>
                                          row.color = "#yyy"
                                      }else if(json.rows[i].status === 2){
                                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "RP")}>
                                        <option value="pending">Pending</option>
                                        <option value="progress">In progress</option>
                                        <option value="materials">Materials</option>
                                        <option value="ready" defaultValue>Ready</option>
                                        <option value="rejected">Rejected</option>
                                        </select>
                                          row.color = "#ggg"
                                      }else if(json.rows[i].status === 3){
                                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "RP")}>
                                        <option value="pending">Pending</option>
                                        <option value="progress">In progress</option>
                                        <option value="materials">Materials</option>
                                        <option value="ready">Ready</option>
                                        <option value="rejected" defaultValue>Rejected</option>
                                       </select>
                                          row.color = "#rrr"
                                      }else{
                                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "RP")}>
                                        <option value="pending">Pending</option>
                                        <option value="progress">In progress</option>
                                        <option value="materials" defaultValue>Materials</option>
                                        <option value="ready">Ready</option>
                                        <option value="rejected">Rejected</option>
                                       </select>
                                          row.color = "#bbb"
                                      }

                                      if(json.rows[i].priority === 0 || !json.rows[i].priority){
                                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "RP")} >
                                        <option value="low" defaultValue>Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                      </select>
                                      }else if(json.rows[i].priority === 1){
                                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "RP")}>
                                        <option value="low">Low</option>
                                        <option value="medium" defaultValue>Medium</option>
                                        <option value="high">High</option>
                                      </select>
                                      }else if(json.rows[i].priority === 2){
                                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "RP")}>
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high" defaultValue>High</option>
                                        </select>
                                      }
                                      if(secureStorage.getItem("user") === json.rows[i].email){
                                          row.observations = <ObservationsPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations} updateData={this.props.updateData} updateObservations={this.updateObservations.bind(this)}/>
                                      } else {
                                          row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                                      }

                                    }else{
                                      row["admin"] = json.rows[i].admin

                                      if(json.rows[i].priority === 0){
                                        row.priority = "Low"
                                      }else if(json.rows[i].priority === 1){
                                          row.priority = "Medium"
                                      }else if(json.rows[i].priority === 2){
                                          row.priority = "High"
                                      }

                                      if(json.rows[i].status === 0){
                                        row.status = "Pending"
                                        row.color = "#www"
                                      }else if(json.rows[i].status === 1){
                                          row.status = "In progress"
                                          row.color = "#yyy"
                                      }else if(json.rows[i].status === 2){
                                          row.status = "Ready"
                                          row.color = "#ggg"
                                      }else if(json.rows[i].status === 3){
                                          row.status = "Rejected"
                                          row.color = "#rrr"
                                      }else{
                                          row.status = "Materials"
                                          row.color = "#bbb"
                                      }
                                      row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                                    }

                                    const today = moment()
                                    const createdDate = moment(row.created_at)

                                    if (!createdDate.add(2, 'weeks').isSameOrAfter(today) && !(json.rows[i].status === 2 || json.rows[i].status === 3)) {
                                      row.color = "#ppp" 
                                      if(this.props.currentUser === json.rows[i].email){
                                        alertCount++
                                      }
                                    }
                    
                                    if(json.rows[i].status === 0 || json.rows[i].status === 1 || json.rows[i].status === 4){
                                      pendingRows.push(row)
                                    }
                                }
                              }
                              await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getISByProjects/"+secureStorage.getItem("user"), options)
                            .then(response => response.json())
                            .then(async json => {
                            var row = null
                                if(json.rows){
                                for(let i = 0; i < json.rows.length; i++){
                                  let carta = ""
                                  if(json.rows[i].carta){
                                    carta = " - " + json.rows[i].carta
                                  }
                                  if(json.rows[i].accept_reject_date != null){
                                    row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerISSpecPopUp incidence_number={json.rows[i].incidence_number} sending={json.rows[i].sending} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                                  }else{
                                    row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerISSpecPopUp incidence_number={json.rows[i].incidence_number} sending={json.rows[i].sending} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: "", key: json.rows[i].incidence_number}
                                  }
                                    if(secureStorage.getItem("role") === "3D Admin"){
                                      row["hours"] = <input style={{width: "55px"}} type="text" defaultValue={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                                      row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="IS" changeAdmin = {this.changeAdmin.bind(this)}/>
                                      if(json.rows[i].status === 0){
                                          row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "IS")} >
                                          <option value="pending" defaultValue>Pending</option>
                                          <option value="progress">In progress</option>
                                          <option value="materials">Materials</option>
                                          <option value="ready">Ready</option>
                                          <option value="rejected">Rejected</option>
                                        </select>
                                          row.color = "#www"
                                      }else if(json.rows[i].status === 1){
                                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "IS")}>
                                        <option value="pending">Pending</option>
                                        <option value="progress" defaultValue style={{backgroundColor:"#yyy"}}>In progress</option>
                                        <option value="materials">Materials</option>
                                        <option value="ready">Ready</option>
                                        <option value="rejected">Rejected</option>
                                      </select>
                                          row.color = "#yyy"
                                      }else if(json.rows[i].status === 2){
                                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "IS")}>
                                        <option value="pending">Pending</option>
                                        <option value="progress">In progress</option>
                                        <option value="materials">Materials</option>
                                        <option value="ready" defaultValue>Ready</option>
                                        <option value="rejected">Rejected</option>
                                        </select>
                                          row.color = "#ggg"
                                      }else if(json.rows[i].status === 3){
                                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "IS")}>
                                        <option value="pending">Pending</option>
                                        <option value="progress">In progress</option>
                                        <option value="materials">Materials</option>
                                        <option value="ready">Ready</option>
                                        <option value="rejected" defaultValue>Rejected</option>
                                       </select>
                                          row.color = "#rrr"
                                      }else{
                                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "IS")}>
                                        <option value="pending">Pending</option>
                                        <option value="progress">In progress</option>
                                        <option value="materials" defaultValue>Materials</option>
                                        <option value="ready">Ready</option>
                                        <option value="rejected">Rejected</option>
                                       </select>
                                          row.color = "#bbb"
                                      }

                                      if(json.rows[i].priority === 0 || !json.rows[i].priority){
                                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "IS")} >
                                        <option value="low" defaultValue>Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                      </select>
                                      }else if(json.rows[i].priority === 1){
                                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "IS")}>
                                        <option value="low">Low</option>
                                        <option value="medium" defaultValue>Medium</option>
                                        <option value="high">High</option>
                                      </select>
                                      }else if(json.rows[i].priority === 2){
                                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "IS")}>
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high" defaultValue>High</option>
                                        </select>
                                      }
                                      if(secureStorage.getItem("user") === json.rows[i].email){
                                        row.observations = <ObservationsPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations} updateData={this.props.updateData} updateObservations={this.updateObservations.bind(this)}/>
                                      } else {
                                        row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                                      }

                                    }else{
                                      row["admin"] = json.rows[i].admin

                                      if(json.rows[i].priority === 0){
                                        row.priority = "Low"
                                      }else if(json.rows[i].priority === 1){
                                          row.priority = "Medium"
                                      }else if(json.rows[i].priority === 2){
                                          row.priority = "High"
                                      }

                                      if(json.rows[i].status === 0){
                                        row.status = "Pending"
                                        row.color = "#www"
                                      }else if(json.rows[i].status === 1){
                                          row.status = "In progress"
                                          row.color = "#yyy"
                                      }else if(json.rows[i].status === 2){
                                          row.status = "Ready"
                                          row.color = "#ggg"
                                      }else if(json.rows[i].status === 3){
                                          row.status = "Rejected"
                                          row.color = "#rrr"
                                      }else{
                                        row.status = "Materials"
                                        row.color = "#bbb"
                                      }
                                      row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                                    }

                                    const today = moment()
                                    const createdDate = moment(row.created_at)

                                    if (!createdDate.add(2, 'weeks').isSameOrAfter(today) && !(json.rows[i].status === 2 || json.rows[i].status === 3)) {
                                      row.color = "#ppp" 
                                      if(this.props.currentUser === json.rows[i].email){
                                        alertCount++
                                      }
                                    }
                    
                                    if(json.rows[i].status === 0 || json.rows[i].status === 1 || json.rows[i].status === 4){
                                      pendingRows.push(row)
                                    }
                                }
                              }

                              /* Drawing/IsoStyle */
                              await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getDISByProjects/"+secureStorage.getItem("user"), options)
                              .then(response => response.json())
                              .then(async json => {
                              var row = null
                                if(json.rows){
                                  for(let i = 0; i < json.rows.length; i++){
                                    
                                    let carta = ""
                                    if(json.rows[i].carta){
                                      carta = " - " + json.rows[i].carta
                                    }
                                    if(json.rows[i].attach === 1){
                                      if(json.rows[i].accept_reject_date != null){
                                        row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19).toString().substring(0,10), key: json.rows[i].incidence_number}
                                      }else{
                                        row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: "", key: json.rows[i].incidence_number}
                                      }
                                    }else{
                                      if(json.rows[i].accept_reject_date != null){
                                        row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                                      }else{
                                        row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: "", key: json.rows[i].incidence_number}
                                      }
                                    }
                                      if(secureStorage.getItem("role") === "3D Admin"){
                                        row["hours"] = <input style={{width: "55px"}} type="text" defaultValue={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                                        row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="DIS" changeAdmin = {this.changeAdmin.bind(this)}/>
                                        if(json.rows[i].status === 0){
                                            row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DIS")} >
                                            <option value="pending" defaultValue>Pending</option>
                                            <option value="progress">In progress</option>
                                            <option value="materials">Materials</option>
                                            <option value="ready">Ready</option>
                                            <option value="rejected">Rejected</option>
                                          </select>
                                            row.color = "#www"
                                        }else if(json.rows[i].status === 1){
                                          row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DIS")}>
                                          <option value="pending">Pending</option>
                                          <option value="progress" defaultValue style={{backgroundColor:"#yyy"}}>In progress</option>
                                          <option value="materials">Materials</option>
                                          <option value="ready">Ready</option>
                                          <option value="rejected">Rejected</option>
                                        </select>
                                            row.color = "#yyy"
                                        }else if(json.rows[i].status === 2){
                                          row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DIS")}>
                                          <option value="pending">Pending</option>
                                          <option value="progress">In progress</option>
                                          <option value="materials">Materials</option>
                                          <option value="ready" defaultValue>Ready</option>
                                          <option value="rejected">Rejected</option>
                                          </select>
                                            row.color = "#ggg"
                                        }else if(json.rows[i].status === 3){
                                            row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DIS")}>
                                          <option value="pending">Pending</option>
                                          <option value="progress">In progress</option>
                                          <option value="materials">Materials</option>
                                          <option value="ready">Ready</option>
                                          <option value="rejected" defaultValue>Rejected</option>
                                        </select>
                                            row.color = "#rrr"
                                        }else{
                                          row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NWC")}>
                                          <option value="pending">Pending</option>
                                          <option value="progress">In progress</option>
                                          <option value="materials" defaultValue>Materials</option>
                                          <option value="ready">Ready</option>
                                          <option value="rejected">Rejected</option>
                                        </select>
                                            row.color = "#bbb"
                                        }
                                        if(json.rows[i].priority === 0 || !json.rows[i].priority){
                                          row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DIS")} >
                                          <option value="low" defaultValue>Low</option>
                                          <option value="medium">Medium</option>
                                          <option value="high">High</option>
                                        </select>
                                        }else if(json.rows[i].priority === 1){
                                          row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DIS")}>
                                          <option value="low">Low</option>
                                          <option value="medium" defaultValue>Medium</option>
                                          <option value="high">High</option>
                                        </select>
                                        }else if(json.rows[i].priority === 2){
                                          row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DIS")}>
                                          <option value="low">Low</option>
                                          <option value="medium">Medium</option>
                                          <option value="high" defaultValue>High</option>
                                          </select>
                                        }
                                        if(secureStorage.getItem("user") === json.rows[i].email){
                                          row.observations = <ObservationsPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations} updateData={this.props.updateData} updateObservations={this.updateObservations.bind(this)}/>
                                        } else {
                                          row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                                        }

                                      }else{
                                        row["admin"] = json.rows[i].admin

                                        if(json.rows[i].priority === 0){
                                          row.priority = "Low"
                                        }else if(json.rows[i].priority === 1){
                                            row.priority = "Medium"
                                        }else if(json.rows[i].priority === 2){
                                            row.priority = "High"
                                        }

                                        if(json.rows[i].status === 0){
                                          row.status = "Pending"
                                          row.color = "#www"
                                        }else if(json.rows[i].status === 1){
                                            row.status = "In progress"
                                            row.color = "#yyy"
                                        }else if(json.rows[i].status === 2){
                                            row.status = "Ready"
                                            row.color = "#ggg"
                                        }else if(json.rows[i].status === 3){
                                          row.status = "Rejected"
                                          row.color = "#rrr"
                                        }else{
                                          row.status = "Materials"
                                          row.color = "#bbb"
                                        }

                                        row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                                      }

                                      const today = moment()
                                      const createdDate = moment(row.created_at)

                                      if (!createdDate.add(2, 'weeks').isSameOrAfter(today) && !(json.rows[i].status === 2 || json.rows[i].status === 3)) {
                                        row.color = "#ppp" 
                                        if(this.props.currentUser === json.rows[i].email){
                                          alertCount++
                                        }
                                      }
                      
                                      if(json.rows[i].status === 0 || json.rows[i].status === 1 || json.rows[i].status === 4){
                                        pendingRows.push(row)
                                      }
                                  }
                                }

                                /* Permissions */
                                await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getPERByProjects/"+secureStorage.getItem("user"), options)
                                .then(response => response.json())
                                .then(async json => {
                                var row = null
                                  if(json.rows){
                                    for(let i = 0; i < json.rows.length; i++){
                                      
                                      let carta = ""
                                      if(json.rows[i].carta){
                                        carta = " - " + json.rows[i].carta
                                      }
                                      if(json.rows[i].attach === 1){
                                        if(json.rows[i].accept_reject_date != null){
                                          row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19).toString().substring(0,10), key: json.rows[i].incidence_number}
                                        }else{
                                          row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: "", key: json.rows[i].incidence_number}
                                        }
                                      }else{
                                        if(json.rows[i].accept_reject_date != null){
                                          row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                                        }else{
                                          row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: "", key: json.rows[i].incidence_number}
                                        }
                                      }
                                        if(secureStorage.getItem("role") === "3D Admin"){
                                          row["hours"] = <input style={{width: "55px"}} type="text" defaultValue={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                                          row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="PER" changeAdmin = {this.changeAdmin.bind(this)}/>
                                          if(json.rows[i].status === 0){
                                              row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "PER")} >
                                              <option value="pending" defaultValue>Pending</option>
                                              <option value="progress">In progress</option>
                                              <option value="materials">Materials</option>
                                              <option value="ready">Ready</option>
                                              <option value="rejected">Rejected</option>
                                            </select>
                                              row.color = "#www"
                                          }else if(json.rows[i].status === 1){
                                            row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "PER")}>
                                            <option value="pending">Pending</option>
                                            <option value="progress" defaultValue style={{backgroundColor:"#yyy"}}>In progress</option>
                                            <option value="materials">Materials</option>
                                            <option value="ready">Ready</option>
                                            <option value="rejected">Rejected</option>
                                          </select>
                                              row.color = "#yyy"
                                          }else if(json.rows[i].status === 2){
                                            row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "PER")}>
                                            <option value="pending">Pending</option>
                                            <option value="progress">In progress</option>
                                            <option value="materials">Materials</option>
                                            <option value="ready" defaultValue>Ready</option>
                                            <option value="rejected">Rejected</option>
                                            </select>
                                              row.color = "#ggg"
                                          }else if(json.rows[i].status === 3){
                                              row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "PER")}>
                                            <option value="pending">Pending</option>
                                            <option value="progress">In progress</option>
                                            <option value="materials">Materials</option>
                                            <option value="ready">Ready</option>
                                            <option value="rejected" defaultValue>Rejected</option>
                                          </select>
                                              row.color = "#rrr"
                                          }else{
                                            row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "PER")}>
                                            <option value="pending">Pending</option>
                                            <option value="progress">In progress</option>
                                            <option value="materials" defaultValue>Materials</option>
                                            <option value="ready">Ready</option>
                                            <option value="rejected">Rejected</option>
                                          </select>
                                              row.color = "#bbb"
                                          }
                                          if(json.rows[i].priority === 0 || !json.rows[i].priority){
                                            row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "PER")} >
                                            <option value="low" defaultValue>Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                          </select>
                                          }else if(json.rows[i].priority === 1){
                                            row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "PER")}>
                                            <option value="low">Low</option>
                                            <option value="medium" defaultValue>Medium</option>
                                            <option value="high">High</option>
                                          </select>
                                          }else if(json.rows[i].priority === 2){
                                            row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "PER")}>
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high" defaultValue>High</option>
                                            </select>
                                          }
                                          if(secureStorage.getItem("user") === json.rows[i].email){
                                            row.observations = <ObservationsPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations} updateData={this.props.updateData} updateObservations={this.updateObservations.bind(this)}/>
                                          } else {
                                            row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                                          }
                                        }else{
                                          row["admin"] = json.rows[i].admin

                                          if(json.rows[i].priority === 0){
                                            row.priority = "Low"
                                          }else if(json.rows[i].priority === 1){
                                              row.priority = "Medium"
                                          }else if(json.rows[i].priority === 2){
                                              row.priority = "High"
                                          }

                                          if(json.rows[i].status === 0){
                                            row.status = "Pending"
                                            row.color = "#www"
                                          }else if(json.rows[i].status === 1){
                                              row.status = "In progress"
                                              row.color = "#yyy"
                                          }else if(json.rows[i].status === 2){
                                              row.status = "Ready"
                                              row.color = "#ggg"
                                          }else if(json.rows[i].status === 3){
                                            row.status = "Rejected"
                                            row.color = "#rrr"
                                          }else{
                                            row.status = "Materials"
                                            row.color = "#bbb"
                                          }

                                          row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                                        }

                                        const today = moment()
                                        const createdDate = moment(row.created_at)

                                        if (!createdDate.add(2, 'weeks').isSameOrAfter(today) && !(json.rows[i].status === 2 || json.rows[i].status === 3)) {
                                          row.color = "#ppp" 
                                          if(this.props.currentUser === json.rows[i].email){
                                            alertCount++
                                          }
                                        }
                        
                                        if(json.rows[i].status === 0 || json.rows[i].status === 1 || json.rows[i].status === 4){
                                          pendingRows.push(row)
                                        }
                                                }
                                  }

                                  /* Modeling */
                                  await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getMODByProjects/"+secureStorage.getItem("user"), options)
                                  .then(response => response.json())
                                  .then(async json => {
                                  var row = null
                                    if(json.rows){
                                      for(let i = 0; i < json.rows.length; i++){
                                        
                                        let carta = ""
                                        if(json.rows[i].carta){
                                          carta = " - " + json.rows[i].carta
                                        }
                                        if(json.rows[i].attach === 1){
                                          if(json.rows[i].accept_reject_date != null){
                                            row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19).toString().substring(0,10), key: json.rows[i].incidence_number}
                                          }else{
                                            row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: "", key: json.rows[i].incidence_number}
                                          }
                                        }else{
                                          if(json.rows[i].accept_reject_date != null){
                                            row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                                          }else{
                                            row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: "", key: json.rows[i].incidence_number}
                                          }
                                        }
                                          if(secureStorage.getItem("role") === "3D Admin"){
                                            row["hours"] = <input style={{width: "55px"}} type="text" defaultValue={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                                            row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="MOD" changeAdmin = {this.changeAdmin.bind(this)}/>
                                            if(json.rows[i].status === 0){
                                                row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "MOD")} >
                                                <option value="pending" defaultValue>Pending</option>
                                                <option value="progress">In progress</option>
                                                <option value="materials">Materials</option>
                                                <option value="ready">Ready</option>
                                                <option value="rejected">Rejected</option>
                                              </select>
                                                row.color = "#www"
                                            }else if(json.rows[i].status === 1){
                                              row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "MOD")}>
                                              <option value="pending">Pending</option>
                                              <option value="progress" defaultValue style={{backgroundColor:"#yyy"}}>In progress</option>
                                              <option value="materials">Materials</option>
                                              <option value="ready">Ready</option>
                                              <option value="rejected">Rejected</option>
                                            </select>
                                                row.color = "#yyy"
                                            }else if(json.rows[i].status === 2){
                                              row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "MOD")}>
                                              <option value="pending">Pending</option>
                                              <option value="progress">In progress</option>
                                              <option value="materials">Materials</option>
                                              <option value="ready" defaultValue>Ready</option>
                                              <option value="rejected">Rejected</option>
                                              </select>
                                                row.color = "#ggg"
                                            }else if(json.rows[i].status === 3){
                                                row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "MOD")}>
                                              <option value="pending">Pending</option>
                                              <option value="progress">In progress</option>
                                              <option value="materials">Materials</option>
                                              <option value="ready">Ready</option>
                                              <option value="rejected" defaultValue>Rejected</option>
                                            </select>
                                                row.color = "#rrr"
                                            }else{
                                              row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "MOD")}>
                                              <option value="pending">Pending</option>
                                              <option value="progress">In progress</option>
                                              <option value="materials" defaultValue>Materials</option>
                                              <option value="ready">Ready</option>
                                              <option value="rejected">Rejected</option>
                                            </select>
                                                row.color = "#bbb"
                                            }
                                            if(json.rows[i].priority === 0 || !json.rows[i].priority){
                                              row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "MOD")} >
                                              <option value="low" defaultValue>Low</option>
                                              <option value="medium">Medium</option>
                                              <option value="high">High</option>
                                            </select>
                                            }else if(json.rows[i].priority === 1){
                                              row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "MOD")}>
                                              <option value="low">Low</option>
                                              <option value="medium" defaultValue>Medium</option>
                                              <option value="high">High</option>
                                            </select>
                                            }else if(json.rows[i].priority === 2){
                                              row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "MOD")}>
                                              <option value="low">Low</option>
                                              <option value="medium">Medium</option>
                                              <option value="high" defaultValue>High</option>
                                              </select>
                                            }
                                            if(secureStorage.getItem("user") === json.rows[i].email){
                                              row.observations = <ObservationsPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations} updateData={this.props.updateData} updateObservations={this.updateObservations.bind(this)}/>
                                            } else {
                                              row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                                            }

                                          }else{
                                            row["admin"] = json.rows[i].admin

                                            if(json.rows[i].priority === 0){
                                              row.priority = "Low"
                                            }else if(json.rows[i].priority === 1){
                                                row.priority = "Medium"
                                            }else if(json.rows[i].priority === 2){
                                                row.priority = "High"
                                            }

                                            if(json.rows[i].status === 0){
                                              row.status = "Pending"
                                              row.color = "#www"
                                            }else if(json.rows[i].status === 1){
                                                row.status = "In progress"
                                                row.color = "#yyy"
                                            }else if(json.rows[i].status === 2){
                                                row.status = "Ready"
                                                row.color = "#ggg"
                                            }else if(json.rows[i].status === 3){
                                              row.status = "Rejected"
                                              row.color = "#rrr"
                                            }else{
                                              row.status = "Materials"
                                              row.color = "#bbb"
                                            }

                                            row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                                          }

                                          const today = moment()
                                          const createdDate = moment(row.created_at)

                                          if (!createdDate.add(2, 'weeks').isSameOrAfter(today) && !(json.rows[i].status === 2 || json.rows[i].status === 3)) {
                                            row.color = "#ppp" 
                                            if(this.props.currentUser === json.rows[i].email){
                                              alertCount++
                                            }
                                          }
                          
                                          if(json.rows[i].status === 0 || json.rows[i].status === 1 || json.rows[i].status === 4){
                                            pendingRows.push(row)
                                          }
                                                    }
                                    }

                                    /* Isometric Drawing */
                                    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getDSOByProjects/"+secureStorage.getItem("user"), options)
                                    .then(response => response.json())
                                    .then(async json => {
                                    var row = null
                                      if(json.rows){
                                        for(let i = 0; i < json.rows.length; i++){
                                          
                                          let carta = ""
                                          if(json.rows[i].carta){
                                            carta = " - " + json.rows[i].carta
                                          }
                                          if(json.rows[i].attach === 1){
                                            if(json.rows[i].accept_reject_date != null){
                                              row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19).toString().substring(0,10), key: json.rows[i].incidence_number}
                                            }else{
                                              row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: "", key: json.rows[i].incidence_number}
                                            }
                                          }else{
                                            if(json.rows[i].accept_reject_date != null){
                                              row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                                            }else{
                                              row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: "", key: json.rows[i].incidence_number}
                                            }
                                          }
                                            if(secureStorage.getItem("role") === "3D Admin"){
                                              row["hours"] = <input style={{width: "55px"}} type="text" defaultValue={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                                              row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="DSO" changeAdmin = {this.changeAdmin.bind(this)}/>
                                              if(json.rows[i].status === 0){
                                                  row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DSO")} >
                                                  <option value="pending" defaultValue>Pending</option>
                                                  <option value="progress">In progress</option>
                                                  <option value="materials">Materials</option>
                                                  <option value="ready">Ready</option>
                                                  <option value="rejected">Rejected</option>
                                                </select>
                                                  row.color = "#www"
                                              }else if(json.rows[i].status === 1){
                                                row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DSO")}>
                                                <option value="pending">Pending</option>
                                                <option value="progress" defaultValue style={{backgroundColor:"#yyy"}}>In progress</option>
                                                <option value="materials">Materials</option>
                                                <option value="ready">Ready</option>
                                                <option value="rejected">Rejected</option>
                                              </select>
                                                  row.color = "#yyy"
                                              }else if(json.rows[i].status === 2){
                                                row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DSO")}>
                                                <option value="pending">Pending</option>
                                                <option value="progress">In progress</option>
                                                <option value="materials">Materials</option>
                                                <option value="ready" defaultValue>Ready</option>
                                                <option value="rejected">Rejected</option>
                                                </select>
                                                  row.color = "#ggg"
                                              }else if(json.rows[i].status === 3){
                                                  row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DSO")}>
                                                <option value="pending">Pending</option>
                                                <option value="progress">In progress</option>
                                                <option value="materials">Materials</option>
                                                <option value="ready">Ready</option>
                                                <option value="rejected" defaultValue>Rejected</option>
                                              </select>
                                                  row.color = "#rrr"
                                              }else{
                                                row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DSO")}>
                                                <option value="pending">Pending</option>
                                                <option value="progress">In progress</option>
                                                <option value="materials" defaultValue>Materials</option>
                                                <option value="ready">Ready</option>
                                                <option value="rejected">Rejected</option>
                                              </select>
                                                  row.color = "#bbb"
                                              }
                                              if(json.rows[i].priority === 0 || !json.rows[i].priority){
                                                row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DSO")} >
                                                <option value="low" defaultValue>Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                              </select>
                                              }else if(json.rows[i].priority === 1){
                                                row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DSO")}>
                                                <option value="low">Low</option>
                                                <option value="medium" defaultValue>Medium</option>
                                                <option value="high">High</option>
                                              </select>
                                              }else if(json.rows[i].priority === 2){
                                                row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DSO")}>
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high" defaultValue>High</option>
                                                </select>
                                              }
                                              if(secureStorage.getItem("user") === json.rows[i].email){
                                                row.observations = <ObservationsPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations} updateData={this.props.updateData} updateObservations={this.updateObservations.bind(this)}/>
                                              } else {
                                                row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                                              }
                                            }else{
                                              row["admin"] = json.rows[i].admin

                                              if(json.rows[i].priority === 0){
                                                row.priority = "Low"
                                              }else if(json.rows[i].priority === 1){
                                                  row.priority = "Medium"
                                              }else if(json.rows[i].priority === 2){
                                                  row.priority = "High"
                                              }

                                              if(json.rows[i].status === 0){
                                                row.status = "Pending"
                                                row.color = "#www"
                                              }else if(json.rows[i].status === 1){
                                                  row.status = "In progress"
                                                  row.color = "#yyy"
                                              }else if(json.rows[i].status === 2){
                                                  row.status = "Ready"
                                                  row.color = "#ggg"
                                              }else if(json.rows[i].status === 3){
                                                row.status = "Rejected"
                                                row.color = "#rrr"
                                              }else{
                                                row.status = "Materials"
                                                row.color = "#bbb"
                                              }

                                              row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                                            }

                                            const today = moment()
                                            const createdDate = moment(row.created_at)

                                            if (!createdDate.add(2, 'weeks').isSameOrAfter(today) && !(json.rows[i].status === 2 || json.rows[i].status === 3)) {
                                              row.color = "#ppp" 
                                              if(this.props.currentUser === json.rows[i].email){
                                                alertCount++
                                              }
                                            }
                            
                                            if(json.rows[i].status === 0 || json.rows[i].status === 1 || json.rows[i].status === 4){
                                              pendingRows.push(row)
                                            }
                                                        }
                                      }

                                        /* Ortographic Drawing */
                                        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getDORByProjects/"+secureStorage.getItem("user"), options)
                                        .then(response => response.json())
                                        .then(async json => {
                                        var row = null
                                          if(json.rows){
                                            for(let i = 0; i < json.rows.length; i++){
                                              
                                              let carta = ""
                                              if(json.rows[i].carta){
                                                carta = " - " + json.rows[i].carta
                                              }
                                              if(json.rows[i].attach === 1){
                                                if(json.rows[i].accept_reject_date != null){
                                                  row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19).toString().substring(0,10), key: json.rows[i].incidence_number}
                                                }else{
                                                  row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: "", key: json.rows[i].incidence_number}
                                                }
                                              }else{
                                                if(json.rows[i].accept_reject_date != null){
                                                  row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                                                }else{
                                                  row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: "", key: json.rows[i].incidence_number}
                                                }
                                              }
                                                if(secureStorage.getItem("role") === "3D Admin"){
                                                  row["hours"] = <input style={{width: "55px"}} type="text" defaultValue={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                                                  row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="DOR" changeAdmin = {this.changeAdmin.bind(this)}/>
                                                  if(json.rows[i].status === 0){
                                                      row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DOR")} >
                                                      <option value="pending" defaultValue>Pending</option>
                                                      <option value="progress">In progress</option>
                                                      <option value="materials">Materials</option>
                                                      <option value="ready">Ready</option>
                                                      <option value="rejected">Rejected</option>
                                                    </select>
                                                      row.color = "#www"
                                                  }else if(json.rows[i].status === 1){
                                                    row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DOR")}>
                                                    <option value="pending">Pending</option>
                                                    <option value="progress" defaultValue style={{backgroundColor:"#yyy"}}>In progress</option>
                                                    <option value="materials">Materials</option>
                                                    <option value="ready">Ready</option>
                                                    <option value="rejected">Rejected</option>
                                                  </select>
                                                      row.color = "#yyy"
                                                  }else if(json.rows[i].status === 2){
                                                    row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DOR")}>
                                                    <option value="pending">Pending</option>
                                                    <option value="progress">In progress</option>
                                                    <option value="materials">Materials</option>
                                                    <option value="ready" defaultValue>Ready</option>
                                                    <option value="rejected">Rejected</option>
                                                    </select>
                                                      row.color = "#ggg"
                                                  }else if(json.rows[i].status === 3){
                                                      row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DOR")}>
                                                    <option value="pending">Pending</option>
                                                    <option value="progress">In progress</option>
                                                    <option value="materials">Materials</option>
                                                    <option value="ready">Ready</option>
                                                    <option value="rejected" defaultValue>Rejected</option>
                                                  </select>
                                                      row.color = "#rrr"
                                                  }else{
                                                    row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DOR")}>
                                                    <option value="pending">Pending</option>
                                                    <option value="progress">In progress</option>
                                                    <option value="materials" defaultValue>Materials</option>
                                                    <option value="ready">Ready</option>
                                                    <option value="rejected">Rejected</option>
                                                  </select>
                                                      row.color = "#bbb"
                                                  }
                                                  if(json.rows[i].priority === 0 || !json.rows[i].priority){
                                                    row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DOR")} >
                                                    <option value="low" defaultValue>Low</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="high">High</option>
                                                  </select>
                                                  }else if(json.rows[i].priority === 1){
                                                    row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DOR")}>
                                                    <option value="low">Low</option>
                                                    <option value="medium" defaultValue>Medium</option>
                                                    <option value="high">High</option>
                                                  </select>
                                                  }else if(json.rows[i].priority === 2){
                                                    row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DOR")}>
                                                    <option value="low">Low</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="high" defaultValue>High</option>
                                                    </select>
                                                  }
                                                  if(secureStorage.getItem("user") === json.rows[i].email){
                                                    row.observations = <ObservationsPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations} updateData={this.props.updateData} updateObservations={this.updateObservations.bind(this)}/>
                                                  } else {
                                                    row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                                                  }

                                                }else{
                                                  row["admin"] = json.rows[i].admin

                                                  if(json.rows[i].priority === 0){
                                                    row.priority = "Low"
                                                  }else if(json.rows[i].priority === 1){
                                                      row.priority = "Medium"
                                                  }else if(json.rows[i].priority === 2){
                                                      row.priority = "High"
                                                  }

                                                  if(json.rows[i].status === 0){
                                                    row.status = "Pending"
                                                    row.color = "#www"
                                                  }else if(json.rows[i].status === 1){
                                                      row.status = "In progress"
                                                      row.color = "#yyy"
                                                  }else if(json.rows[i].status === 2){
                                                      row.status = "Ready"
                                                      row.color = "#ggg"
                                                  }else if(json.rows[i].status === 3){
                                                    row.status = "Rejected"
                                                    row.color = "#rrr"
                                                  }else{
                                                    row.status = "Materials"
                                                    row.color = "#bbb"
                                                  }

                                                  row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                                                }
                                                
                                                const today = moment()
                                                const createdDate = moment(row.created_at)

                                                if (!createdDate.add(2, 'weeks').isSameOrAfter(today) && !(json.rows[i].status === 2 || json.rows[i].status === 3)) {
                                                  row.color = "#ppp" 
                                                  if(this.props.currentUser === json.rows[i].email){
                                                    alertCount++
                                                  }
                                                }
                                
                                                if(json.rows[i].status === 0 || json.rows[i].status === 1 || json.rows[i].status === 4){
                                                  pendingRows.push(row)
                                                }
                                                                }
                                          }
                                          
                                            /* Citrix */
                                            await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getCITByProjects/"+secureStorage.getItem("user"), options)
                                            .then(response => response.json())
                                            .then(async json => {
                                            var row = null
                                              if(json.rows){
                                                for(let i = 0; i < json.rows.length; i++){
                                                  
                                                  let carta = ""
                                                  if(json.rows[i].carta){
                                                    carta = " - " + json.rows[i].carta
                                                  }
                                                  if(json.rows[i].attach === 1){
                                                    if(json.rows[i].accept_reject_date != null){
                                                      row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19).toString().substring(0,10), key: json.rows[i].incidence_number}
                                                    }else{
                                                      row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: "", key: json.rows[i].incidence_number}
                                                    }
                                                  }else{
                                                    if(json.rows[i].accept_reject_date != null){
                                                      row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                                                    }else{
                                                      row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: "", key: json.rows[i].incidence_number}
                                                    }
                                                  }
                                                    if(secureStorage.getItem("role") === "3D Admin"){
                                                      row["hours"] = <input style={{width: "55px"}} type="text" defaultValue={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                                                      row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="CIT" changeAdmin = {this.changeAdmin.bind(this)}/>
                                                      if(json.rows[i].status === 0){
                                                          row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "CIT")} >
                                                          <option value="pending" defaultValue>Pending</option>
                                                          <option value="progress">In progress</option>
                                                          <option value="materials">Materials</option>
                                                          <option value="ready">Ready</option>
                                                          <option value="rejected">Rejected</option>
                                                        </select>
                                                          row.color = "#www"
                                                      }else if(json.rows[i].status === 1){
                                                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "CIT")}>
                                                        <option value="pending">Pending</option>
                                                        <option value="progress" defaultValue style={{backgroundColor:"#yyy"}}>In progress</option>
                                                        <option value="materials">Materials</option>
                                                        <option value="ready">Ready</option>
                                                        <option value="rejected">Rejected</option>
                                                      </select>
                                                          row.color = "#yyy"
                                                      }else if(json.rows[i].status === 2){
                                                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "CIT")}>
                                                        <option value="pending">Pending</option>
                                                        <option value="progress">In progress</option>
                                                        <option value="materials">Materials</option>
                                                        <option value="ready" defaultValue>Ready</option>
                                                        <option value="rejected">Rejected</option>
                                                        </select>
                                                          row.color = "#ggg"
                                                      }else if(json.rows[i].status === 3){
                                                          row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "CIT")}>
                                                        <option value="pending">Pending</option>
                                                        <option value="progress">In progress</option>
                                                        <option value="materials">Materials</option>
                                                        <option value="ready">Ready</option>
                                                        <option value="rejected" defaultValue>Rejected</option>
                                                      </select>
                                                          row.color = "#rrr"
                                                      }else{
                                                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "CIT")}>
                                                        <option value="pending">Pending</option>
                                                        <option value="progress">In progress</option>
                                                        <option value="materials" defaultValue>Materials</option>
                                                        <option value="ready">Ready</option>
                                                        <option value="rejected">Rejected</option>
                                                      </select>
                                                          row.color = "#bbb"
                                                      }
                                                      if(json.rows[i].priority === 0 || !json.rows[i].priority){
                                                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "CIT")} >
                                                        <option value="low" defaultValue>Low</option>
                                                        <option value="medium">Medium</option>
                                                        <option value="high">High</option>
                                                      </select>
                                                      }else if(json.rows[i].priority === 1){
                                                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "CIT")}>
                                                        <option value="low">Low</option>
                                                        <option value="medium" defaultValue>Medium</option>
                                                        <option value="high">High</option>
                                                      </select>
                                                      }else if(json.rows[i].priority === 2){
                                                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "CIT")}>
                                                        <option value="low">Low</option>
                                                        <option value="medium">Medium</option>
                                                        <option value="high" defaultValue>High</option>
                                                        </select>
                                                      }
                                                      if(secureStorage.getItem("user") === json.rows[i].email){
                                                        row.observations = <ObservationsPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations} updateData={this.props.updateData} updateObservations={this.updateObservations.bind(this)}/>
                                                      } else {
                                                        row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                                                      }
                                                    }else{
                                                      row["admin"] = json.rows[i].admin

                                                      if(json.rows[i].priority === 0){
                                                        row.priority = "Low"
                                                      }else if(json.rows[i].priority === 1){
                                                          row.priority = "Medium"
                                                      }else if(json.rows[i].priority === 2){
                                                          row.priority = "High"
                                                      }

                                                      if(json.rows[i].status === 0){
                                                        row.status = "Pending"
                                                        row.color = "#www"
                                                      }else if(json.rows[i].status === 1){
                                                          row.status = "In progress"
                                                          row.color = "#yyy"
                                                      }else if(json.rows[i].status === 2){
                                                          row.status = "Ready"
                                                          row.color = "#ggg"
                                                      }else if(json.rows[i].status === 3){
                                                        row.status = "Rejected"
                                                        row.color = "#rrr"
                                                      }else{
                                                        row.status = "Materials"
                                                        row.color = "#bbb"
                                                      }

                                                      row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                                                    }

                                                    const today = moment()
                                                    const createdDate = moment(row.created_at)

                                                    if (!createdDate.add(2, 'weeks').isSameOrAfter(today) && !(json.rows[i].status === 2 || json.rows[i].status === 3)) {
                                                      row.color = "#ppp" 
                                                      if(this.props.currentUser === json.rows[i].email){
                                                        alertCount++
                                                      }
                                                    }
                                    
                                                    if(json.rows[i].status === 0 || json.rows[i].status === 1 || json.rows[i].status === 4){
                                                      pendingRows.push(row)
                                                    }
                                                                        }
                                              }

                                              /* */
                                            })
                                        })

                                      })

                                    })
                                
                                  })
                              
                                })
                            
                              })

                                // Sort the array based on the second element
                                rows.sort(function(first, second) {
                                  return second.created_at.localeCompare(first.created_at);
                                });

                                let filterRow
                                if(secureStorage.getItem("role") === "3D Admin"){
                                  filterRow = [{incidence_number: <div><input type="text" className="filter__input" placeholder="Reference" onChange={(e) => this.filter(0, e.target.value)}/></div>, project: <div><input type="text" className="filter__input" placeholder="Project" onChange={(e) => this.filter(1, e.target.value)}/></div>, user: <div><input type="text" className="filter__input" placeholder="User" onChange={(e) => this.filter(2, e.target.value)}/></div>, created_at: <div><input type="text" className="filter__input" placeholder="Date" onChange={(e) => this.filter(4,e.target.value)}/></div>, ar_date: <div><input type="text" className="filter__input" placeholder="Date" onChange={(e) => this.filter(6,e.target.value)}/></div>, admin: <div><input type="text" className="filter__input" placeholder="Admin" onChange={(e) => this.filter(9,e.target.value)}/></div>, status: <div><input type="text" className="filter__input" placeholder="Status" onChange={(e) => this.filter(10,e.target.value)}/></div>, priority: <div><input type="text" className="filter__input" placeholder="Priority" onChange={(e) => this.filter(12,e.target.value)}/></div>}]
                                }else{
                                  filterRow = [{incidence_number: <div><input type="text" className="filter__input" placeholder="Reference" onChange={(e) => this.filterD(0, e.target.value)}/></div>, project: <div><input type="text" className="filter__input" placeholder="Project" onChange={(e) => this.filterD(1, e.target.value)}/></div>, user: <div><input type="text" className="filter__input" placeholder="User" onChange={(e) => this.filterD(2, e.target.value)}/></div>, created_at: <div><input type="text" className="filter__input" placeholder="Date" onChange={(e) => this.filterD(4,e.target.value)}/></div>, ar_date: <div><input type="text" className="filter__input" placeholder="Date" onChange={(e) => this.filterD(6,e.target.value)}/></div>, admin: <div><input type="text" className="filter__input" placeholder="Admin" onChange={(e) => this.filterD(8,e.target.value)}/></div>, status: <div><input type="text" className="filter__input" placeholder="Status" onChange={(e) => this.filterD(10,e.target.value)}/></div>, priority: <div><input type="text" className="filter__input" placeholder="Priority" onChange={(e) => this.filterD(9,e.target.value)}/></div>}]                  
                                }
                                //Una vez obtenidas todas las incidencias guardamos el estado
                                pendingRows = pendingRows.sort((a, b) => (a.created_at < b.created_at) ? 1 : -1)

                                this.setState({data : rows, pendingData: pendingRows, displayData: pendingRows, alertCount: alertCount});
                                this.props.alertCount(alertCount)
                                //console.log("COntador " + );
                                await this.setState({filters : filterRow})
                                if(this.props.currentProject !== "All"){
                                  this.filter(1, this.props.currentProject)
                                }

                            })

                        })

                    })

                })

            })
            
        })

  }


  async componentDidUpdate(prevProps, prevState){
    if(prevProps.updateData !== this.props.updateData || prevProps.showAll !== this.props.showAll){
    if(prevProps.showAll !== this.props.showAll){
      if(this.props.showAll){
        this.setState({displayData: this.state.data})
      }else{
        this.setState({displayData: this.state.pendingData})
      }
    }else{

      const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getNWCByProjects/"+secureStorage.getItem("user"), options)
        .then(response => response.json())
        .then(async json => {
          var rows = []
          var pendingRows = []
          var row = null
          var alertCount = 0
          if(json.rows){
            for(let i = 0; i < json.rows.length; i++){
                if (json.rows[i].description){

                }
                let carta = ""
                if(json.rows[i].carta){
                  carta = " - " + json.rows[i].carta
                }
                if(json.rows[i].attach === 1){
                  if(json.rows[i].accept_reject_date != null){
                    
                    row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNWCSpecPopUp incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19).toString().substring(0,10), key: json.rows[i].incidence_number}
                  }else{
                    row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNWCSpecPopUp incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: "", key: json.rows[i].incidence_number}
                  }
                }else{
                  if(json.rows[i].accept_reject_date != null){
                    row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNWCSpecPopUp incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                  }else{
                    row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNWCSpecPopUp incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: "", key: json.rows[i].incidence_number}
                  }
                }

                if(secureStorage.getItem("role") === "3D Admin"){
                  row["hours"] = <input style={{width: "55px"}} type="text" defaultValue={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                  row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="NWC" changeAdmin = {this.changeAdmin.bind(this)}/>
                  if(json.rows[i].status === 0){
                      row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NWC")} >
                      <option value="pending" defaultValue>Pending</option>
                      <option value="progress">In progress</option>
                      <option value="materials">Materials</option>
                      <option value="ready">Ready</option>
                      <option value="rejected">Rejected</option>
                    </select>
                      row.color = "#www"
                  }else if(json.rows[i].status === 1){
                    row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NWC")}>
                    <option value="pending">Pending</option>
                    <option value="progress" defaultValue style={{backgroundColor:"#yyy"}}>In progress</option>
                    <option value="materials">Materials</option>
                    <option value="ready">Ready</option>
                    <option value="rejected">Rejected</option>
                  </select>
                      row.color = "#yyy"
                  }else if(json.rows[i].status === 2){
                    row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NWC")}>
                    <option value="pending">Pending</option>
                    <option value="progress">In progress</option>
                    <option value="materials">Materials</option>
                    <option value="ready" defaultValue>Ready</option>
                    <option value="rejected">Rejected</option>
                    </select>
                      row.color = "#ggg"
                  }else if(json.rows[i].status === 3){
                    row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NWC")}>
                    <option value="pending">Pending</option>
                    <option value="progress">In progress</option>
                    <option value="materials">Materials</option>
                    <option value="ready">Ready</option>
                    <option value="rejected" defaultValue>Rejected</option>
                   </select>
                      row.color = "#rrr"
                  }else{
                    row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NWC")}>
                    <option value="pending">Pending</option>
                    <option value="progress">In progress</option>
                    <option value="materials" defaultValue>Materials</option>
                    <option value="ready">Ready</option>
                    <option value="rejected">Rejected</option>
                   </select>
                      row.color = "#bbb"
                  }

                  if(json.rows[i].priority === 0 || !json.rows[i].priority){
                    row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NWC")} >
                    <option value="low" defaultValue>Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  }else if(json.rows[i].priority === 1){
                    row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NWC")}>
                    <option value="low">Low</option>
                    <option value="medium" defaultValue>Medium</option>
                    <option value="high">High</option>
                  </select>
                  }else if(json.rows[i].priority === 2){
                    row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NWC")}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high" defaultValue>High</option>
                    </select>
                  }

                  if(secureStorage.getItem("user") === json.rows[i].email){
                    row.observations = <ObservationsPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations} updateData={this.props.updateData} updateObservations={this.updateObservations.bind(this)}/>
                  } else {
                    row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                  }

                }else{
                  row["admin"] = json.rows[i].admin
                  if(json.rows[i].priority === 0){
                    row.priority = "Low"
                  }else if(json.rows[i].priority === 1){
                      row.priority = "Medium"
                  }else if(json.rows[i].priority === 2){
                      row.priority = "High"
                  }

                  if(json.rows[i].status === 0){
                    row.status = "Pending"
                    row.color = "#www"
                  }else if(json.rows[i].status === 1){
                      row.status = "In progress"
                      row.color = "#yyy"
                  }else if(json.rows[i].status === 2){
                      row.status = "Ready"
                      row.color = "#ggg"
                  }else if(json.rows[i].status === 3){
                      row.status = "Rejected"
                      row.color = "#rrr"
                  }else{
                    row.status = "Materials"
                    row.color = "#bbb"
                  }

                  row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                }
                
                const today = moment()
                const createdDate = moment(row.created_at)

                if (!createdDate.add(2, 'weeks').isSameOrAfter(today) && !(json.rows[i].status === 2 || json.rows[i].status === 3)) {
                  row.color = "#ppp" 
                  if(this.props.currentUser === json.rows[i].email){
                    alertCount++
                  }
                }

                if(json.rows[i].status === 0 || json.rows[i].status === 1 || json.rows[i].status === 4){
                  pendingRows.push(row)
                }

            }
          }
            await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getNVNByProjects/"+secureStorage.getItem("user"), options)
            .then(response => response.json())
            .then(async json => {
            var row = null
              if(json.rows){
                for(let i = 0; i < json.rows.length; i++){
                  
                  let carta = ""
                  if(json.rows[i].carta){
                    carta = " - " + json.rows[i].carta
                  }
                  if(json.rows[i].attach === 1){
                    if(json.rows[i].accept_reject_date != null){
                      row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19).toString().substring(0,10), key: json.rows[i].incidence_number}
                    }else{
                      row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: "", key: json.rows[i].incidence_number}
                    }
                  }else{
                    if(json.rows[i].accept_reject_date != null){
                      row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                    }else{
                      row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: "", key: json.rows[i].incidence_number}
                    }
                  }
                    if(secureStorage.getItem("role") === "3D Admin"){
                      row["hours"] = <input style={{width: "55px"}} type="text" defaultValue={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                      row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="NVN" changeAdmin = {this.changeAdmin.bind(this)}/>
                      if(json.rows[i].status === 0){
                          row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NVN")} >
                          <option value="pending" defaultValue>Pending</option>
                          <option value="progress">In progress</option>
                          <option value="materials">Materials</option>
                          <option value="ready">Ready</option>
                          <option value="rejected">Rejected</option>
                        </select>
                          row.color = "#www"
                      }else if(json.rows[i].status === 1){
                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NVN")}>
                        <option value="pending">Pending</option>
                        <option value="progress" defaultValue style={{backgroundColor:"#yyy"}}>In progress</option>
                        <option value="materials">Materials</option>
                        <option value="ready">Ready</option>
                        <option value="rejected">Rejected</option>
                      </select>
                          row.color = "#yyy"
                      }else if(json.rows[i].status === 2){
                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NVN")}>
                        <option value="pending">Pending</option>
                        <option value="progress">In progress</option>
                        <option value="materials">Materials</option>
                        <option value="ready" defaultValue>Ready</option>
                        <option value="rejected">Rejected</option>
                        </select>
                          row.color = "#ggg"
                      }else if(json.rows[i].status === 3){
                          row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NVN")}>
                        <option value="pending">Pending</option>
                        <option value="progress">In progress</option>
                        <option value="materials">Materials</option>
                        <option value="ready">Ready</option>
                        <option value="rejected" defaultValue>Rejected</option>
                       </select>
                          row.color = "#rrr"
                      }else{
                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NVN")}>
                        <option value="pending">Pending</option>
                        <option value="progress">In progress</option>
                        <option value="materials" defaultValue>Materials</option>
                        <option value="ready">Ready</option>
                        <option value="rejected">Rejected</option>
                       </select>
                          row.color = "#bbb"
                      }
                      if(json.rows[i].priority === 0 || !json.rows[i].priority){
                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NVN")} >
                        <option value="low" defaultValue>Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                      }else if(json.rows[i].priority === 1){
                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NVN")}>
                        <option value="low">Low</option>
                        <option value="medium" defaultValue>Medium</option>
                        <option value="high">High</option>
                      </select>
                      }else if(json.rows[i].priority === 2){
                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NVN")}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high" defaultValue>High</option>
                        </select>
                      }
                      if(secureStorage.getItem("user") === json.rows[i].email){
                        row.observations = <ObservationsPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations} updateData={this.props.updateData} updateObservations={this.updateObservations.bind(this)}/>
                      } else {
                        row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                      }
                    }else{
                      row["admin"] = json.rows[i].admin

                      if(json.rows[i].priority === 0){
                        row.priority = "Low"
                      }else if(json.rows[i].priority === 1){
                          row.priority = "Medium"
                      }else if(json.rows[i].priority === 2){
                          row.priority = "High"
                      }

                      if(json.rows[i].status === 0){
                        row.status = "Pending"
                        row.color = "#www"
                      }else if(json.rows[i].status === 1){
                          row.status = "In progress"
                          row.color = "#yyy"
                      }else if(json.rows[i].status === 2){
                          row.status = "Ready"
                          row.color = "#ggg"
                      }else if(json.rows[i].status === 3){
                        row.status = "Rejected"
                        row.color = "#rrr"
                      }else{
                        row.status = "Materials"
                        row.color = "#bbb"
                      }

                      row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                    }

                    const today = moment()
                    const createdDate = moment(row.created_at)

                    if (!createdDate.add(2, 'weeks').isSameOrAfter(today) && !(json.rows[i].status === 2 || json.rows[i].status === 3)) {
                      row.color = "#ppp" 
                      if(this.props.currentUser === json.rows[i].email){
                        alertCount++
                      }
                    }
    
                    if(json.rows[i].status === 0 || json.rows[i].status === 1 || json.rows[i].status === 4){
                      pendingRows.push(row)
                    }

                }
              }
                
                await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getNRIByProjects/"+secureStorage.getItem("user"), options)
                .then(response => response.json())
                .then(async json => {
                var row = null
                    if(json.rows){
                    for(let i = 0; i < json.rows.length; i++){
                      let carta = ""
                      if(json.rows[i].carta){
                        carta = " - " + json.rows[i].carta
                      }
                      if(json.rows[i].attach === 1){
                        if(json.rows[i].accept_reject_date != null){
                          row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNRISpecPopUp incidence_number={json.rows[i].incidence_number} pipe={json.rows[i].pipe} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19).toString().substring(0,10),key: json.rows[i].incidence_number}
                        }else{
                          row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNRISpecPopUp incidence_number={json.rows[i].incidence_number} pipe={json.rows[i].pipe} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: "", key: json.rows[i].incidence_number}
                        }
                      }else{
                        if(json.rows[i].accept_reject_date != null){
                          row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNRISpecPopUp incidence_number={json.rows[i].incidence_number} pipe={json.rows[i].pipe} description={json.rows[i].description}/>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                        }else{
                          row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNRISpecPopUp incidence_number={json.rows[i].incidence_number} pipe={json.rows[i].pipe} description={json.rows[i].description}/>, ar_date: "", key: json.rows[i].incidence_number}
                        }
                      }
                        if(secureStorage.getItem("role") === "3D Admin"){
                          row["hours"] = <input style={{width: "55px"}} type="text" defaultValue={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                          row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="NRI" changeAdmin = {this.changeAdmin.bind(this)}/>
                          if(json.rows[i].status === 0){
                              row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRI")} >
                              <option value="pending" defaultValue>Pending</option>
                              <option value="progress">In progress</option>
                              <option value="materials">Materials</option>
                              <option value="ready">Ready</option>
                              <option value="rejected">Rejected</option>
                            </select>
                              row.color = "#www"
                          }else if(json.rows[i].status === 1){
                            row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRI")}>
                            <option value="pending">Pending</option>
                            <option value="progress" defaultValue style={{backgroundColor:"#yyy"}}>In progress</option>
                            <option value="materials">Materials</option>
                            <option value="ready">Ready</option>
                            <option value="rejected">Rejected</option>
                          </select>
                              row.color = "#yyy"
                          }else if(json.rows[i].status === 2){
                            row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRI")}>
                            <option value="pending">Pending</option>
                            <option value="progress">In progress</option>
                            <option value="materials">Materials</option>
                            <option value="ready" defaultValue>Ready</option>
                            <option value="rejected">Rejected</option>
                            </select>
                              row.color = "#ggg"
                          }else if(json.rows[i].status === 3){
                            row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRI")}>
                            <option value="pending">Pending</option>
                            <option value="progress">In progress</option>
                            <option value="materials">Materials</option>
                            <option value="ready">Ready</option>
                            <option value="rejected" defaultValue>Rejected</option>
                           </select>
                              row.color = "#rrr"
                          }else{
                            row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRI")}>
                            <option value="pending">Pending</option>
                            <option value="progress">In progress</option>
                            <option value="materials" defaultValue>Materials</option>
                            <option value="ready">Ready</option>
                            <option value="rejected">Rejected</option>
                           </select>
                              row.color = "#bbb"
                          }

                          if(json.rows[i].priority === 0 || !json.rows[i].priority){
                            row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRI")} >
                            <option value="low" defaultValue>Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                          }else if(json.rows[i].priority === 1){
                            row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRI")}>
                            <option value="low">Low</option>
                            <option value="medium" defaultValue>Medium</option>
                            <option value="high">High</option>
                          </select>
                          }else if(json.rows[i].priority === 2){
                            row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRI")}>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high" defaultValue>High</option>
                            </select>
                          }
                          if(secureStorage.getItem("user") === json.rows[i].email){
                            row.observations = <ObservationsPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations} updateData={this.props.updateData} updateObservations={this.updateObservations.bind(this)}/>
                          } else {
                            row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                          }
                        }else{
                          row["admin"] = json.rows[i].admin

                          if(json.rows[i].priority === 0){
                            row.priority = "Low"
                          }else if(json.rows[i].priority === 1){
                              row.priority = "Medium"
                          }else if(json.rows[i].priority === 2){
                              row.priority = "High"
                          }

                          if(json.rows[i].status === 0){
                            row.status = "Pending"
                            row.color = "#www"
                          }else if(json.rows[i].status === 1){
                              row.status = "In progress"
                              row.color = "#yyy"
                          }else if(json.rows[i].status === 2){
                              row.status = "Ready"
                              row.color = "#ggg"
                          }else if(json.rows[i].status === 3){
                            row.status = "Rejected"
                            row.color = "#rrr"
                          }else{
                            row.status = "Materials"
                            row.color = "#bbb"
                          }

                          row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                        }

                        const today = moment()
                        const createdDate = moment(row.created_at)

                        if (!createdDate.add(2, 'weeks').isSameOrAfter(today) && !(json.rows[i].status === 2 || json.rows[i].status === 3)) {
                          row.color = "#ppp" 
                          if(this.props.currentUser === json.rows[i].email){
                            alertCount++
                          }
                        }
        
                        if(json.rows[i].status === 0 || json.rows[i].status === 1 || json.rows[i].status === 4){
                          pendingRows.push(row)
                        }

                    }
                  }
                    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getNRBByProjects/"+secureStorage.getItem("user"), options)
                    .then(response => response.json())
                    .then(async json => {
                    var row = null
                        if(json.rows){
                        for(let i = 0; i < json.rows.length; i++){
                          let carta = ""
                          if(json.rows[i].carta){
                            carta = " - " + json.rows[i].carta
                          }
                          if(json.rows[i].attach === 1){
                            if(json.rows[i].accept_reject_date != null){
                              row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNRISpecPopUp incidence_number={json.rows[i].incidence_number} pipe={json.rows[i].pipe} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19).toString().substring(0,10), key: json.rows[i].incidence_number}
                            }else{
                              row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNRISpecPopUp incidence_number={json.rows[i].incidence_number} pipe={json.rows[i].pipe} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: "", key: json.rows[i].incidence_number}
                            }
                          }else{
                            if(json.rows[i].accept_reject_date != null){
                              row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNRISpecPopUp incidence_number={json.rows[i].incidence_number} pipe={json.rows[i].pipe} description={json.rows[i].description}/>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                            }else{
                              row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNRISpecPopUp incidence_number={json.rows[i].incidence_number} pipe={json.rows[i].pipe} description={json.rows[i].description}/>, ar_date: "", key: json.rows[i].incidence_number}
                            }
                          }
                            if(secureStorage.getItem("role") === "3D Admin"){
                              row["hours"] = <input style={{width: "55px"}} type="text" defaultValue={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                              row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="NRB" changeAdmin = {this.changeAdmin.bind(this)}/>
                              if(json.rows[i].status === 0){
                                  row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRB")} >
                                  <option value="pending" defaultValue>Pending</option>
                                  <option value="progress">In progress</option>
                                  <option value="materials">Materials</option>
                                  <option value="ready">Ready</option>
                                  <option value="rejected">Rejected</option>
                                </select>
                                  row.color = "#www"
                              }else if(json.rows[i].status === 1){
                                row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRB")}>
                                <option value="pending">Pending</option>
                                <option value="progress" defaultValue style={{backgroundColor:"#yyy"}}>In progress</option>
                                <option value="materials">Materials</option>
                                <option value="ready">Ready</option>
                                <option value="rejected">Rejected</option>
                              </select>
                                  row.color = "#yyy"
                              }else if(json.rows[i].status === 2){
                                row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRB")}>
                                <option value="pending">Pending</option>
                                <option value="progress">In progress</option>
                                <option value="materials">Materials</option>
                                <option value="ready" defaultValue>Ready</option>
                                <option value="rejected">Rejected</option>
                                </select>
                                  row.color = "#ggg"
                              }else if(json.rows[i].status === 3){
                                row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRB")}>
                                <option value="pending">Pending</option>
                                <option value="progress">In progress</option>
                                <option value="materials">Materials</option>
                                <option value="ready">Ready</option>
                                <option value="rejected" defaultValue>Rejected</option>
                               </select>
                                  row.color = "#rrr"
                              }else{
                                row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRB")}>
                                <option value="pending">Pending</option>
                                <option value="progress">In progress</option>
                                <option value="materials" defaultValue>Materials</option>
                                <option value="ready">Ready</option>
                                <option value="rejected">Rejected</option>
                               </select>
                                  row.color = "#bbb"
                              }

                              if(json.rows[i].priority === 0 || !json.rows[i].priority){
                                row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRB")} >
                                <option value="low" defaultValue>Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                              </select>
                              }else if(json.rows[i].priority === 1){
                                row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRB")}>
                                <option value="low">Low</option>
                                <option value="medium" defaultValue>Medium</option>
                                <option value="high">High</option>
                              </select>
                              }else if(json.rows[i].priority === 2){
                                row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRB")}>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high" defaultValue>High</option>
                                </select>
                              }

                              if(secureStorage.getItem("user") === json.rows[i].email){
                                row.observations = <ObservationsPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations} updateData={this.props.updateData} updateObservations={this.updateObservations.bind(this)}/>
                              } else {
                                row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                              }

                            }else{
                              row["admin"] = json.rows[i].admin

                              if(json.rows[i].priority === 0){
                                row.priority = "Low"
                              }else if(json.rows[i].priority === 1){
                                  row.priority = "Medium"
                              }else if(json.rows[i].priority === 2){
                                  row.priority = "High"
                              }

                              if(json.rows[i].status === 0){
                                row.status = "Pending"
                                row.color = "#www"
                              }else if(json.rows[i].status === 1){
                                  row.status = "In progress"
                                  row.color = "#yyy"
                              }else if(json.rows[i].status === 2){
                                  row.status = "Ready"
                                  row.color = "#ggg"
                              }else if(json.rows[i].status === 3){
                                row.status = "Rejected"
                                row.color = "#rrr"
                              }else{
                                row.status = "Materials"
                                row.color = "#bbb"
                              }

                              row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                            }

                            const today = moment()
                            const createdDate = moment(row.created_at)

                            if (!createdDate.add(2, 'weeks').isSameOrAfter(today) && !(json.rows[i].status === 2 || json.rows[i].status === 3)) {
                              row.color = "#ppp" 
                              if(this.props.currentUser === json.rows[i].email){
                                alertCount++
                              }
                            }
            
                            if(json.rows[i].status === 0 || json.rows[i].status === 1 || json.rows[i].status === 4){
                              pendingRows.push(row)
                            }

                        }
                      }
                        
                        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getNRIDSByProjects/"+secureStorage.getItem("user"), options)
                        .then(response => response.json())
                        .then(async json => {
                        var row = null
                            if(json.rows){
                            for(let i = 0; i < json.rows.length; i++){
                              let carta = ""
                              if(json.rows[i].carta){
                                carta = " - " + json.rows[i].carta
                              }
                              if(json.rows[i].accept_reject_date != null){
                                row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: "", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNRIDSSpecPopUp incidence_number={json.rows[i].incidence_number} name={json.rows[i].name}/>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                              }else{
                                row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: "", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNRIDSSpecPopUp incidence_number={json.rows[i].incidence_number} name={json.rows[i].name}/>, ar_date: "", key: json.rows[i].incidence_number}
                              }
                                if(secureStorage.getItem("role") === "3D Admin"){
                                  row["hours"] = <input style={{width: "55px"}} type="text" defaultValue={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                                  row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="NRIDS" changeAdmin = {this.changeAdmin.bind(this)}/>
                                  if(json.rows[i].status === 0){
                                      row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRIDS")} >
                                      <option value="pending" defaultValue>Pending</option>
                                      <option value="progress">In progress</option>
                                      <option value="materials">Materials</option>
                                      <option value="ready">Ready</option>
                                      <option value="rejected">Rejected</option>
                                    </select>
                                      row.color = "#www"
                                  }else if(json.rows[i].status === 1){
                                    row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRIDS")}>
                                    <option value="pending">Pending</option>
                                    <option value="progress" defaultValue style={{backgroundColor:"#yyy"}}>In progress</option>
                                    <option value="materials">Materials</option>
                                    <option value="ready">Ready</option>
                                    <option value="rejected">Rejected</option>
                                  </select>
                                      row.color = "#yyy"
                                  }else if(json.rows[i].status === 2){
                                    row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRIDS")}>
                                    <option value="pending">Pending</option>
                                    <option value="progress">In progress</option>
                                    <option value="materials">Materials</option>
                                    <option value="ready" defaultValue>Ready</option>
                                    <option value="rejected">Rejected</option>
                                    </select>
                                      row.color = "#ggg"
                                  }else if(json.rows[i].status === 3){
                                    row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRIDS")}>
                                    <option value="pending">Pending</option>
                                    <option value="progress">In progress</option>
                                    <option value="materials">Materials</option>
                                    <option value="ready">Ready</option>
                                    <option value="rejected" defaultValue>Rejected</option>
                                   </select>
                                      row.color = "#rrr"
                                  }else{
                                    row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRIDS")}>
                                    <option value="pending">Pending</option>
                                    <option value="progress">In progress</option>
                                    <option value="materials" defaultValue>Materials</option>
                                    <option value="ready">Ready</option>
                                    <option value="rejected">Rejected</option>
                                   </select>
                                      row.color = "#bbb"
                                  }

                                  if(json.rows[i].priority === 0 || !json.rows[i].priority){
                                    row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRIDS")} >
                                    <option value="low" defaultValue>Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                  </select>
                                  }else if(json.rows[i].priority === 1){
                                    row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRIDS")}>
                                    <option value="low">Low</option>
                                    <option value="medium" defaultValue>Medium</option>
                                    <option value="high">High</option>
                                  </select>
                                  }else if(json.rows[i].priority === 2){
                                    row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRIDS")}>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high" defaultValue>High</option>
                                    </select>
                                  }

                                  if(secureStorage.getItem("user") === json.rows[i].email){
                                    row.observations = <ObservationsPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations} updateData={this.props.updateData} updateObservations={this.updateObservations.bind(this)}/>
                                  } else {
                                    row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                                  }

                                }else{
                                  row["admin"] = json.rows[i].admin

                                  if(json.rows[i].priority === 0){
                                    row.priority = "Low"
                                  }else if(json.rows[i].priority === 1){
                                      row.priority = "Medium"
                                  }else if(json.rows[i].priority === 2){
                                      row.priority = "High"
                                  }

                                  if(json.rows[i].status === 0){
                                    row.status = "Pending"
                                    row.color = "#www"
                                  }else if(json.rows[i].status === 1){
                                      row.status = "In progress"
                                      row.color = "#yyy"
                                  }else if(json.rows[i].status === 2){
                                      row.status = "Ready"
                                      row.color = "#ggg"
                                  }else if(json.rows[i].status === 3){
                                      row.status = "Rejected"
                                      row.color = "#rrr"
                                  }else{
                                    row.status = "Materials"
                                    row.color = "#bbb"
                                  }
                                  row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                                }

                                const today = moment()
                                const createdDate = moment(row.created_at)

                                if (!createdDate.add(2, 'weeks').isSameOrAfter(today) && !(json.rows[i].status === 2 || json.rows[i].status === 3)) {
                                  row.color = "#ppp" 
                                  if(this.props.currentUser === json.rows[i].email){
                                    alertCount++
                                  }
                                }
                
                                if(json.rows[i].status === 0 || json.rows[i].status === 1 || json.rows[i].status === 4){
                                  pendingRows.push(row)
                                }
    
                            }
                          }
                            await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getRPByProjects/"+secureStorage.getItem("user"), options)
                            .then(response => response.json())
                            .then(async json => {
                            var row = null
                                if(json.rows){
                                for(let i = 0; i < json.rows.length; i++){
                                  let carta = ""
                                  if(json.rows[i].carta){
                                    carta = " - " + json.rows[i].carta
                                  }
                                  if(json.rows[i].accept_reject_date != null){
                                    row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerRPSpecPopUp incidence_number={json.rows[i].incidence_number} items={json.rows[i].items_to_report} scope={json.rows[i].scope} description={json.rows[i].description}/>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                                  }else{
                                    row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...".substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerRPSpecPopUp incidence_number={json.rows[i].incidence_number} items={json.rows[i].items_to_report} scope={json.rows[i].scope} description={json.rows[i].description}/>, ar_date: "", key: json.rows[i].incidence_number}
                                  }
                                    if(secureStorage.getItem("role") === "3D Admin"){
                                      row["hours"] = <input style={{width: "55px"}} type="text" defaultValue={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                                      row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="RP" changeAdmin = {this.changeAdmin.bind(this)}/>
                                      if(json.rows[i].status === 0){
                                          row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "RP")} >
                                          <option value="pending" defaultValue>Pending</option>
                                          <option value="progress">In progress</option>
                                          <option value="materials">Materials</option>
                                          <option value="ready">Ready</option>
                                          <option value="rejected">Rejected</option>
                                        </select>
                                          row.color = "#www"
                                      }else if(json.rows[i].status === 1){
                                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "RP")}>
                                        <option value="pending">Pending</option>
                                        <option value="progress" defaultValue style={{backgroundColor:"#yyy"}}>In progress</option>
                                        <option value="materials">Materials</option>
                                        <option value="ready">Ready</option>
                                        <option value="rejected">Rejected</option>
                                      </select>
                                          row.color = "#yyy"
                                      }else if(json.rows[i].status === 2){
                                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "RP")}>
                                        <option value="pending">Pending</option>
                                        <option value="progress">In progress</option>
                                        <option value="materials">Materials</option>
                                        <option value="ready" defaultValue>Ready</option>
                                        <option value="rejected">Rejected</option>
                                        </select>
                                          row.color = "#ggg"
                                      }else if(json.rows[i].status === 3){
                                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "RP")}>
                                        <option value="pending">Pending</option>
                                        <option value="progress">In progress</option>
                                        <option value="materials">Materials</option>
                                        <option value="ready">Ready</option>
                                        <option value="rejected" defaultValue>Rejected</option>
                                       </select>
                                          row.color = "#rrr"
                                      }else{
                                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "RP")}>
                                        <option value="pending">Pending</option>
                                        <option value="progress">In progress</option>
                                        <option value="materials" defaultValue>Materials</option>
                                        <option value="ready">Ready</option>
                                        <option value="rejected">Rejected</option>
                                       </select>
                                          row.color = "#bbb"
                                      }

                                      if(json.rows[i].priority === 0 || !json.rows[i].priority){
                                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "RP")} >
                                        <option value="low" defaultValue>Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                      </select>
                                      }else if(json.rows[i].priority === 1){
                                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "RP")}>
                                        <option value="low">Low</option>
                                        <option value="medium" defaultValue>Medium</option>
                                        <option value="high">High</option>
                                      </select>
                                      }else if(json.rows[i].priority === 2){
                                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "RP")}>
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high" defaultValue>High</option>
                                        </select>
                                      }

                                      if(secureStorage.getItem("user") === json.rows[i].email){
                                        row.observations = <ObservationsPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations} updateData={this.props.updateData} updateObservations={this.updateObservations.bind(this)}/>
                                      } else {
                                        row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                                      }

                                    }else{
                                      row["admin"] = json.rows[i].admin

                                      if(json.rows[i].priority === 0){
                                        row.priority = "Low"
                                      }else if(json.rows[i].priority === 1){
                                          row.priority = "Medium"
                                      }else if(json.rows[i].priority === 2){
                                          row.priority = "High"
                                      }

                                      if(json.rows[i].status === 0){
                                        row.status = "Pending"
                                        row.color = "#www"
                                      }else if(json.rows[i].status === 1){
                                          row.status = "In progress"
                                          row.color = "#yyy"
                                      }else if(json.rows[i].status === 2){
                                          row.status = "Ready"
                                          row.color = "#ggg"
                                      }else if(json.rows[i].status === 3){
                                          row.status = "Rejected"
                                          row.color = "#rrr"
                                      }else{
                                          row.status = "Materials"
                                          row.color = "#bbb"
                                      }
                                      row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                                    }

                                    const today = moment()
                                    const createdDate = moment(row.created_at)

                                    if (!createdDate.add(2, 'weeks').isSameOrAfter(today) && !(json.rows[i].status === 2 || json.rows[i].status === 3)) {
                                      row.color = "#ppp" 
                                      if(this.props.currentUser === json.rows[i].email){
                                        alertCount++
                                      }
                                    }
                    
                                    if(json.rows[i].status === 0 || json.rows[i].status === 1 || json.rows[i].status === 4){
                                      pendingRows.push(row)
                                    }
        
                                }
                              }
                              await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getISByProjects/"+secureStorage.getItem("user"), options)
                            .then(response => response.json())
                            .then(async json => {
                            var row = null
                                if(json.rows){
                                for(let i = 0; i < json.rows.length; i++){
                                  let carta = ""
                                  if(json.rows[i].carta){
                                    carta = " - " + json.rows[i].carta
                                  }
                                  if(json.rows[i].accept_reject_date != null){
                                    row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerISSpecPopUp incidence_number={json.rows[i].incidence_number} sending={json.rows[i].sending} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                                  }else{
                                    row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerISSpecPopUp incidence_number={json.rows[i].incidence_number} sending={json.rows[i].sending} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: "", key: json.rows[i].incidence_number}
                                  }
                                    if(secureStorage.getItem("role") === "3D Admin"){
                                      row["hours"] = <input style={{width: "55px"}} type="text" defaultValue={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                                      row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="IS" changeAdmin = {this.changeAdmin.bind(this)}/>
                                      if(json.rows[i].status === 0){
                                          row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "IS")} >
                                          <option value="pending" defaultValue>Pending</option>
                                          <option value="progress">In progress</option>
                                          <option value="materials">Materials</option>
                                          <option value="ready">Ready</option>
                                          <option value="rejected">Rejected</option>
                                        </select>
                                          row.color = "#www"
                                      }else if(json.rows[i].status === 1){
                                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "IS")}>
                                        <option value="pending">Pending</option>
                                        <option value="progress" defaultValue style={{backgroundColor:"#yyy"}}>In progress</option>
                                        <option value="materials">Materials</option>
                                        <option value="ready">Ready</option>
                                        <option value="rejected">Rejected</option>
                                      </select>
                                          row.color = "#yyy"
                                      }else if(json.rows[i].status === 2){
                                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "IS")}>
                                        <option value="pending">Pending</option>
                                        <option value="progress">In progress</option>
                                        <option value="materials">Materials</option>
                                        <option value="ready" defaultValue>Ready</option>
                                        <option value="rejected">Rejected</option>
                                        </select>
                                          row.color = "#ggg"
                                      }else if(json.rows[i].status === 3){
                                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "IS")}>
                                        <option value="pending">Pending</option>
                                        <option value="progress">In progress</option>
                                        <option value="materials">Materials</option>
                                        <option value="ready">Ready</option>
                                        <option value="rejected" defaultValue>Rejected</option>
                                       </select>
                                          row.color = "#rrr"
                                      }else{
                                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "IS")}>
                                        <option value="pending">Pending</option>
                                        <option value="progress">In progress</option>
                                        <option value="materials" defaultValue>Materials</option>
                                        <option value="ready">Ready</option>
                                        <option value="rejected">Rejected</option>
                                       </select>
                                          row.color = "#bbb"
                                      }

                                      if(json.rows[i].priority === 0 || !json.rows[i].priority){
                                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "IS")} >
                                        <option value="low" defaultValue>Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                      </select>
                                      }else if(json.rows[i].priority === 1){
                                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "IS")}>
                                        <option value="low">Low</option>
                                        <option value="medium" defaultValue>Medium</option>
                                        <option value="high">High</option>
                                      </select>
                                      }else if(json.rows[i].priority === 2){
                                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "IS")}>
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high" defaultValue>High</option>
                                        </select>
                                      }

                                      if(secureStorage.getItem("user") === json.rows[i].email){
                                        row.observations = <ObservationsPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations} updateData={this.props.updateData} updateObservations={this.updateObservations.bind(this)}/>
                                      } else {
                                        row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                                      }

                                    }else{
                                      row["admin"] = json.rows[i].admin

                                      if(json.rows[i].priority === 0){
                                        row.priority = "Low"
                                      }else if(json.rows[i].priority === 1){
                                          row.priority = "Medium"
                                      }else if(json.rows[i].priority === 2){
                                          row.priority = "High"
                                      }

                                      if(json.rows[i].status === 0){
                                        row.status = "Pending"
                                        row.color = "#www"
                                      }else if(json.rows[i].status === 1){
                                          row.status = "In progress"
                                          row.color = "#yyy"
                                      }else if(json.rows[i].status === 2){
                                          row.status = "Ready"
                                          row.color = "#ggg"
                                      }else if(json.rows[i].status === 3){
                                          row.status = "Rejected"
                                          row.color = "#rrr"
                                      }else{
                                        row.status = "Materials"
                                        row.color = "#bbb"
                                      }
                                      row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                                    }

                                    const today = moment()
                                    const createdDate = moment(row.created_at)

                                    if (!createdDate.add(2, 'weeks').isSameOrAfter(today) && !(json.rows[i].status === 2 || json.rows[i].status === 3)) {
                                      row.color = "#ppp" 
                                      if(this.props.currentUser === json.rows[i].email){
                                        alertCount++
                                      }
                                    }
                    
                                    if(json.rows[i].status === 0 || json.rows[i].status === 1 || json.rows[i].status === 4){
                                      pendingRows.push(row)
                                    }
        
                                }
                              }
                              
                              await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getDISByProjects/"+secureStorage.getItem("user"), options)
                              .then(response => response.json())
                              .then(async json => {
                              var row = null
                                if(json.rows){
                                  for(let i = 0; i < json.rows.length; i++){
                                    
                                    let carta = ""
                                    if(json.rows[i].carta){
                                      carta = " - " + json.rows[i].carta
                                    }
                                    if(json.rows[i].attach === 1){
                                      if(json.rows[i].accept_reject_date != null){
                                        row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19).toString().substring(0,10), key: json.rows[i].incidence_number}
                                      }else{
                                        row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: "", key: json.rows[i].incidence_number}
                                      }
                                    }else{
                                      if(json.rows[i].accept_reject_date != null){
                                        row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                                      }else{
                                        row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: "", key: json.rows[i].incidence_number}
                                      }
                                    }
                                      if(secureStorage.getItem("role") === "3D Admin"){
                                        row["hours"] = <input style={{width: "55px"}} type="text" defaultValue={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                                        row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="DIS" changeAdmin = {this.changeAdmin.bind(this)}/>
                                        if(json.rows[i].status === 0){
                                            row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DIS")} >
                                            <option value="pending" defaultValue>Pending</option>
                                            <option value="progress">In progress</option>
                                            <option value="materials">Materials</option>
                                            <option value="ready">Ready</option>
                                            <option value="rejected">Rejected</option>
                                          </select>
                                            row.color = "#www"
                                        }else if(json.rows[i].status === 1){
                                          row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DIS")}>
                                          <option value="pending">Pending</option>
                                          <option value="progress" defaultValue style={{backgroundColor:"#yyy"}}>In progress</option>
                                          <option value="materials">Materials</option>
                                          <option value="ready">Ready</option>
                                          <option value="rejected">Rejected</option>
                                        </select>
                                            row.color = "#yyy"
                                        }else if(json.rows[i].status === 2){
                                          row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DIS")}>
                                          <option value="pending">Pending</option>
                                          <option value="progress">In progress</option>
                                          <option value="materials">Materials</option>
                                          <option value="ready" defaultValue>Ready</option>
                                          <option value="rejected">Rejected</option>
                                          </select>
                                            row.color = "#ggg"
                                        }else if(json.rows[i].status === 3){
                                            row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DIS")}>
                                          <option value="pending">Pending</option>
                                          <option value="progress">In progress</option>
                                          <option value="materials">Materials</option>
                                          <option value="ready">Ready</option>
                                          <option value="rejected" defaultValue>Rejected</option>
                                        </select>
                                            row.color = "#rrr"
                                        }else{
                                          row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DIS")}>
                                          <option value="pending">Pending</option>
                                          <option value="progress">In progress</option>
                                          <option value="materials" defaultValue>Materials</option>
                                          <option value="ready">Ready</option>
                                          <option value="rejected">Rejected</option>
                                        </select>
                                            row.color = "#bbb"
                                        }
                                        if(json.rows[i].priority === 0 || !json.rows[i].priority){
                                          row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DIS")} >
                                          <option value="low" defaultValue>Low</option>
                                          <option value="medium">Medium</option>
                                          <option value="high">High</option>
                                        </select>
                                        }else if(json.rows[i].priority === 1){
                                          row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DIS")}>
                                          <option value="low">Low</option>
                                          <option value="medium" defaultValue>Medium</option>
                                          <option value="high">High</option>
                                        </select>
                                        }else if(json.rows[i].priority === 2){
                                          row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DIS")}>
                                          <option value="low">Low</option>
                                          <option value="medium">Medium</option>
                                          <option value="high" defaultValue>High</option>
                                          </select>
                                        }

                                        if(secureStorage.getItem("user") === json.rows[i].email){
                                          row.observations = <ObservationsPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations} updateData={this.props.updateData} updateObservations={this.updateObservations.bind(this)}/>
                                        } else {
                                          row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                                        }

                                      }else{
                                        row["admin"] = json.rows[i].admin

                                        if(json.rows[i].priority === 0){
                                          row.priority = "Low"
                                        }else if(json.rows[i].priority === 1){
                                            row.priority = "Medium"
                                        }else if(json.rows[i].priority === 2){
                                            row.priority = "High"
                                        }

                                        if(json.rows[i].status === 0){
                                          row.status = "Pending"
                                          row.color = "#www"
                                        }else if(json.rows[i].status === 1){
                                            row.status = "In progress"
                                            row.color = "#yyy"
                                        }else if(json.rows[i].status === 2){
                                            row.status = "Ready"
                                            row.color = "#ggg"
                                        }else if(json.rows[i].status === 3){
                                          row.status = "Rejected"
                                          row.color = "#rrr"
                                        }else{
                                          row.status = "Materials"
                                          row.color = "#bbb"
                                        }

                                        row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                                      }

                                      const today = moment()
                                      const createdDate = moment(row.created_at)

                                      if (!createdDate.add(2, 'weeks').isSameOrAfter(today) && !(json.rows[i].status === 2 || json.rows[i].status === 3)) {
                                        row.color = "#ppp" 
                                        if(this.props.currentUser === json.rows[i].email){
                                          alertCount++
                                        }
                                      }
                      
                                      if(json.rows[i].status === 0 || json.rows[i].status === 1 || json.rows[i].status === 4){
                                        pendingRows.push(row)
                                      }
          
                                  }
                                }

                                  /* Modeling */
                                  await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getMODByProjects/"+secureStorage.getItem("user"), options)
                                  .then(response => response.json())
                                  .then(async json => {
                                  var row = null
                                    if(json.rows){
                                      for(let i = 0; i < json.rows.length; i++){
                                        
                                        let carta = ""
                                        if(json.rows[i].carta){
                                          carta = " - " + json.rows[i].carta
                                        }
                                        if(json.rows[i].attach === 1){
                                          if(json.rows[i].accept_reject_date != null){
                                            row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19).toString().substring(0,10), key: json.rows[i].incidence_number}
                                          }else{
                                            row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: "", key: json.rows[i].incidence_number}
                                          }
                                        }else{
                                          if(json.rows[i].accept_reject_date != null){
                                            row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                                          }else{
                                            row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: "", key: json.rows[i].incidence_number}
                                          }
                                        }
                                          if(secureStorage.getItem("role") === "3D Admin"){
                                            row["hours"] = <input style={{width: "55px"}} type="text" defaultValue={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                                            row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="MOD" changeAdmin = {this.changeAdmin.bind(this)}/>
                                            if(json.rows[i].status === 0){
                                                row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "MOD")} >
                                                <option value="pending" defaultValue>Pending</option>
                                                <option value="progress">In progress</option>
                                                <option value="materials">Materials</option>
                                                <option value="ready">Ready</option>
                                                <option value="rejected">Rejected</option>
                                              </select>
                                                row.color = "#www"
                                            }else if(json.rows[i].status === 1){
                                              row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "MOD")}>
                                              <option value="pending">Pending</option>
                                              <option value="progress" defaultValue style={{backgroundColor:"#yyy"}}>In progress</option>
                                              <option value="materials">Materials</option>
                                              <option value="ready">Ready</option>
                                              <option value="rejected">Rejected</option>
                                            </select>
                                                row.color = "#yyy"
                                            }else if(json.rows[i].status === 2){
                                              row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "MOD")}>
                                              <option value="pending">Pending</option>
                                              <option value="progress">In progress</option>
                                              <option value="materials">Materials</option>
                                              <option value="ready" defaultValue>Ready</option>
                                              <option value="rejected">Rejected</option>
                                              </select>
                                                row.color = "#ggg"
                                            }else if(json.rows[i].status === 3){
                                                row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "MOD")}>
                                              <option value="pending">Pending</option>
                                              <option value="progress">In progress</option>
                                              <option value="materials">Materials</option>
                                              <option value="ready">Ready</option>
                                              <option value="rejected" defaultValue>Rejected</option>
                                            </select>
                                                row.color = "#rrr"
                                            }else{
                                              row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "MOD")}>
                                              <option value="pending">Pending</option>
                                              <option value="progress">In progress</option>
                                              <option value="materials" defaultValue>Materials</option>
                                              <option value="ready">Ready</option>
                                              <option value="rejected">Rejected</option>
                                            </select>
                                                row.color = "#bbb"
                                            }
                                            if(json.rows[i].priority === 0 || !json.rows[i].priority){
                                              row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "MOD")} >
                                              <option value="low" defaultValue>Low</option>
                                              <option value="medium">Medium</option>
                                              <option value="high">High</option>
                                            </select>
                                            }else if(json.rows[i].priority === 1){
                                              row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "MOD")}>
                                              <option value="low">Low</option>
                                              <option value="medium" defaultValue>Medium</option>
                                              <option value="high">High</option>
                                            </select>
                                            }else if(json.rows[i].priority === 2){
                                              row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "MOD")}>
                                              <option value="low">Low</option>
                                              <option value="medium">Medium</option>
                                              <option value="high" defaultValue>High</option>
                                              </select>
                                            }

                                            if(secureStorage.getItem("user") === json.rows[i].email){
                                              row.observations = <ObservationsPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations} updateData={this.props.updateData} updateObservations={this.updateObservations.bind(this)}/>
                                            } else {
                                              row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                                            }

                                          }else{
                                            row["admin"] = json.rows[i].admin

                                            if(json.rows[i].priority === 0){
                                              row.priority = "Low"
                                            }else if(json.rows[i].priority === 1){
                                                row.priority = "Medium"
                                            }else if(json.rows[i].priority === 2){
                                                row.priority = "High"
                                            }

                                            if(json.rows[i].status === 0){
                                              row.status = "Pending"
                                              row.color = "#www"
                                            }else if(json.rows[i].status === 1){
                                                row.status = "In progress"
                                                row.color = "#yyy"
                                            }else if(json.rows[i].status === 2){
                                                row.status = "Ready"
                                                row.color = "#ggg"
                                            }else if(json.rows[i].status === 3){
                                              row.status = "Rejected"
                                              row.color = "#rrr"
                                            }else{
                                              row.status = "Materials"
                                              row.color = "#bbb"
                                            }

                                            row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                                          }

                                          const today = moment()
                                          const createdDate = moment(row.created_at)

                                          if (!createdDate.add(2, 'weeks').isSameOrAfter(today) && !(json.rows[i].status === 2 || json.rows[i].status === 3)) {
                                            row.color = "#ppp" 
                                            if(this.props.currentUser === json.rows[i].email){
                                              alertCount++
                                            }
                                          }
                          
                                          if(json.rows[i].status === 0 || json.rows[i].status === 1 || json.rows[i].status === 4){
                                            pendingRows.push(row)
                                          }
              
                                      }
                                    }

                                    /* Permission */
                                    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getPERByProjects/"+secureStorage.getItem("user"), options)
                                    .then(response => response.json())
                                    .then(async json => {
                                    var row = null
                                      if(json.rows){
                                        for(let i = 0; i < json.rows.length; i++){
                                          
                                          let carta = ""
                                          if(json.rows[i].carta){
                                            carta = " - " + json.rows[i].carta
                                          }
                                          if(json.rows[i].attach === 1){
                                            if(json.rows[i].accept_reject_date != null){
                                              row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19).toString().substring(0,10), key: json.rows[i].incidence_number}
                                            }else{
                                              row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: "", key: json.rows[i].incidence_number}
                                            }
                                          }else{
                                            if(json.rows[i].accept_reject_date != null){
                                              row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                                            }else{
                                              row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: "", key: json.rows[i].incidence_number}
                                            }
                                          }
                                            if(secureStorage.getItem("role") === "3D Admin"){
                                              row["hours"] = <input style={{width: "55px"}} type="text" defaultValue={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                                              row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="PER" changeAdmin = {this.changeAdmin.bind(this)}/>
                                              if(json.rows[i].status === 0){
                                                  row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "PER")} >
                                                  <option value="pending" defaultValue>Pending</option>
                                                  <option value="progress">In progress</option>
                                                  <option value="materials">Materials</option>
                                                  <option value="ready">Ready</option>
                                                  <option value="rejected">Rejected</option>
                                                </select>
                                                  row.color = "#www"
                                              }else if(json.rows[i].status === 1){
                                                row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "PER")}>
                                                <option value="pending">Pending</option>
                                                <option value="progress" defaultValue style={{backgroundColor:"#yyy"}}>In progress</option>
                                                <option value="materials">Materials</option>
                                                <option value="ready">Ready</option>
                                                <option value="rejected">Rejected</option>
                                              </select>
                                                  row.color = "#yyy"
                                              }else if(json.rows[i].status === 2){
                                                row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "PER")}>
                                                <option value="pending">Pending</option>
                                                <option value="progress">In progress</option>
                                                <option value="materials">Materials</option>
                                                <option value="ready" defaultValue>Ready</option>
                                                <option value="rejected">Rejected</option>
                                                </select>
                                                  row.color = "#ggg"
                                              }else if(json.rows[i].status === 3){
                                                  row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "PER")}>
                                                <option value="pending">Pending</option>
                                                <option value="progress">In progress</option>
                                                <option value="materials">Materials</option>
                                                <option value="ready">Ready</option>
                                                <option value="rejected" defaultValue>Rejected</option>
                                              </select>
                                                  row.color = "#rrr"
                                              }else{
                                                row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "PER")}>
                                                <option value="pending">Pending</option>
                                                <option value="progress">In progress</option>
                                                <option value="materials" defaultValue>Materials</option>
                                                <option value="ready">Ready</option>
                                                <option value="rejected">Rejected</option>
                                              </select>
                                                  row.color = "#bbb"
                                              }
                                              if(json.rows[i].priority === 0 || !json.rows[i].priority){
                                                row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "PER")} >
                                                <option value="low" defaultValue>Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                              </select>
                                              }else if(json.rows[i].priority === 1){
                                                row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "PER")}>
                                                <option value="low">Low</option>
                                                <option value="medium" defaultValue>Medium</option>
                                                <option value="high">High</option>
                                              </select>
                                              }else if(json.rows[i].priority === 2){
                                                row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "PER")}>
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high" defaultValue>High</option>
                                                </select>
                                              }

                                              if(secureStorage.getItem("user") === json.rows[i].email){
                                                row.observations = <ObservationsPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations} updateData={this.props.updateData} updateObservations={this.updateObservations.bind(this)}/>
                                              } else {
                                                row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                                              }

                                            }else{
                                              row["admin"] = json.rows[i].admin

                                              if(json.rows[i].priority === 0){
                                                row.priority = "Low"
                                              }else if(json.rows[i].priority === 1){
                                                  row.priority = "Medium"
                                              }else if(json.rows[i].priority === 2){
                                                  row.priority = "High"
                                              }

                                              if(json.rows[i].status === 0){
                                                row.status = "Pending"
                                                row.color = "#www"
                                              }else if(json.rows[i].status === 1){
                                                  row.status = "In progress"
                                                  row.color = "#yyy"
                                              }else if(json.rows[i].status === 2){
                                                  row.status = "Ready"
                                                  row.color = "#ggg"
                                              }else if(json.rows[i].status === 3){
                                                row.status = "Rejected"
                                                row.color = "#rrr"
                                              }else{
                                                row.status = "Materials"
                                                row.color = "#bbb"
                                              }

                                              row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                                            }

                                            const today = moment()
                                            const createdDate = moment(row.created_at)

                                            if (!createdDate.add(2, 'weeks').isSameOrAfter(today) && !(json.rows[i].status === 2 || json.rows[i].status === 3)) {
                                              row.color = "#ppp" 
                                              if(this.props.currentUser === json.rows[i].email){
                                                alertCount++
                                              }
                                            }
                            
                                            if(json.rows[i].status === 0 || json.rows[i].status === 1 || json.rows[i].status === 4){
                                              pendingRows.push(row)
                                            }
                
                                        }
                                      }

                                      /* Isometric Drawing */
                                      await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getDSOByProjects/"+secureStorage.getItem("user"), options)
                                      .then(response => response.json())
                                      .then(async json => {
                                      var row = null
                                        if(json.rows){
                                          for(let i = 0; i < json.rows.length; i++){
                                            
                                            let carta = ""
                                            if(json.rows[i].carta){
                                              carta = " - " + json.rows[i].carta
                                            }
                                            if(json.rows[i].attach === 1){
                                              if(json.rows[i].accept_reject_date != null){
                                                row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19).toString().substring(0,10), key: json.rows[i].incidence_number}
                                              }else{
                                                row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: "", key: json.rows[i].incidence_number}
                                              }
                                            }else{
                                              if(json.rows[i].accept_reject_date != null){
                                                row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                                              }else{
                                                row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: "", key: json.rows[i].incidence_number}
                                              }
                                            }
                                              if(secureStorage.getItem("role") === "3D Admin"){
                                                row["hours"] = <input style={{width: "55px"}} type="text" defaultValue={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                                                row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="DSO" changeAdmin = {this.changeAdmin.bind(this)}/>
                                                if(json.rows[i].status === 0){
                                                    row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DSO")} >
                                                    <option value="pending" defaultValue>Pending</option>
                                                    <option value="progress">In progress</option>
                                                    <option value="materials">Materials</option>
                                                    <option value="ready">Ready</option>
                                                    <option value="rejected">Rejected</option>
                                                  </select>
                                                    row.color = "#www"
                                                }else if(json.rows[i].status === 1){
                                                  row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DSO")}>
                                                  <option value="pending">Pending</option>
                                                  <option value="progress" defaultValue style={{backgroundColor:"#yyy"}}>In progress</option>
                                                  <option value="materials">Materials</option>
                                                  <option value="ready">Ready</option>
                                                  <option value="rejected">Rejected</option>
                                                </select>
                                                    row.color = "#yyy"
                                                }else if(json.rows[i].status === 2){
                                                  row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DSO")}>
                                                  <option value="pending">Pending</option>
                                                  <option value="progress">In progress</option>
                                                  <option value="materials">Materials</option>
                                                  <option value="ready" defaultValue>Ready</option>
                                                  <option value="rejected">Rejected</option>
                                                  </select>
                                                    row.color = "#ggg"
                                                }else if(json.rows[i].status === 3){
                                                    row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DSO")}>
                                                  <option value="pending">Pending</option>
                                                  <option value="progress">In progress</option>
                                                  <option value="materials">Materials</option>
                                                  <option value="ready">Ready</option>
                                                  <option value="rejected" defaultValue>Rejected</option>
                                                </select>
                                                    row.color = "#rrr"
                                                }else{
                                                  row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DSO")}>
                                                  <option value="pending">Pending</option>
                                                  <option value="progress">In progress</option>
                                                  <option value="materials" defaultValue>Materials</option>
                                                  <option value="ready">Ready</option>
                                                  <option value="rejected">Rejected</option>
                                                </select>
                                                    row.color = "#bbb"
                                                }
                                                if(json.rows[i].priority === 0 || !json.rows[i].priority){
                                                  row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DSO")} >
                                                  <option value="low" defaultValue>Low</option>
                                                  <option value="medium">Medium</option>
                                                  <option value="high">High</option>
                                                </select>
                                                }else if(json.rows[i].priority === 1){
                                                  row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DSO")}>
                                                  <option value="low">Low</option>
                                                  <option value="medium" defaultValue>Medium</option>
                                                  <option value="high">High</option>
                                                </select>
                                                }else if(json.rows[i].priority === 2){
                                                  row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DSO")}>
                                                  <option value="low">Low</option>
                                                  <option value="medium">Medium</option>
                                                  <option value="high" defaultValue>High</option>
                                                  </select>
                                                }

                                                if(secureStorage.getItem("user") === json.rows[i].email){
                                                  row.observations = <ObservationsPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations} updateData={this.props.updateData} updateObservations={this.updateObservations.bind(this)}/>
                                                } else {
                                                  row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                                                }

                                              }else{
                                                row["admin"] = json.rows[i].admin

                                                if(json.rows[i].priority === 0){
                                                  row.priority = "Low"
                                                }else if(json.rows[i].priority === 1){
                                                    row.priority = "Medium"
                                                }else if(json.rows[i].priority === 2){
                                                    row.priority = "High"
                                                }

                                                if(json.rows[i].status === 0){
                                                  row.status = "Pending"
                                                  row.color = "#www"
                                                }else if(json.rows[i].status === 1){
                                                    row.status = "In progress"
                                                    row.color = "#yyy"
                                                }else if(json.rows[i].status === 2){
                                                    row.status = "Ready"
                                                    row.color = "#ggg"
                                                }else if(json.rows[i].status === 3){
                                                  row.status = "Rejected"
                                                  row.color = "#rrr"
                                                }else{
                                                  row.status = "Materials"
                                                  row.color = "#bbb"
                                                }

                                                row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                                              }

                                              const today = moment()
                                              const createdDate = moment(row.created_at)

                                              if (!createdDate.add(2, 'weeks').isSameOrAfter(today) && !(json.rows[i].status === 2 || json.rows[i].status === 3)) {
                                                row.color = "#ppp" 
                                                if(this.props.currentUser === json.rows[i].email){
                                                  alertCount++
                                                }
                                              }
                              
                                              if(json.rows[i].status === 0 || json.rows[i].status === 1 || json.rows[i].status === 4){
                                                pendingRows.push(row)
                                              }
                  
                                          }
                                        }

                                          /* Ortographic Drawing */
                                          await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getDORByProjects/"+secureStorage.getItem("user"), options)
                                          .then(response => response.json())
                                          .then(async json => {
                                          var row = null
                                            if(json.rows){
                                              for(let i = 0; i < json.rows.length; i++){
                                                
                                                let carta = ""
                                                if(json.rows[i].carta){
                                                  carta = " - " + json.rows[i].carta
                                                }
                                                if(json.rows[i].attach === 1){
                                                  if(json.rows[i].accept_reject_date != null){
                                                    row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19).toString().substring(0,10), key: json.rows[i].incidence_number}
                                                  }else{
                                                    row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: "", key: json.rows[i].incidence_number}
                                                  }
                                                }else{
                                                  if(json.rows[i].accept_reject_date != null){
                                                    row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                                                  }else{
                                                    row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: "", key: json.rows[i].incidence_number}
                                                  }
                                                }
                                                  if(secureStorage.getItem("role") === "3D Admin"){
                                                    row["hours"] = <input style={{width: "55px"}} type="text" defaultValue={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                                                    row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="DOR" changeAdmin = {this.changeAdmin.bind(this)}/>
                                                    if(json.rows[i].status === 0){
                                                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DOR")} >
                                                        <option value="pending" defaultValue>Pending</option>
                                                        <option value="progress">In progress</option>
                                                        <option value="materials">Materials</option>
                                                        <option value="ready">Ready</option>
                                                        <option value="rejected">Rejected</option>
                                                      </select>
                                                        row.color = "#www"
                                                    }else if(json.rows[i].status === 1){
                                                      row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DOR")}>
                                                      <option value="pending">Pending</option>
                                                      <option value="progress" defaultValue style={{backgroundColor:"#yyy"}}>In progress</option>
                                                      <option value="materials">Materials</option>
                                                      <option value="ready">Ready</option>
                                                      <option value="rejected">Rejected</option>
                                                    </select>
                                                        row.color = "#yyy"
                                                    }else if(json.rows[i].status === 2){
                                                      row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DOR")}>
                                                      <option value="pending">Pending</option>
                                                      <option value="progress">In progress</option>
                                                      <option value="materials">Materials</option>
                                                      <option value="ready" defaultValue>Ready</option>
                                                      <option value="rejected">Rejected</option>
                                                      </select>
                                                        row.color = "#ggg"
                                                    }else if(json.rows[i].status === 3){
                                                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DOR")}>
                                                      <option value="pending">Pending</option>
                                                      <option value="progress">In progress</option>
                                                      <option value="materials">Materials</option>
                                                      <option value="ready">Ready</option>
                                                      <option value="rejected" defaultValue>Rejected</option>
                                                    </select>
                                                        row.color = "#rrr"
                                                    }else{
                                                      row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DOR")}>
                                                      <option value="pending">Pending</option>
                                                      <option value="progress">In progress</option>
                                                      <option value="materials" defaultValue>Materials</option>
                                                      <option value="ready">Ready</option>
                                                      <option value="rejected">Rejected</option>
                                                    </select>
                                                        row.color = "#bbb"
                                                    }
                                                    if(json.rows[i].priority === 0 || !json.rows[i].priority){
                                                      row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DOR")} >
                                                      <option value="low" defaultValue>Low</option>
                                                      <option value="medium">Medium</option>
                                                      <option value="high">High</option>
                                                    </select>
                                                    }else if(json.rows[i].priority === 1){
                                                      row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DOR")}>
                                                      <option value="low">Low</option>
                                                      <option value="medium" defaultValue>Medium</option>
                                                      <option value="high">High</option>
                                                    </select>
                                                    }else if(json.rows[i].priority === 2){
                                                      row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "DOR")}>
                                                      <option value="low">Low</option>
                                                      <option value="medium">Medium</option>
                                                      <option value="high" defaultValue>High</option>
                                                      </select>
                                                    }

                                                    if(secureStorage.getItem("user") === json.rows[i].email){
                                                      row.observations = <ObservationsPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations} updateData={this.props.updateData} updateObservations={this.updateObservations.bind(this)}/>
                                                    } else {
                                                      row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                                                    }

                                                  }else{
                                                    row["admin"] = json.rows[i].admin

                                                    if(json.rows[i].priority === 0){
                                                      row.priority = "Low"
                                                    }else if(json.rows[i].priority === 1){
                                                        row.priority = "Medium"
                                                    }else if(json.rows[i].priority === 2){
                                                        row.priority = "High"
                                                    }

                                                    if(json.rows[i].status === 0){
                                                      row.status = "Pending"
                                                      row.color = "#www"
                                                    }else if(json.rows[i].status === 1){
                                                        row.status = "In progress"
                                                        row.color = "#yyy"
                                                    }else if(json.rows[i].status === 2){
                                                        row.status = "Ready"
                                                        row.color = "#ggg"
                                                    }else if(json.rows[i].status === 3){
                                                      row.status = "Rejected"
                                                      row.color = "#rrr"
                                                    }else{
                                                      row.status = "Materials"
                                                      row.color = "#bbb"
                                                    }

                                                    row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                                                  }

                                                  const today = moment()
                                                  const createdDate = moment(row.created_at)

                                                  if (!createdDate.add(2, 'weeks').isSameOrAfter(today) && !(json.rows[i].status === 2 || json.rows[i].status === 3)) {
                                                    row.color = "#ppp" 
                                                    if(this.props.currentUser === json.rows[i].email){
                                                      alertCount++
                                                    }
                                                  }
                                  
                                                  if(json.rows[i].status === 0 || json.rows[i].status === 1 || json.rows[i].status === 4){
                                                    pendingRows.push(row)
                                                  }
                      
                                              }
                                            }
                                            
                                            /* Ortographic Drawing */
                                            await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getCITByProjects/"+secureStorage.getItem("user"), options)
                                            .then(response => response.json())
                                            .then(async json => {
                                            var row = null
                                              if(json.rows){
                                                for(let i = 0; i < json.rows.length; i++){
                                                  
                                                  let carta = ""
                                                  if(json.rows[i].carta){
                                                    carta = " - " + json.rows[i].carta
                                                  }
                                                  if(json.rows[i].attach === 1){
                                                    if(json.rows[i].accept_reject_date != null){
                                                      row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19).toString().substring(0,10), key: json.rows[i].incidence_number}
                                                    }else{
                                                      row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: "", key: json.rows[i].incidence_number}
                                                    }
                                                  }else{
                                                    if(json.rows[i].accept_reject_date != null){
                                                      row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                                                    }else{
                                                      row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description.substring(0,20) + "...", created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: "", key: json.rows[i].incidence_number}
                                                    }
                                                  }
                                                    if(secureStorage.getItem("role") === "3D Admin"){
                                                      row["hours"] = <input style={{width: "55px"}} type="text" defaultValue={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                                                      row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="CIT" changeAdmin = {this.changeAdmin.bind(this)}/>
                                                      if(json.rows[i].status === 0){
                                                          row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "CIT")} >
                                                          <option value="pending" defaultValue>Pending</option>
                                                          <option value="progress">In progress</option>
                                                          <option value="materials">Materials</option>
                                                          <option value="ready">Ready</option>
                                                          <option value="rejected">Rejected</option>
                                                        </select>
                                                          row.color = "#www"
                                                      }else if(json.rows[i].status === 1){
                                                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "CIT")}>
                                                        <option value="pending">Pending</option>
                                                        <option value="progress" defaultValue style={{backgroundColor:"#yyy"}}>In progress</option>
                                                        <option value="materials">Materials</option>
                                                        <option value="ready">Ready</option>
                                                        <option value="rejected">Rejected</option>
                                                      </select>
                                                          row.color = "#yyy"
                                                      }else if(json.rows[i].status === 2){
                                                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "CIT")}>
                                                        <option value="pending">Pending</option>
                                                        <option value="progress">In progress</option>
                                                        <option value="materials">Materials</option>
                                                        <option value="ready" defaultValue>Ready</option>
                                                        <option value="rejected">Rejected</option>
                                                        </select>
                                                          row.color = "#ggg"
                                                      }else if(json.rows[i].status === 3){
                                                          row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "CIT")}>
                                                        <option value="pending">Pending</option>
                                                        <option value="progress">In progress</option>
                                                        <option value="materials">Materials</option>
                                                        <option value="ready">Ready</option>
                                                        <option value="rejected" defaultValue>Rejected</option>
                                                      </select>
                                                          row.color = "#rrr"
                                                      }else{
                                                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "CIT")}>
                                                        <option value="pending">Pending</option>
                                                        <option value="progress">In progress</option>
                                                        <option value="materials" defaultValue>Materials</option>
                                                        <option value="ready">Ready</option>
                                                        <option value="rejected">Rejected</option>
                                                      </select>
                                                          row.color = "#bbb"
                                                      }
                                                      if(json.rows[i].priority === 0 || !json.rows[i].priority){
                                                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "CIT")} >
                                                        <option value="low" defaultValue>Low</option>
                                                        <option value="medium">Medium</option>
                                                        <option value="high">High</option>
                                                      </select>
                                                      }else if(json.rows[i].priority === 1){
                                                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "CIT")}>
                                                        <option value="low">Low</option>
                                                        <option value="medium" defaultValue>Medium</option>
                                                        <option value="high">High</option>
                                                      </select>
                                                      }else if(json.rows[i].priority === 2){
                                                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "CIT")}>
                                                        <option value="low">Low</option>
                                                        <option value="medium">Medium</option>
                                                        <option value="high" defaultValue>High</option>
                                                        </select>
                                                      }

                                                      if(secureStorage.getItem("user") === json.rows[i].email){
                                                        row.observations = <ObservationsPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations} updateData={this.props.updateData} updateObservations={this.updateObservations.bind(this)}/>
                                                      } else {
                                                        row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                                                      }
                                                      
                                                    }else{
                                                      row["admin"] = json.rows[i].admin

                                                      if(json.rows[i].priority === 0){
                                                        row.priority = "Low"
                                                      }else if(json.rows[i].priority === 1){
                                                          row.priority = "Medium"
                                                      }else if(json.rows[i].priority === 2){
                                                          row.priority = "High"
                                                      }

                                                      if(json.rows[i].status === 0){
                                                        row.status = "Pending"
                                                        row.color = "#www"
                                                      }else if(json.rows[i].status === 1){
                                                          row.status = "In progress"
                                                          row.color = "#yyy"
                                                      }else if(json.rows[i].status === 2){
                                                          row.status = "Ready"
                                                          row.color = "#ggg"
                                                      }else if(json.rows[i].status === 3){
                                                        row.status = "Rejected"
                                                        row.color = "#rrr"
                                                      }else{
                                                        row.status = "Materials"
                                                        row.color = "#bbb"
                                                      }

                                                      row.observations = <ObservationsViewPopUp incidence_number={json.rows[i].incidence_number} observations={json.rows[i].observations}/>
                                                    }

                                                    const today = moment()
                                                    const createdDate = moment(row.created_at)

                                                    if (!createdDate.add(2, 'weeks').isSameOrAfter(today) && !(json.rows[i].status === 2 || json.rows[i].status === 3)) {
                                                      row.color = "#ppp" 
                                                      if(this.props.currentUser === json.rows[i].email){
                                                        alertCount++
                                                      }
                                                    }
                                    
                                                    if(json.rows[i].status === 0 || json.rows[i].status === 1 || json.rows[i].status === 4){
                                                      pendingRows.push(row)
                                                    }
                        
                                                }
                                              }

                                              /* */

                                            })    

                                          })    
                                      
                                        })
                                    
                                      })
                                  
                                    })
                                
                                  })
                              
                                })
                                // Sort the array based on the second element
                                rows.sort(function(first, second) {
                                  return second.created_at.localeCompare(first.created_at);
                                });

                                let filterRow
                                if(secureStorage.getItem("role") === "3D Admin"){
                                  filterRow = [{incidence_number: <div><input type="text" className="filter__input" placeholder="Reference" onChange={(e) => this.filter(0, e.target.value)}/></div>, project: <div><input type="text" className="filter__input" placeholder="Project" onChange={(e) => this.filter(1, e.target.value)}/></div>, user: <div><input type="text" className="filter__input" placeholder="User" onChange={(e) => this.filter(2, e.target.value)}/></div>, created_at: <div><input type="text" className="filter__input" placeholder="Date" onChange={(e) => this.filter(4,e.target.value)}/></div>, ar_date: <div><input type="text" className="filter__input" placeholder="Date" onChange={(e) => this.filter(6,e.target.value)}/></div>, admin: <div><input type="text" className="filter__input" placeholder="Admin" onChange={(e) => this.filter(9,e.target.value)}/></div>, status: <div><input type="text" className="filter__input" placeholder="Status" onChange={(e) => this.filter(10,e.target.value)}/></div>, priority: <div><input type="text" className="filter__input" placeholder="Priority" onChange={(e) => this.filter(12,e.target.value)}/></div>}]
                                }else{
                                  filterRow = [{incidence_number: <div><input type="text" className="filter__input" placeholder="Reference" onChange={(e) => this.filterD(0, e.target.value)}/></div>, project: <div><input type="text" className="filter__input" placeholder="Project" onChange={(e) => this.filterD(1, e.target.value)}/></div>, user: <div><input type="text" className="filter__input" placeholder="User" onChange={(e) => this.filterD(2, e.target.value)}/></div>, created_at: <div><input type="text" className="filter__input" placeholder="Date" onChange={(e) => this.filterD(4,e.target.value)}/></div>, ar_date: <div><input type="text" className="filter__input" placeholder="Date" onChange={(e) => this.filterD(6,e.target.value)}/></div>, admin: <div><input type="text" className="filter__input" placeholder="Admin" onChange={(e) => this.filterD(8,e.target.value)}/></div>, status: <div><input type="text" className="filter__input" placeholder="Status" onChange={(e) => this.filterD(10,e.target.value)}/></div>, priority: <div><input type="text" className="filter__input" placeholder="Priority" onChange={(e) => this.filterD(9,e.target.value)}/></div>}]                  
                                }             
                                pendingRows = pendingRows.sort((a, b) => (a.created_at < b.created_at) ? 1 : -1)

                                this.setState({data : rows, pendingData: pendingRows, displayData: [], alertCount: alertCount});
                                this.props.alertCount(alertCount)
                                let auxDisplayData
                                if(this.props.showAll){
                                  this.setState({displayData: rows})
                                  auxDisplayData = this.state.data
                                }else{
                                  this.setState({displayData: pendingRows})
                                  auxDisplayData = this.state.pendingData
                                }
                                await this.setState({filters : filterRow})
                                if(this.props.currentProject !== "All"){
                                  this.filter(1, this.props.currentProject)
                                }
                                 
                                let resultData = []
                                let fil, exists = null
                                
                                for(let i = 0; i < auxDisplayData.length; i++){
                                  exists = true
                                  
                                  for(let column = 0; column < Object.keys(auxDisplayData[i]).length-1; column ++){
                                    
                                    fil = Object.keys(auxDisplayData[i])[column]
                                    if(secureStorage.getItem("role") !== "3D Admin" && column === 8){
                                        column = 11
                                    }
                                    if(fil === "specifications"){
                                      fil = "status"
                                    }
                                    if(fil === "status"){
                                      if(auxDisplayData[i][fil].props){
                                        for(let p = 0; p < auxDisplayData[i][fil].props.children.length; p++){
                                          if(auxDisplayData[i][fil].props.children[p].props.selected){

                                            if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].props.children[p].props.children.toLowerCase().includes(this.state.filterData[column].toLowerCase())){
                                              exists = false
                                            }
                                          }
                                        }
                                      }else if(auxDisplayData[i][fil]){
                                        if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].toLowerCase().includes(this.state.filterData[column].toLowerCase())){
                                          exists = false
                                        }
                                      }else{
                                        if(this.state.filterData[column] !== "" && this.state.filterData[column]){
                                          exists = false
                                        }
                                      }
                                    }else if(fil === "priority"){
                                      if(auxDisplayData[i][fil].props){
                                        for(let p = 0; p < auxDisplayData[i][fil].props.children.length; p++){
                                          if(auxDisplayData[i][fil].props.children[p].props.selected){
                                            if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].props.children[p].props.children.toLowerCase().includes(this.state.filterData[column].toLowerCase())){
                                              exists = false
                                            }
                                          }
                                        }
                                      }else if(auxDisplayData[i][fil]){
                                        if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].toLowerCase().includes(this.state.filterData[column].toLowerCase())){
                                          exists = false
                                        }
                                      }else{
                                        if(this.state.filterData[column] !== "" && this.state.filterData[column]){
                                          exists = false
                                        }
                                      }
                                    }else if(fil === "admin"){
                                      if(auxDisplayData[i][fil].props){
                                        if(auxDisplayData[i][fil].props.admin){
                                          if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].props.admin.toLowerCase().includes(this.state.filterData[column].toLowerCase())){
                                            exists = false
                                          }
                                        }
                                        
                                      }else if(auxDisplayData[i][fil]){
                                        if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].toLowerCase().includes(this.state.filterData[column].toLowerCase())){
                                          exists = false
                                        }
                                      }else{
                                        if(this.state.filterData[column] !== "" && this.state.filterData[column]){
                                          exists = false
                                        }
                                      }
                                    }else{
                                      
                                      if(this.state.filterData[column]){
                                        if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].toLowerCase().includes(this.state.filterData[column].toLowerCase())){
                                          exists = false
                                        }
                                      }
                                      
                                    }
                                    
                                  }
                                  if(exists){
                                    resultData.push(auxDisplayData[i])
                                  }
                                }
                                await this.setState({displayData: resultData})

                            })

                        })

                    })

                })

            })
            
        })
      }

      }
    

  }

  async changeAdmin(admin, incidence_number, type){
    this.props.changeAdmin(admin, incidence_number, type)
  }
  

  async filter(column, value){
    let fd = this.state.filterData
    fd[column] = value
    await this.setState({filterData: fd})

    let auxDisplayData
    if(this.props.showAll){
      auxDisplayData = this.state.data
    }else{
      auxDisplayData = this.state.pendingData
    }

    let resultData = []
    let fil, exists = null
    
    for(let i = 0; i < auxDisplayData.length; i++){
      exists = true
      
      for(let column = 0; column < Object.keys(auxDisplayData[i]).length-1; column ++){
        
        fil = Object.keys(auxDisplayData[i])[column]
        if(secureStorage.getItem("role") !== "3D Admin" && column === 8){
            column = 11
        }
        if(fil === "specifications"){
          fil = "status"
        }
        if(fil === "status"){
          if(auxDisplayData[i][fil].props){
            for(let p = 0; p < auxDisplayData[i][fil].props.children.length; p++){
              if(auxDisplayData[i][fil].props.children[p].props.selected){

                if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].props.children[p].props.children.toLowerCase().includes(this.state.filterData[column].toLowerCase())){
                  exists = false
                }
              }
            }
          }else if(auxDisplayData[i][fil]){
            if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].toLowerCase().includes(this.state.filterData[column].toLowerCase())){
              exists = false
            }
          }else{
            if(this.state.filterData[column] !== "" && this.state.filterData[column]){
              exists = false
            }
          }
        }else if(fil === "priority"){
          if(auxDisplayData[i][fil].props){
            for(let p = 0; p < auxDisplayData[i][fil].props.children.length; p++){
              if(auxDisplayData[i][fil].props.children[p].props.selected){
                if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].props.children[p].props.children.toLowerCase().includes(this.state.filterData[column].toLowerCase())){
                  exists = false
                }
              }
            }
          }else if(auxDisplayData[i][fil]){
            if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].toLowerCase().includes(this.state.filterData[column].toLowerCase())){
              exists = false
            }
          }else{
            if(this.state.filterData[column] !== "" && this.state.filterData[column]){
              exists = false
            }
          }
        }else if(fil === "admin"){
          if(auxDisplayData[i][fil].props){
            if(auxDisplayData[i][fil].props.admin){
              if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].props.admin.toLowerCase().includes(this.state.filterData[column].toLowerCase())){
                exists = false
              }
            }
            
          }else if(auxDisplayData[i][fil]){
            if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].toLowerCase().includes(this.state.filterData[column].toLowerCase())){
              exists = false
            }
          }else{
            if(this.state.filterData[column] !== "" && this.state.filterData[column]){
              exists = false
            }
          }
        }else{
          
          if(this.state.filterData[column]){
            if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].toLowerCase().includes(this.state.filterData[column].toLowerCase())){
              exists = false
            }
          }
          
        }
        
      }
      if(exists){
        resultData.push(auxDisplayData[i])
      }
    }
    await this.setState({displayData: resultData})
  }

  async filterD(column, value){
    let fd = this.state.filterData
    fd[column] = value
    await this.setState({filterData: fd})

    let auxDisplayData
    if(this.props.showAll){
      auxDisplayData = this.state.data
    }else{
      auxDisplayData = this.state.pendingData
    }
    
    let resultData = []
    let fil, exists = null
    
    for(let i = 0; i < auxDisplayData.length; i++){
      exists = true
      
      for(let column = 0; column < Object.keys(auxDisplayData[i]).length-1; column ++){
        
        fil = Object.keys(auxDisplayData[i])[column]
          if(this.state.filterData[column]){
            if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].toLowerCase().includes(this.state.filterData[column].toLowerCase())){
              exists = false
            }
          }
      }
      if(exists){
        resultData.push(auxDisplayData[i])
      }
    }
    await this.setState({displayData: resultData})
  }


  async updateObservations(incidence_number, observations){
    this.props.updateObservations([incidence_number, observations])
  }

  async updateHours(incidence_number, hours){
    
    await this.props.updateHours([incidence_number, hours])
  }
  
  getColumnSearchProps = dataIndex => ({
    
    render: text => 
      
      text
    
      
  });

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    let ids = []
    for(let i = 0; i < selectedRows.length; i++){
      ids.push(selectedRows[i].id.props.children)
    }
    this.setState({
      selectedRowsKeys: selectedRowKeys,
      selectedRows: selectedRows
    })
    //this.setState({ selectedRows: selectedRows });
    this.props.onChange(ids);
    
  };

  compare( a, b ) {
    if ( a.last_nom < b.last_nom ){
      return -1;
    }
    if ( a.last_nom > b.last_nom ){
      return 1;
    }
    return 0;
  }
  

  render() {

    let columns = [
      {
        title: <center className="dataTable__header__text">Reference</center>,
        dataIndex: 'incidence_number',
        key: 'incidence_number',
        ...this.getColumnSearchProps('incidence_number'),
        sorter:{
          compare: (a, b) => a.incidence_number.localeCompare(b.incidence_number),
        },
      },
      {
        title: <center className="dataTable__header__text">Project</center>,
        dataIndex: 'project',
        key: 'project',
        ...this.getColumnSearchProps('project'),
        sorter:{
          compare: (a, b) => a.project.localeCompare(b.project),
        },
      },
      {
        title: <center className="dataTable__header__text">User</center>,
        dataIndex: 'user',
        key: 'user',
        ...this.getColumnSearchProps('user'),
        sorter:{
          compare: (a, b) => a.user.localeCompare(b.user),
        },
      },
      {
        title: <center className="dataTable__header__text">Description</center>,
        dataIndex: 'description',
        key: 'description',
        ...this.getColumnSearchProps('description'),
        sorter:{
          compare: (a, b) => a.description.localeCompare(b.description),
        },
        width: "120px"
      },
      {
        title: <div className="dataTable__header__text">Date</div>,
        dataIndex: 'created_at',
        key: 'created_at',
        ...this.getColumnSearchProps('created_at'),
        sorter: {
          compare: (a, b) => { return a.created_at.localeCompare(b.created_at)},
        },
        width: "120px"

      },
      {
        title: <center className="dataTable__header__text">Actions</center>,
        dataIndex: 'specifications',
        key: 'specifications',
        ...this.getColumnSearchProps('specifications'),
        width: "120px"
      },  
      {
        title: <center className="dataTable__header__text">Observations</center>,
        dataIndex: 'observations',
        key: 'observations',
        ...this.getColumnSearchProps('observations'),
        width: "150px"
      },  
      {
        title: <center className="dataTable__header__text">Accepted/Rejected Date</center>,
        dataIndex: 'ar_date',
        key: 'ar_date',
        ...this.getColumnSearchProps('ar_date'),
        width: "220px",
        sorter: {
          compare: (a, b) => { return a.ar_date.localeCompare(b.ar_date)},
        },
      },
      {
        title: <center className="dataTable__header__text">Admin</center>,
        dataIndex: 'admin',
        key: 'admin',
        align: "center",
        ...this.getColumnSearchProps('admin'),
        width: "320px"
      },
      {
        title: <center className="dataTable__header__text">Priority</center>,
        dataIndex: 'priority',
        key: 'priority',
        ...this.getColumnSearchProps('priority'),
        sorter:{
          compare: (a, b) => a.priority.localeCompare(b.priority),
        },
        width: '105px'
      },
      {
        title: <center className="dataTable__header__text">Status</center>,
        dataIndex: 'status',
        key: 'status',
        ...this.getColumnSearchProps('status'),
        sorter:{
          compare: (a, b) => a.status.localeCompare(b.status),
        },
        width: '160px'
      },
    ]

    if(secureStorage.getItem("role") === "3D Admin"){
      columns = [
        {
          title: <center className="dataTable__header__text">Reference</center>,
          dataIndex: 'incidence_number',
          key: 'incidence_number',
          ...this.getColumnSearchProps('incidence_number'),
          sorter:{
            compare: (a, b) => a.incidence_number.localeCompare(b.incidence_number),
          },
        },
        {
          title: <center className="dataTable__header__text">Project</center>,
          dataIndex: 'project',
          key: 'project',
          ...this.getColumnSearchProps('project'),
          sorter:{
            compare: (a, b) => a.project.localeCompare(b.project),
          },
          width: "270px"
        },
        {
          title: <center className="dataTable__header__text">User</center>,
          dataIndex: 'user',
          key: 'user',
          ...this.getColumnSearchProps('user'),
          sorter:{
            compare: (a, b) => a.user.localeCompare(b.user),
          },
          width: "270px"
        },
        {
          title: <center className="dataTable__header__text">Description</center>,
          dataIndex: 'description',
          key: 'description',
          ...this.getColumnSearchProps('description'),
          sorter:{
            compare: (a, b) => a.description.localeCompare(b.description),
          },
          width: "120px"
        },
        {
          title: <div className="dataTable__header__text">Date</div>,
          dataIndex: 'created_at',
          key: 'created_at',
          ...this.getColumnSearchProps('created_at'),
          sorter: {
            compare: (a, b) => { return a.created_at.localeCompare(b.created_at)},
          },
          width: "120px"
        },
        {
          title: <center className="dataTable__header__text">Actions</center>,
          dataIndex: 'specifications',
          key: 'specifications',
          ...this.getColumnSearchProps('specifications'),
          width: "120px"
        },  
        {
          title: <center className="dataTable__header__text">Observations</center>,
          dataIndex: 'observations',
          key: 'observations',
          ...this.getColumnSearchProps('observations'),
          width:"150px"
        },  
        {
          title: <center className="dataTable__header__text">Accepted/Rejected Date</center>,
          dataIndex: 'ar_date',
          key: 'ar_date',
          ...this.getColumnSearchProps('ar_date'),
          width: "220px",
          sorter: {
            compare: (a, b) => { return a.ar_date.localeCompare(b.ar_date)},
          },
        },
        {
          title: <center className="dataTable__header__text">Admin</center>,
          dataIndex: 'admin',
          key: 'admin',
          align: "center",
          ...this.getColumnSearchProps('admin'),
          width: "300px"
        },
        {
          title: <center className="dataTable__header__text">Priority</center>,
          dataIndex: 'priority',
          key: 'priority',
          ...this.getColumnSearchProps('priority'),
          width: '105px'
        },
        {
          title: <center className="dataTable__header__text">Hours</center>,
          dataIndex: 'hours',
          key: 'hours',
          ...this.getColumnSearchProps('hours'),
          width: "70px"
        },
        {
          title: <center className="dataTable__header__text">Status</center>,
          dataIndex: 'status',
          key: 'status',
          ...this.getColumnSearchProps('status'),
          sorter:{
            compare: (a, b) => a.status.localeCompare(b.status),
          },
          width: '160px'
        },
      ]
    }

    var totalElements = null;
    if (this.state.data.length === 0){
      totalElements = null;
    }else if(this.props.showAll){
      totalElements = (<div style={{position: "absolute", bottom: 140, left:120}}>
      <b>Total elements: {this.state.data.length}</b>
     </div>);
    }else{
      totalElements = (<div style={{position: "absolute", bottom: 140, left:120}}>
      <b>Total elements: {this.state.pendingData.length}</b>
     </div>);
    }

    return (
      <div>
        {this.state.updateData}
        <div className="estimatedDataTable__container" style={{width:"auto"}}>
        <Table className="customTable" bordered = {true} columns={columns} dataSource={this.state.displayData} style={{ height: '540px' }} scroll={{y:420}} pagination={{disabled:true, defaultPageSize:5000}} size="small"
         rowClassName= {(record) => record.color.replace('#', '')}/>
          <Table className="filter__table" pagination={{disabled:true}} scroll={{y:427}} showHeader = {false} bordered = {true} columns={columns} dataSource={this.state.filters} size="small"/> 
          {totalElements}
        </div>
        
      </div>
    );
  }
}

export default QTrackerViewDataTable;