import React from 'react';
import 'antd/dist/antd.css';
import { Table } from 'antd';
import QtrackerNWCSpecPopUp from '../qtrackerNWCSpecPopUp/qtrackerNWCSpecPopUp';
import QtrackerNVNSpecPopUp from '../qtrackerNVNSpecPopUp/qtrackerNVNSpecPopUp';
import QtrackerNRISpecPopUp from '../qtrackerNRISpecPopUp/qtrackerNRISpecPopUp';
import QtrackerNRBSpecPopUp from '../qtrackerNRBSpecPopUp/qtrackerNRBSpecPopUp';
import QtrackerNRIDSSpecPopUp from '../qtrackerNRIDSSpecPopUp/qtrackerNRIDSSpecPopUp';
import QtrackerRPSpecPopUp from '../qtrackerRPSpecPopUp/qtrackerRPSpecPopUp';
import './qtrackerViewDataTable.css'
import AttachIcon from "../../assets/images/attach.png"
import ChangeAdminPopUp from '../changeAdminPopUp/changeAdminPopUp';
import { JoinFull } from '@mui/icons-material';
import QtrackerISSpecPopUp from '../qtrackerISSpecPopUp/qtrackerISSpecPopUp';

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

class QTrackerViewDataTable extends React.Component{
  state = {
    searchText: '',
    searchedColumn: '',
    data: [],
    displayData: [],
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
  };

  async statusChange(incidence_number, status, project, type){
    let status_id
    if(status === "pending"){
      status_id = 0
    }else if(status === "progress"){
      status_id = 1
    }else if(status === "ready"){
      status_id = 2
    }else if(status === "rejected"){
      status_id = 3
    }

   await this.props.updateStatus([incidence_number, status_id, project, type])  
  }

  async priorityChange(incidence_number, priority, project, type){
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

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getNWCByProjects/"+secureStorage.getItem("user"), options)
        .then(response => response.json())
        .then(async json => {
          var rows = []
          var row = null
          if(json.rows){
            for(let i = 0; i < json.rows.length; i++){
                let carta = ""
                if(json.rows[i].carta){
                  carta = " - " + json.rows[i].carta
                }
                if(json.rows[i].attach === 1){
                  if(json.rows[i].accept_reject_date != null){
                    
                    row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNWCSpecPopUp incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19).toString().substring(0,10), key: json.rows[i].incidence_number}
                  }else{
                    row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNWCSpecPopUp incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: "", key: json.rows[i].incidence_number}
                  }
                }else{
                  if(json.rows[i].accept_reject_date != null){
                    row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNWCSpecPopUp incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                  }else{
                    row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNWCSpecPopUp incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: "", key: json.rows[i].incidence_number}
                  }
                }

                if(secureStorage.getItem("role") === "3D Admin"){
                  row["hours"] = <input style={{width: "55px"}} type="text" value={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                  row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="NWC" changeAdmin = {this.changeAdmin.bind(this)}/>
                  if(json.rows[i].status === 0){
                      row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NWC")} >
                      <option value="pending" selected>Pending</option>
                      <option value="progress">In progress</option>
                      <option value="ready">Ready</option>
                      <option value="rejected">Rejected</option>
                    </select>
                      row.color = "#www"
                  }else if(json.rows[i].status === 1){
                    row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NWC")}>
                    <option value="pending">Pending</option>
                    <option value="progress" selected style={{backgroundColor:"#yyy"}}>In progress</option>
                    <option value="ready">Ready</option>
                    <option value="rejected">Rejected</option>
                  </select>
                      row.color = "#yyy"
                  }else if(json.rows[i].status === 2){
                    row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NWC")}>
                    <option value="pending">Pending</option>
                    <option value="progress">In progress</option>
                    <option value="ready" selected>Ready</option>
                    <option value="rejected">Rejected</option>
                    </select>
                      row.color = "#ggg"
                  }else{
                    row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NWC")}>
                    <option value="pending">Pending</option>
                    <option value="progress">In progress</option>
                    <option value="ready">Ready</option>
                    <option value="rejected" selected>Rejected</option>
                   </select>
                      row.color = "#rrr"
                  }

                  if(json.rows[i].priority === 0 || !json.rows[i].priority){
                    row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NWC")} >
                    <option value="low" selected>Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  }else if(json.rows[i].priority === 1){
                    row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NWC")}>
                    <option value="low">Low</option>
                    <option value="medium" selected>Medium</option>
                    <option value="high">High</option>
                  </select>
                  }else if(json.rows[i].priority === 2){
                    row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NWC")}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high" selected>High</option>
                    </select>
                  }

                  row.observations = <input style={{width: "200px"}} type="text" value={json.rows[i].observations} onChange={(event)=>this.updateObservations(json.rows[i].incidence_number, event.target.value)}/>

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
                  }else{
                      row.status = "Rejected"
                      row.color = "#rrr"
                  }

                  row.observations = json.rows[i].observations
                }
                
                rows.push(row)
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
                      row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19).toString().substring(0,10), key: json.rows[i].incidence_number}
                    }else{
                      row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: "", key: json.rows[i].incidence_number}
                    }
                  }else{
                    if(json.rows[i].accept_reject_date != null){
                      row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                    }else{
                      row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: "", key: json.rows[i].incidence_number}
                    }
                  }
                    if(secureStorage.getItem("role") === "3D Admin"){
                      row["hours"] = <input style={{width: "55px"}} type="text" value={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                      row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="NVN" changeAdmin = {this.changeAdmin.bind(this)}/>
                      if(json.rows[i].status === 0){
                          row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NVN")} >
                          <option value="pending" selected>Pending</option>
                          <option value="progress">In progress</option>
                          <option value="ready">Ready</option>
                          <option value="rejected">Rejected</option>
                        </select>
                          row.color = "#www"
                      }else if(json.rows[i].status === 1){
                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NVN")}>
                        <option value="pending">Pending</option>
                        <option value="progress" selected style={{backgroundColor:"#yyy"}}>In progress</option>
                        <option value="ready">Ready</option>
                        <option value="rejected">Rejected</option>
                      </select>
                          row.color = "#yyy"
                      }else if(json.rows[i].status === 2){
                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NVN")}>
                        <option value="pending">Pending</option>
                        <option value="progress">In progress</option>
                        <option value="ready" selected>Ready</option>
                        <option value="rejected">Rejected</option>
                        </select>
                          row.color = "#ggg"
                      }else{
                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NVN")}>
                        <option value="pending">Pending</option>
                        <option value="progress">In progress</option>
                        <option value="ready">Ready</option>
                        <option value="rejected" selected>Rejected</option>
                       </select>
                          row.color = "#rrr"
                      }
                      if(json.rows[i].priority === 0 || !json.rows[i].priority){
                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NVN")} >
                        <option value="low" selected>Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                      }else if(json.rows[i].priority === 1){
                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NVN")}>
                        <option value="low">Low</option>
                        <option value="medium" selected>Medium</option>
                        <option value="high">High</option>
                      </select>
                      }else if(json.rows[i].priority === 2){
                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NVN")}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high" selected>High</option>
                        </select>
                      }
                      row.observations = <input type="text" value={json.rows[i].observations} style={{width: "200px"}} onChange={(event)=>this.updateObservations(json.rows[i].incidence_number, event.target.value)}/>

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
                      }else{
                          row.status = "Rejected"
                          row.color = "#rrr"
                      }

                      row.observations = json.rows[i].observations
                    }
                    rows.push(row)
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
                          row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNRISpecPopUp incidence_number={json.rows[i].incidence_number} pipe={json.rows[i].pipe} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19).toString().substring(0,10),key: json.rows[i].incidence_number}
                        }else{
                          row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNRISpecPopUp incidence_number={json.rows[i].incidence_number} pipe={json.rows[i].pipe} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: "", key: json.rows[i].incidence_number}
                        }
                      }else{
                        if(json.rows[i].accept_reject_date != null){
                          row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNRISpecPopUp incidence_number={json.rows[i].incidence_number} pipe={json.rows[i].pipe} description={json.rows[i].description}/>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                        }else{
                          row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNRISpecPopUp incidence_number={json.rows[i].incidence_number} pipe={json.rows[i].pipe} description={json.rows[i].description}/>, ar_date: "", key: json.rows[i].incidence_number}
                        }
                      }
                        if(secureStorage.getItem("role") === "3D Admin"){
                          row["hours"] = <input style={{width: "55px"}} type="text" value={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                          row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="NRI" changeAdmin = {this.changeAdmin.bind(this)}/>
                          if(json.rows[i].status === 0){
                              row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRI")} >
                              <option value="pending" selected>Pending</option>
                              <option value="progress">In progress</option>
                              <option value="ready">Ready</option>
                              <option value="rejected">Rejected</option>
                            </select>
                              row.color = "#www"
                          }else if(json.rows[i].status === 1){
                            row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRI")}>
                            <option value="pending">Pending</option>
                            <option value="progress" selected style={{backgroundColor:"#yyy"}}>In progress</option>
                            <option value="ready">Ready</option>
                            <option value="rejected">Rejected</option>
                          </select>
                              row.color = "#yyy"
                          }else if(json.rows[i].status === 2){
                            row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRI")}>
                            <option value="pending">Pending</option>
                            <option value="progress">In progress</option>
                            <option value="ready" selected>Ready</option>
                            <option value="rejected">Rejected</option>
                            </select>
                              row.color = "#ggg"
                          }else{
                            row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRI")}>
                            <option value="pending">Pending</option>
                            <option value="progress">In progress</option>
                            <option value="ready">Ready</option>
                            <option value="rejected" selected>Rejected</option>
                           </select>
                              row.color = "#rrr"
                          }

                          if(json.rows[i].priority === 0 || !json.rows[i].priority){
                            row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRI")} >
                            <option value="low" selected>Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                          }else if(json.rows[i].priority === 1){
                            row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRI")}>
                            <option value="low">Low</option>
                            <option value="medium" selected>Medium</option>
                            <option value="high">High</option>
                          </select>
                          }else if(json.rows[i].priority === 2){
                            row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRI")}>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high" selected>High</option>
                            </select>
                          }
                          row.observations = <input type="text" value={json.rows[i].observations} style={{width: "200px"}} onChange={(event)=>this.updateObservations(json.rows[i].incidence_number, event.target.value)}/>

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
                          }else{
                              row.status = "Rejected"
                              row.color = "#rrr"
                          }

                          row.observations = json.rows[i].observations
                        }
                        rows.push(row)
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
                              row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNRISpecPopUp incidence_number={json.rows[i].incidence_number} pipe={json.rows[i].pipe} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19).toString().substring(0,10), key: json.rows[i].incidence_number}
                            }else{
                              row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNRISpecPopUp incidence_number={json.rows[i].incidence_number} pipe={json.rows[i].pipe} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: "", key: json.rows[i].incidence_number}
                            }
                          }else{
                            if(json.rows[i].accept_reject_date != null){
                              row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNRISpecPopUp incidence_number={json.rows[i].incidence_number} pipe={json.rows[i].pipe} description={json.rows[i].description}/>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                            }else{
                              row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNRISpecPopUp incidence_number={json.rows[i].incidence_number} pipe={json.rows[i].pipe} description={json.rows[i].description}/>, ar_date: "", key: json.rows[i].incidence_number}
                            }
                          }
                            if(secureStorage.getItem("role") === "3D Admin"){
                              row["hours"] = <input style={{width: "55px"}} type="text" value={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                              row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="NRB" changeAdmin = {this.changeAdmin.bind(this)}/>
                              if(json.rows[i].status === 0){
                                  row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRB")} >
                                  <option value="pending" selected>Pending</option>
                                  <option value="progress">In progress</option>
                                  <option value="ready">Ready</option>
                                  <option value="rejected">Rejected</option>
                                </select>
                                  row.color = "#www"
                              }else if(json.rows[i].status === 1){
                                row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRB")}>
                                <option value="pending">Pending</option>
                                <option value="progress" selected style={{backgroundColor:"#yyy"}}>In progress</option>
                                <option value="ready">Ready</option>
                                <option value="rejected">Rejected</option>
                              </select>
                                  row.color = "#yyy"
                              }else if(json.rows[i].status === 2){
                                row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRB")}>
                                <option value="pending">Pending</option>
                                <option value="progress">In progress</option>
                                <option value="ready" selected>Ready</option>
                                <option value="rejected">Rejected</option>
                                </select>
                                  row.color = "#ggg"
                              }else{
                                row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRB")}>
                                <option value="pending">Pending</option>
                                <option value="progress">In progress</option>
                                <option value="ready">Ready</option>
                                <option value="rejected" selected>Rejected</option>
                               </select>
                                  row.color = "#rrr"
                              }

                              if(json.rows[i].priority === 0 || !json.rows[i].priority){
                                row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRB")} >
                                <option value="low" selected>Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                              </select>
                              }else if(json.rows[i].priority === 1){
                                row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRB")}>
                                <option value="low">Low</option>
                                <option value="medium" selected>Medium</option>
                                <option value="high">High</option>
                              </select>
                              }else if(json.rows[i].priority === 2){
                                row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRB")}>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high" selected>High</option>
                                </select>
                              }

                              row.observations = <input type="text" value={json.rows[i].observations} style={{width: "200px"}} onChange={(event)=>this.updateObservations(json.rows[i].incidence_number, event.target.value)}/>
                            
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
                              }else{
                                  row.status = "Rejected"
                                  row.color = "#rrr"
                              }

                              row.observations = json.rows[i].observations
                            }
                            rows.push(row)
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
                                row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNRIDSSpecPopUp incidence_number={json.rows[i].incidence_number} name={json.rows[i].name}/>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                              }else{
                                row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNRIDSSpecPopUp incidence_number={json.rows[i].incidence_number} name={json.rows[i].name}/>, ar_date: "", key: json.rows[i].incidence_number}
                              }
                                if(secureStorage.getItem("role") === "3D Admin"){
                                  row["hours"] = <input style={{width: "55px"}} type="text" value={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                                  row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="NRIDS" changeAdmin = {this.changeAdmin.bind(this)}/>
                                  if(json.rows[i].status === 0){
                                      row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRIDS")} >
                                      <option value="pending" selected>Pending</option>
                                      <option value="progress">In progress</option>
                                      <option value="ready">Ready</option>
                                      <option value="rejected">Rejected</option>
                                    </select>
                                      row.color = "#www"
                                  }else if(json.rows[i].status === 1){
                                    row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRIDS")}>
                                    <option value="pending">Pending</option>
                                    <option value="progress" selected style={{backgroundColor:"#yyy"}}>In progress</option>
                                    <option value="ready">Ready</option>
                                    <option value="rejected">Rejected</option>
                                  </select>
                                      row.color = "#yyy"
                                  }else if(json.rows[i].status === 2){
                                    row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRIDS")}>
                                    <option value="pending">Pending</option>
                                    <option value="progress">In progress</option>
                                    <option value="ready" selected>Ready</option>
                                    <option value="rejected">Rejected</option>
                                    </select>
                                      row.color = "#ggg"
                                  }else{
                                    row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRIDS")}>
                                    <option value="pending">Pending</option>
                                    <option value="progress">In progress</option>
                                    <option value="ready">Ready</option>
                                    <option value="rejected" selected>Rejected</option>
                                   </select>
                                      row.color = "#rrr"
                                  }

                                  if(json.rows[i].priority === 0 || !json.rows[i].priority){
                                    row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRIDS")} >
                                    <option value="low" selected>Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                  </select>
                                  }else if(json.rows[i].priority === 1){
                                    row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRIDS")}>
                                    <option value="low">Low</option>
                                    <option value="medium" selected>Medium</option>
                                    <option value="high">High</option>
                                  </select>
                                  }else if(json.rows[i].priority === 2){
                                    row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRIDS")}>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high" selected>High</option>
                                    </select>
                                  }
                                  row.observations = <input type="text" value={json.rows[i].observations} style={{width: "200px"}} onChange={(event)=>this.updateObservations(json.rows[i].incidence_number, event.target.value)}/>

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
                                  }else{
                                      row.status = "Rejected"
                                      row.color = "#rrr"
                                  }
                                  row.observations = json.rows[i].observations
                                }
                                rows.push(row)
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
                                    row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerRPSpecPopUp incidence_number={json.rows[i].incidence_number} items={json.rows[i].items_to_report} scope={json.rows[i].scope} description={json.rows[i].description}/>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                                  }else{
                                    row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerRPSpecPopUp incidence_number={json.rows[i].incidence_number} items={json.rows[i].items_to_report} scope={json.rows[i].scope} description={json.rows[i].description}/>, ar_date: "", key: json.rows[i].incidence_number}
                                  }
                                    if(secureStorage.getItem("role") === "3D Admin"){
                                      row["hours"] = <input style={{width: "55px"}} type="text" value={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                                      row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="RP" changeAdmin = {this.changeAdmin.bind(this)}/>
                                      if(json.rows[i].status === 0){
                                          row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "RP")} >
                                          <option value="pending" selected>Pending</option>
                                          <option value="progress">In progress</option>
                                          <option value="ready">Ready</option>
                                          <option value="rejected">Rejected</option>
                                        </select>
                                          row.color = "#www"
                                      }else if(json.rows[i].status === 1){
                                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "RP")}>
                                        <option value="pending">Pending</option>
                                        <option value="progress" selected style={{backgroundColor:"#yyy"}}>In progress</option>
                                        <option value="ready">Ready</option>
                                        <option value="rejected">Rejected</option>
                                      </select>
                                          row.color = "#yyy"
                                      }else if(json.rows[i].status === 2){
                                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "RP")}>
                                        <option value="pending">Pending</option>
                                        <option value="progress">In progress</option>
                                        <option value="ready" selected>Ready</option>
                                        <option value="rejected">Rejected</option>
                                        </select>
                                          row.color = "#ggg"
                                      }else{
                                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "RP")}>
                                        <option value="pending">Pending</option>
                                        <option value="progress">In progress</option>
                                        <option value="ready">Ready</option>
                                        <option value="rejected" selected>Rejected</option>
                                       </select>
                                          row.color = "#rrr"
                                      }

                                      if(json.rows[i].priority === 0 || !json.rows[i].priority){
                                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "RP")} >
                                        <option value="low" selected>Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                      </select>
                                      }else if(json.rows[i].priority === 1){
                                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "RP")}>
                                        <option value="low">Low</option>
                                        <option value="medium" selected>Medium</option>
                                        <option value="high">High</option>
                                      </select>
                                      }else if(json.rows[i].priority === 2){
                                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "RP")}>
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high" selected>High</option>
                                        </select>
                                      }
                                      row.observations = <input type="text" value={json.rows[i].observations} style={{width: "200px"}} onChange={(event)=>this.updateObservations(json.rows[i].incidence_number, event.target.value)}/>

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
                                      }else{
                                          row.status = "Rejected"
                                          row.color = "#rrr"
                                      }
                                      row.observations = json.rows[i].observations
                                    }
                                    rows.push(row)
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
                                    row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerISSpecPopUp incidence_number={json.rows[i].incidence_number} sending={json.rows[i].sending} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                                  }else{
                                    row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerISSpecPopUp incidence_number={json.rows[i].incidence_number} sending={json.rows[i].sending} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: "", key: json.rows[i].incidence_number}
                                  }
                                    if(secureStorage.getItem("role") === "3D Admin"){
                                      row["hours"] = <input style={{width: "55px"}} type="text" value={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                                      row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="RP" changeAdmin = {this.changeAdmin.bind(this)}/>
                                      if(json.rows[i].status === 0){
                                          row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "RP")} >
                                          <option value="pending" selected>Pending</option>
                                          <option value="progress">In progress</option>
                                          <option value="ready">Ready</option>
                                          <option value="rejected">Rejected</option>
                                        </select>
                                          row.color = "#www"
                                      }else if(json.rows[i].status === 1){
                                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "RP")}>
                                        <option value="pending">Pending</option>
                                        <option value="progress" selected style={{backgroundColor:"#yyy"}}>In progress</option>
                                        <option value="ready">Ready</option>
                                        <option value="rejected">Rejected</option>
                                      </select>
                                          row.color = "#yyy"
                                      }else if(json.rows[i].status === 2){
                                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "RP")}>
                                        <option value="pending">Pending</option>
                                        <option value="progress">In progress</option>
                                        <option value="ready" selected>Ready</option>
                                        <option value="rejected">Rejected</option>
                                        </select>
                                          row.color = "#ggg"
                                      }else{
                                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "RP")}>
                                        <option value="pending">Pending</option>
                                        <option value="progress">In progress</option>
                                        <option value="ready">Ready</option>
                                        <option value="rejected" selected>Rejected</option>
                                       </select>
                                          row.color = "#rrr"
                                      }

                                      if(json.rows[i].priority === 0 || !json.rows[i].priority){
                                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "RP")} >
                                        <option value="low" selected>Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                      </select>
                                      }else if(json.rows[i].priority === 1){
                                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "RP")}>
                                        <option value="low">Low</option>
                                        <option value="medium" selected>Medium</option>
                                        <option value="high">High</option>
                                      </select>
                                      }else if(json.rows[i].priority === 2){
                                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "RP")}>
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high" selected>High</option>
                                        </select>
                                      }
                                      row.observations = <input type="text" value={json.rows[i].observations} style={{width: "200px"}} onChange={(event)=>this.updateObservations(json.rows[i].incidence_number, event.target.value)}/>

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
                                      }else{
                                          row.status = "Rejected"
                                          row.color = "#rrr"
                                      }
                                      row.observations = json.rows[i].observations
                                    }
                                    rows.push(row)
                                }
                              }
                              

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
                
                                this.setState({data : rows, displayData: rows});
                                await this.setState({filters : filterRow})

                            })

                        })

                    })

                })

            })
            
        })

  }


  async componentDidUpdate(prevProps, prevState){
    if(prevProps !== this.props){

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
          var row = null
          if(json.rows){
            for(let i = 0; i < json.rows.length; i++){
                let carta = ""
                if(json.rows[i].carta){
                  carta = " - " + json.rows[i].carta
                }
                if(json.rows[i].attach === 1){
                  if(json.rows[i].accept_reject_date != null){
                    
                    row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNWCSpecPopUp incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19).toString().substring(0,10), key: json.rows[i].incidence_number}
                  }else{
                    row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNWCSpecPopUp incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: "", key: json.rows[i].incidence_number}
                  }
                }else{
                  if(json.rows[i].accept_reject_date != null){
                    row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNWCSpecPopUp incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                  }else{
                    row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNWCSpecPopUp incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: "", key: json.rows[i].incidence_number}
                  }
                }

                if(secureStorage.getItem("role") === "3D Admin"){
                  row["hours"] = <input style={{width: "55px"}} type="text" value={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                  row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="NWC" changeAdmin = {this.changeAdmin.bind(this)}/>
                  if(json.rows[i].status === 0){
                      row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NWC")} >
                      <option value="pending" selected>Pending</option>
                      <option value="progress">In progress</option>
                      <option value="ready">Ready</option>
                      <option value="rejected">Rejected</option>
                    </select>
                      row.color = "#www"
                  }else if(json.rows[i].status === 1){
                    row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NWC")}>
                    <option value="pending">Pending</option>
                    <option value="progress" selected style={{backgroundColor:"#yyy"}}>In progress</option>
                    <option value="ready">Ready</option>
                    <option value="rejected">Rejected</option>
                  </select>
                      row.color = "#yyy"
                  }else if(json.rows[i].status === 2){
                    row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NWC")}>
                    <option value="pending">Pending</option>
                    <option value="progress">In progress</option>
                    <option value="ready" selected>Ready</option>
                    <option value="rejected">Rejected</option>
                    </select>
                      row.color = "#ggg"
                  }else{
                    row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NWC")}>
                    <option value="pending">Pending</option>
                    <option value="progress">In progress</option>
                    <option value="ready">Ready</option>
                    <option value="rejected" selected>Rejected</option>
                   </select>
                      row.color = "#rrr"
                  }

                  if(json.rows[i].priority === 0 || !json.rows[i].priority){
                    row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NWC")} >
                    <option value="low" selected>Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  }else if(json.rows[i].priority === 1){
                    row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NWC")}>
                    <option value="low">Low</option>
                    <option value="medium" selected>Medium</option>
                    <option value="high">High</option>
                  </select>
                  }else if(json.rows[i].priority === 2){
                    row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NWC")}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high" selected>High</option>
                    </select>
                  }

                  row.observations = <input style={{width: "200px"}} type="text" value={json.rows[i].observations} onChange={(event)=>this.updateObservations(json.rows[i].incidence_number, event.target.value)}/>

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
                  }else{
                      row.status = "Rejected"
                      row.color = "#rrr"
                  }

                  row.observations = json.rows[i].observations
                }
                
                rows.push(row)
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
                      row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19).toString().substring(0,10), key: json.rows[i].incidence_number}
                    }else{
                      row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: "", key: json.rows[i].incidence_number}
                    }
                  }else{
                    if(json.rows[i].accept_reject_date != null){
                      row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                    }else{
                      row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNVNSpecPopUp name={json.rows[i].name} incidence_number={json.rows[i].incidence_number} spref={json.rows[i].spref} description={json.rows[i].description}/>, ar_date: "", key: json.rows[i].incidence_number}
                    }
                  }
                    if(secureStorage.getItem("role") === "3D Admin"){
                      row["hours"] = <input style={{width: "55px"}} type="text" value={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                      row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="NVN" changeAdmin = {this.changeAdmin.bind(this)}/>
                      if(json.rows[i].status === 0){
                          row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NVN")} >
                          <option value="pending" selected>Pending</option>
                          <option value="progress">In progress</option>
                          <option value="ready">Ready</option>
                          <option value="rejected">Rejected</option>
                        </select>
                          row.color = "#www"
                      }else if(json.rows[i].status === 1){
                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NVN")}>
                        <option value="pending">Pending</option>
                        <option value="progress" selected style={{backgroundColor:"#yyy"}}>In progress</option>
                        <option value="ready">Ready</option>
                        <option value="rejected">Rejected</option>
                      </select>
                          row.color = "#yyy"
                      }else if(json.rows[i].status === 2){
                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NVN")}>
                        <option value="pending">Pending</option>
                        <option value="progress">In progress</option>
                        <option value="ready" selected>Ready</option>
                        <option value="rejected">Rejected</option>
                        </select>
                          row.color = "#ggg"
                      }else{
                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NVN")}>
                        <option value="pending">Pending</option>
                        <option value="progress">In progress</option>
                        <option value="ready">Ready</option>
                        <option value="rejected" selected>Rejected</option>
                       </select>
                          row.color = "#rrr"
                      }
                      if(json.rows[i].priority === 0 || !json.rows[i].priority){
                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NVN")} >
                        <option value="low" selected>Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                      }else if(json.rows[i].priority === 1){
                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NVN")}>
                        <option value="low">Low</option>
                        <option value="medium" selected>Medium</option>
                        <option value="high">High</option>
                      </select>
                      }else if(json.rows[i].priority === 2){
                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NVN")}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high" selected>High</option>
                        </select>
                      }
                      row.observations = <input type="text" value={json.rows[i].observations} style={{width: "200px"}} onChange={(event)=>this.updateObservations(json.rows[i].incidence_number, event.target.value)}/>

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
                      }else{
                          row.status = "Rejected"
                          row.color = "#rrr"
                      }

                      row.observations = json.rows[i].observations
                    }
                    rows.push(row)
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
                          row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNRISpecPopUp incidence_number={json.rows[i].incidence_number} pipe={json.rows[i].pipe} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19).toString().substring(0,10),key: json.rows[i].incidence_number}
                        }else{
                          row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNRISpecPopUp incidence_number={json.rows[i].incidence_number} pipe={json.rows[i].pipe} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: "", key: json.rows[i].incidence_number}
                        }
                      }else{
                        if(json.rows[i].accept_reject_date != null){
                          row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNRISpecPopUp incidence_number={json.rows[i].incidence_number} pipe={json.rows[i].pipe} description={json.rows[i].description}/>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                        }else{
                          row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNRISpecPopUp incidence_number={json.rows[i].incidence_number} pipe={json.rows[i].pipe} description={json.rows[i].description}/>, ar_date: "", key: json.rows[i].incidence_number}
                        }
                      }
                        if(secureStorage.getItem("role") === "3D Admin"){
                          row["hours"] = <input style={{width: "55px"}} type="text" value={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                          row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="NRI" changeAdmin = {this.changeAdmin.bind(this)}/>
                          if(json.rows[i].status === 0){
                              row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRI")} >
                              <option value="pending" selected>Pending</option>
                              <option value="progress">In progress</option>
                              <option value="ready">Ready</option>
                              <option value="rejected">Rejected</option>
                            </select>
                              row.color = "#www"
                          }else if(json.rows[i].status === 1){
                            row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRI")}>
                            <option value="pending">Pending</option>
                            <option value="progress" selected style={{backgroundColor:"#yyy"}}>In progress</option>
                            <option value="ready">Ready</option>
                            <option value="rejected">Rejected</option>
                          </select>
                              row.color = "#yyy"
                          }else if(json.rows[i].status === 2){
                            row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRI")}>
                            <option value="pending">Pending</option>
                            <option value="progress">In progress</option>
                            <option value="ready" selected>Ready</option>
                            <option value="rejected">Rejected</option>
                            </select>
                              row.color = "#ggg"
                          }else{
                            row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRI")}>
                            <option value="pending">Pending</option>
                            <option value="progress">In progress</option>
                            <option value="ready">Ready</option>
                            <option value="rejected" selected>Rejected</option>
                           </select>
                              row.color = "#rrr"
                          }

                          if(json.rows[i].priority === 0 || !json.rows[i].priority){
                            row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRI")} >
                            <option value="low" selected>Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                          }else if(json.rows[i].priority === 1){
                            row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRI")}>
                            <option value="low">Low</option>
                            <option value="medium" selected>Medium</option>
                            <option value="high">High</option>
                          </select>
                          }else if(json.rows[i].priority === 2){
                            row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRI")}>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high" selected>High</option>
                            </select>
                          }
                          row.observations = <input type="text" value={json.rows[i].observations} style={{width: "200px"}} onChange={(event)=>this.updateObservations(json.rows[i].incidence_number, event.target.value)}/>

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
                          }else{
                              row.status = "Rejected"
                              row.color = "#rrr"
                          }

                          row.observations = json.rows[i].observations
                        }
                        rows.push(row)
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
                              row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNRISpecPopUp incidence_number={json.rows[i].incidence_number} pipe={json.rows[i].pipe} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19).toString().substring(0,10), key: json.rows[i].incidence_number}
                            }else{
                              row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerNRISpecPopUp incidence_number={json.rows[i].incidence_number} pipe={json.rows[i].pipe} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: "", key: json.rows[i].incidence_number}
                            }
                          }else{
                            if(json.rows[i].accept_reject_date != null){
                              row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNRISpecPopUp incidence_number={json.rows[i].incidence_number} pipe={json.rows[i].pipe} description={json.rows[i].description}/>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                            }else{
                              row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNRISpecPopUp incidence_number={json.rows[i].incidence_number} pipe={json.rows[i].pipe} description={json.rows[i].description}/>, ar_date: "", key: json.rows[i].incidence_number}
                            }
                          }
                            if(secureStorage.getItem("role") === "3D Admin"){
                              row["hours"] = <input style={{width: "55px"}} type="text" value={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                              row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="NRB" changeAdmin = {this.changeAdmin.bind(this)}/>
                              if(json.rows[i].status === 0){
                                  row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRB")} >
                                  <option value="pending" selected>Pending</option>
                                  <option value="progress">In progress</option>
                                  <option value="ready">Ready</option>
                                  <option value="rejected">Rejected</option>
                                </select>
                                  row.color = "#www"
                              }else if(json.rows[i].status === 1){
                                row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRB")}>
                                <option value="pending">Pending</option>
                                <option value="progress" selected style={{backgroundColor:"#yyy"}}>In progress</option>
                                <option value="ready">Ready</option>
                                <option value="rejected">Rejected</option>
                              </select>
                                  row.color = "#yyy"
                              }else if(json.rows[i].status === 2){
                                row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRB")}>
                                <option value="pending">Pending</option>
                                <option value="progress">In progress</option>
                                <option value="ready" selected>Ready</option>
                                <option value="rejected">Rejected</option>
                                </select>
                                  row.color = "#ggg"
                              }else{
                                row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRB")}>
                                <option value="pending">Pending</option>
                                <option value="progress">In progress</option>
                                <option value="ready">Ready</option>
                                <option value="rejected" selected>Rejected</option>
                               </select>
                                  row.color = "#rrr"
                              }

                              if(json.rows[i].priority === 0 || !json.rows[i].priority){
                                row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRB")} >
                                <option value="low" selected>Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                              </select>
                              }else if(json.rows[i].priority === 1){
                                row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRB")}>
                                <option value="low">Low</option>
                                <option value="medium" selected>Medium</option>
                                <option value="high">High</option>
                              </select>
                              }else if(json.rows[i].priority === 2){
                                row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRB")}>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high" selected>High</option>
                                </select>
                              }

                              row.observations = <input type="text" value={json.rows[i].observations} style={{width: "200px"}} onChange={(event)=>this.updateObservations(json.rows[i].incidence_number, event.target.value)}/>
                            
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
                              }else{
                                  row.status = "Rejected"
                                  row.color = "#rrr"
                              }

                              row.observations = json.rows[i].observations
                            }
                            rows.push(row)
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
                                row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNRIDSSpecPopUp incidence_number={json.rows[i].incidence_number} name={json.rows[i].name}/>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                              }else{
                                row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerNRIDSSpecPopUp incidence_number={json.rows[i].incidence_number} name={json.rows[i].name}/>, ar_date: "", key: json.rows[i].incidence_number}
                              }
                                if(secureStorage.getItem("role") === "3D Admin"){
                                  row["hours"] = <input style={{width: "55px"}} type="text" value={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                                  row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="NRIDS" changeAdmin = {this.changeAdmin.bind(this)}/>
                                  if(json.rows[i].status === 0){
                                      row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRIDS")} >
                                      <option value="pending" selected>Pending</option>
                                      <option value="progress">In progress</option>
                                      <option value="ready">Ready</option>
                                      <option value="rejected">Rejected</option>
                                    </select>
                                      row.color = "#www"
                                  }else if(json.rows[i].status === 1){
                                    row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRIDS")}>
                                    <option value="pending">Pending</option>
                                    <option value="progress" selected style={{backgroundColor:"#yyy"}}>In progress</option>
                                    <option value="ready">Ready</option>
                                    <option value="rejected">Rejected</option>
                                  </select>
                                      row.color = "#yyy"
                                  }else if(json.rows[i].status === 2){
                                    row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRIDS")}>
                                    <option value="pending">Pending</option>
                                    <option value="progress">In progress</option>
                                    <option value="ready" selected>Ready</option>
                                    <option value="rejected">Rejected</option>
                                    </select>
                                      row.color = "#ggg"
                                  }else{
                                    row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRIDS")}>
                                    <option value="pending">Pending</option>
                                    <option value="progress">In progress</option>
                                    <option value="ready">Ready</option>
                                    <option value="rejected" selected>Rejected</option>
                                   </select>
                                      row.color = "#rrr"
                                  }

                                  if(json.rows[i].priority === 0 || !json.rows[i].priority){
                                    row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRIDS")} >
                                    <option value="low" selected>Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                  </select>
                                  }else if(json.rows[i].priority === 1){
                                    row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRIDS")}>
                                    <option value="low">Low</option>
                                    <option value="medium" selected>Medium</option>
                                    <option value="high">High</option>
                                  </select>
                                  }else if(json.rows[i].priority === 2){
                                    row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "NRIDS")}>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high" selected>High</option>
                                    </select>
                                  }
                                  row.observations = <input type="text" value={json.rows[i].observations} style={{width: "200px"}} onChange={(event)=>this.updateObservations(json.rows[i].incidence_number, event.target.value)}/>

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
                                  }else{
                                      row.status = "Rejected"
                                      row.color = "#rrr"
                                  }
                                  row.observations = json.rows[i].observations
                                }
                                rows.push(row)
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
                                    row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerRPSpecPopUp incidence_number={json.rows[i].incidence_number} items={json.rows[i].items_to_report} scope={json.rows[i].scope} description={json.rows[i].description}/>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                                  }else{
                                    row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <QtrackerRPSpecPopUp incidence_number={json.rows[i].incidence_number} items={json.rows[i].items_to_report} scope={json.rows[i].scope} description={json.rows[i].description}/>, ar_date: "", key: json.rows[i].incidence_number}
                                  }
                                    if(secureStorage.getItem("role") === "3D Admin"){
                                      row["hours"] = <input style={{width: "55px"}} type="text" value={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                                      row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="RP" changeAdmin = {this.changeAdmin.bind(this)}/>
                                      if(json.rows[i].status === 0){
                                          row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "RP")} >
                                          <option value="pending" selected>Pending</option>
                                          <option value="progress">In progress</option>
                                          <option value="ready">Ready</option>
                                          <option value="rejected">Rejected</option>
                                        </select>
                                          row.color = "#www"
                                      }else if(json.rows[i].status === 1){
                                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "RP")}>
                                        <option value="pending">Pending</option>
                                        <option value="progress" selected style={{backgroundColor:"#yyy"}}>In progress</option>
                                        <option value="ready">Ready</option>
                                        <option value="rejected">Rejected</option>
                                      </select>
                                          row.color = "#yyy"
                                      }else if(json.rows[i].status === 2){
                                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "RP")}>
                                        <option value="pending">Pending</option>
                                        <option value="progress">In progress</option>
                                        <option value="ready" selected>Ready</option>
                                        <option value="rejected">Rejected</option>
                                        </select>
                                          row.color = "#ggg"
                                      }else{
                                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "RP")}>
                                        <option value="pending">Pending</option>
                                        <option value="progress">In progress</option>
                                        <option value="ready">Ready</option>
                                        <option value="rejected" selected>Rejected</option>
                                       </select>
                                          row.color = "#rrr"
                                      }

                                      if(json.rows[i].priority === 0 || !json.rows[i].priority){
                                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "RP")} >
                                        <option value="low" selected>Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                      </select>
                                      }else if(json.rows[i].priority === 1){
                                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "RP")}>
                                        <option value="low">Low</option>
                                        <option value="medium" selected>Medium</option>
                                        <option value="high">High</option>
                                      </select>
                                      }else if(json.rows[i].priority === 2){
                                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "RP")}>
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high" selected>High</option>
                                        </select>
                                      }
                                      row.observations = <input type="text" value={json.rows[i].observations} style={{width: "200px"}} onChange={(event)=>this.updateObservations(json.rows[i].incidence_number, event.target.value)}/>

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
                                      }else{
                                          row.status = "Rejected"
                                          row.color = "#rrr"
                                      }
                                      row.observations = json.rows[i].observations
                                    }
                                    rows.push(row)
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
                                    row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerISSpecPopUp incidence_number={json.rows[i].incidence_number} sending={json.rows[i].sending} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19), key: json.rows[i].incidence_number}
                                  }else{
                                    row = {incidence_number: json.rows[i].incidence_number, project: json.rows[i].project + carta + " (" + json.rows[i].code + ")", user: json.rows[i].user, description: json.rows[i].description, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), specifications: <div><QtrackerISSpecPopUp incidence_number={json.rows[i].incidence_number} sending={json.rows[i].sending} description={json.rows[i].description}/><img src={AttachIcon} alt="att" className="attach__icon" style={{marginRight:"0px"}}></img></div>, ar_date: "", key: json.rows[i].incidence_number}
                                  }
                                    if(secureStorage.getItem("role") === "3D Admin"){
                                      row["hours"] = <input style={{width: "55px"}} type="text" value={json.rows[i].hours} onChange={(event)=>this.updateHours(json.rows[i].incidence_number, event.target.value)}/>
                                      row["admin"] = <ChangeAdminPopUp updateData={this.state.updateData} admin = {json.rows[i].admin} incidence_number={json.rows[i].incidence_number} type="IS" changeAdmin = {this.changeAdmin.bind(this)}/>
                                      if(json.rows[i].status === 0){
                                          row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "IS")} >
                                          <option value="pending" selected>Pending</option>
                                          <option value="progress">In progress</option>
                                          <option value="ready">Ready</option>
                                          <option value="rejected">Rejected</option>
                                        </select>
                                          row.color = "#www"
                                      }else if(json.rows[i].status === 1){
                                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "IS")}>
                                        <option value="pending">Pending</option>
                                        <option value="progress" selected style={{backgroundColor:"#yyy"}}>In progress</option>
                                        <option value="ready">Ready</option>
                                        <option value="rejected">Rejected</option>
                                      </select>
                                          row.color = "#yyy"
                                      }else if(json.rows[i].status === 2){
                                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "IS")}>
                                        <option value="pending">Pending</option>
                                        <option value="progress">In progress</option>
                                        <option value="ready" selected>Ready</option>
                                        <option value="rejected">Rejected</option>
                                        </select>
                                          row.color = "#ggg"
                                      }else{
                                        row.status = <select name="status" id="status" onChange={(event)=> this.statusChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "IS")}>
                                        <option value="pending">Pending</option>
                                        <option value="progress">In progress</option>
                                        <option value="ready">Ready</option>
                                        <option value="rejected" selected>Rejected</option>
                                       </select>
                                          row.color = "#rrr"
                                      }

                                      if(json.rows[i].priority === 0 || !json.rows[i].priority){
                                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "IS")} >
                                        <option value="low" selected>Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                      </select>
                                      }else if(json.rows[i].priority === 1){
                                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "IS")}>
                                        <option value="low">Low</option>
                                        <option value="medium" selected>Medium</option>
                                        <option value="high">High</option>
                                      </select>
                                      }else if(json.rows[i].priority === 2){
                                        row.priority = <select name="priority" id="priority" onChange={(event)=> this.priorityChange(json.rows[i].incidence_number, event.target.value, json.rows[i].project, "IS")}>
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high" selected>High</option>
                                        </select>
                                      }
                                      row.observations = <input type="text" value={json.rows[i].observations} style={{width: "200px"}} onChange={(event)=>this.updateObservations(json.rows[i].incidence_number, event.target.value)}/>

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
                                      }else{
                                          row.status = "Rejected"
                                          row.color = "#rrr"
                                      }
                                      row.observations = json.rows[i].observations
                                    }
                                    rows.push(row)
                                }
                              }

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
                                this.setState({data : rows, displayData: rows});
                                await this.setState({filters : filterRow})

                            })

                        })

                    })

                })

            })
            
        })

      }
    

  }

  async changeAdmin(admin, incidence_number, type){
    this.props.changeAdmin(admin, incidence_number, type)
  }
  

  async filter(column, value){
    let fd = this.state.filterData
    fd[column] = value
    await this.setState({filterData: fd})

    let auxDisplayData = this.state.data
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

                if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].props.children[p].props.children.includes(this.state.filterData[column])){
                  exists = false
                }
              }
            }
          }else if(auxDisplayData[i][fil]){
            if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].includes(this.state.filterData[column])){
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
                if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].props.children[p].props.children.includes(this.state.filterData[column])){
                  exists = false
                }
              }
            }
          }else if(auxDisplayData[i][fil]){
            if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].includes(this.state.filterData[column])){
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
              if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].props.admin.includes(this.state.filterData[column])){
                exists = false
              }
            }
            
          }else if(auxDisplayData[i][fil]){
            if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].includes(this.state.filterData[column])){
              exists = false
            }
          }else{
            if(this.state.filterData[column] !== "" && this.state.filterData[column]){
              exists = false
            }
          }
        }else{
          
          if(this.state.filterData[column]){
            if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].includes(this.state.filterData[column])){
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

    let auxDisplayData = this.state.data
    let resultData = []
    let fil, exists = null
    
    for(let i = 0; i < auxDisplayData.length; i++){
      exists = true
      
      for(let column = 0; column < Object.keys(auxDisplayData[i]).length-1; column ++){
        
        fil = Object.keys(auxDisplayData[i])[column]
          //console.log(fil, column)
          if(this.state.filterData[column]){
            if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].includes(this.state.filterData[column])){
              exists = false
            }
          }
      }
      console.log(exists)
      if(exists){
        resultData.push(auxDisplayData[i])
      }
    }
    await this.setState({displayData: resultData})
  }


  async updateObservations(incidence_number, observations){
    let observationsAux = this.state.observations
    observationsAux[incidence_number] = observations
    await this.setState({observations: observationsAux})
    this.props.updateObservations(this.state.observations)
  }

  async updateHours(incidence_number, hours){
    let hoursAux = this.state.hours
    hoursAux[incidence_number] = hours
    await this.setState({hours: hoursAux})
    await this.props.updateHours(hoursAux)
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
      },
      {
        title: <div className="dataTable__header__text">Date</div>,
        dataIndex: 'created_at',
        key: 'created_at',
        ...this.getColumnSearchProps('created_at'),
        sorter: {
          compare: (a, b) => { return a.created_at.localeCompare(b.created_at)},
        },
        
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
        width:"215px"
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
        width: "270px"
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
        },
        {
          title: <div className="dataTable__header__text">Date</div>,
          dataIndex: 'created_at',
          key: 'created_at',
          ...this.getColumnSearchProps('created_at'),
          sorter: {
            compare: (a, b) => { return a.created_at.localeCompare(b.created_at)},
          },
          
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
          width:"215px"
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
          width: "270px"
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
    }else{
      totalElements = (<div style={{position: "absolute", bottom: 140, left:120}}>
      <b>Total elements: {this.state.data.length}</b>
     </div>);
    }

    return (
      <div>
        {this.state.updateData}
        <div className="estimatedDataTable__container" style={{width:"auto"}}>
        <Table className="customTable" bordered = {true} columns={columns} dataSource={this.state.displayData} style={{ height: '540px' }} scroll={{y:437}} pagination={{disabled:true, defaultPageSize:5000}} size="small"
         rowClassName= {(record) => record.color.replace('#', '')}/>
          <Table className="filter__table" pagination={{disabled:true}} scroll={{y:437}} showHeader = {false} bordered = {true} columns={columns} dataSource={this.state.filters} size="small"/> 
          {totalElements}
        </div>
        
      </div>
    );
  }
}

export default QTrackerViewDataTable;