import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './projectsTreeGrid.css'
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';
import Handsontable from 'handsontable';

import SaveIcon from "../../assets/images/save.svg"
import BackIcon from "../../assets/images/back.svg"


class ProjectsTreeGrid extends Component {

  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        { field: 'project', rowGroup: true, hide: true },
        { field: 'task', rowGroup: true, hide: true, headerClass: 'header-custom'},
        { field: 'subtask', checkboxSelection: true, hide: true, width:20, headerClass: 'header-custom'},
        { field: 'hours', headerClass: 'header-custom'}
      ],
      defaultColDef: {
        resizable: true,
        flex: 2
      },
      autoGroupColumnDef: {
        headerClass: 'header-custom',
        headerName: 'Projects and tasks',
        field: 'subtask',
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
          checkbox: true,
        },
      },
      rowSelection: 'multiple',
      rowData: null,
      tree_nodes: [],
      rowStyle:{fontSize: "22px", fontFamily: "Quicksand, sans-serif"},
      initial_nodes: [],
      removed_nodes: [],
      tasks: [],
      subtasks: [],
      tasksNames: [],
      updateData: false
    };
    
  }

  async componentDidMount(){

    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getTasks", options)
      .then(response => response.json())
      .then(async json => {
        let tasks = []
        let tasksNames = []
        let subtasks =[]
        for(let i = 1; i < json.tasks.length; i++){
          let ts = []
          Object.entries(json.tasks[i])
          .map( ([key, value]) =>  ts.push([key, value]))
          tasks.push({"Task": ts[0][0], "id": ts[0][1]})
          tasksNames.push(ts[0][0])
          for(let j = 1; j < ts.length; j++){
            fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getSubtaskHours/"+ts[j][1], options)
            .then(response => response.json())
            .then(json => {
              if(ts[j][0] !== "null"){
                subtasks.push({"Task": ts[0][0], "Subtask": ts[j][0], "Hours": json.hours, "id": ts[j][1]})
              }
            })
          }
        }
        await this.setState({tasks : tasks, subtasks: subtasks, tasksNames: tasksNames});
    })
  }


  addRowTasks(){
    let rows = this.state.tasks
    rows.push({"Task": "", "id": ""})
    this.setState({tasks: rows})
  }

  addRowSubtasks(){
    let rows = this.state.subtasks
    rows.push({"Task": "", "Subtask": "", "Hours": "", "id": ""})
    this.setState({subtasks: rows})
  }

  onGridReady = async(params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    
    const options = {
      method: "GET",
      headers: {
          "Content-Type": "application/json"
      },
    }
    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getProjectsTreeData", options)
    .then(response => response.json())
    .then(async json => {
        let tree_nodes = []
        let node = {}
        for(let i = 0; i < json.rows.length; i++){
            node = {project: json.rows[i].project, task: json.rows[i].task, subtask: json.rows[i].subtask, hours: json.rows[i].hours}
            if(node){
                tree_nodes.push(node)
            }
            
        }
        await this.setState({tree_nodes: tree_nodes})

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getAllPTS", options)
    .then(response => response.json())
    .then(async json => {
        let nodes = []
        const projects = json.projects
        const tasks = json.tasks

        for(let i = 0; i < projects.length; i ++){
          for(let j = 0; j < tasks.length; j ++){
            let node = {project: projects[i].name, task: tasks[j].task, subtask:tasks[j].subtask, hours: tasks[j].hours}
            if(this.state.tree_nodes.some(e => e.project === node.project && e.task === node.task && e.subtask === node.subtask && e.hours === node.hours)) {
              node["checked"] = true
            }else{
              node["checked"] = false
            }
            nodes.push(node)
          }
        }
        await this.setState({rowData: nodes})
    })

    
    })
    await this.gridApi.forEachNode(node => {
      if(node.data){
        if(node.data.checked === true){
          node.setSelected(true)
        }
      }
    });

    let initial_nodes = []

    for(let i = 0; i < this.gridApi.getSelectedNodes().length; i++){
      initial_nodes.push(this.gridApi.getSelectedNodes()[i].data)
    }
    
    await this.setState({initial_nodes: initial_nodes})

  };

  isRowSelectable = function(rowNode) {
    return rowNode.data ? rowNode.data.subtask : false;
  }

  async saveChanges(){

    let new_nodes = []
    let removed_nodes = []
    let current_nodes = []

    for(let i = 0; i < this.gridApi.getSelectedNodes().length; i++){
      current_nodes.push(this.gridApi.getSelectedNodes()[i].data)
    }

    for(let i = 0; i < current_nodes.length; i++){
      if(!this.state.initial_nodes.some(e => e.project === current_nodes[i].project && e.task === current_nodes[i].task && e.subtask === current_nodes[i].subtask && e.hours === current_nodes[i].hours)){
        new_nodes.push(current_nodes[i])
      }
    }

    for(let i = 0; i < this.state.initial_nodes.length; i++){
      if(!current_nodes.some(e => e.project === this.state.initial_nodes[i].project && e.task === this.state.initial_nodes[i].task && e.subtask === this.state.initial_nodes[i].subtask && e.hours === this.state.initial_nodes[i].hours)){
        removed_nodes.push(this.state.initial_nodes[i])
      }
    }

    let body = {
      new_nodes: new_nodes,
      removed_nodes: removed_nodes
    }

    let options = {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/submitProjectsChanges", options)
      .then(response => response.json())
      .then(json =>{

      })


    body = {
      rows: this.state.subtasks,
    }

    options = {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
  }

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/submitSubtasks", options)
      .then(response => response.json())
      .then(json =>{

      })
    body = {
      rows: this.state.tasks,
    }

    options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }
    
    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/submitTasks", options)
    .then(response => response.json())
    .then(json =>{
    })
    
    options = {
      method: "GET",
      headers: {
          "Content-Type": "application/json"
      },
    }
 
    setTimeout(async ()=> 
      await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getTasks", options)
      .then(response => response.json())
      .then(async json => {
        let tasks = []
        let tasksNames = []
        let subtasks =[]
        for(let i = 1; i < json.tasks.length; i++){
          let ts = []
          Object.entries(json.tasks[i])
          .map( ([key, value]) =>  ts.push([key, value]))
          tasks.push({"Task": ts[0][0], "id": ts[0][1]})
          tasksNames.push(ts[0][0])
          for(let j = 1; j < ts.length; j++){
            await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getSubtaskHours/"+ts[j][1], options)
            .then(response => response.json())
            .then(json => {
              if(ts[j][0] !== "null"){
                subtasks.push({"Task": ts[0][0], "Subtask": ts[j][0], "Hours": json.hours, "id": ts[j][1]})
              }
            })
          }
        }
        await this.setState({tasks : tasks, subtasks: subtasks, tasksNames: tasksNames});
      })
    , 500);

    options = {
      method: "GET",
      headers: {
          "Content-Type": "application/json"
      },
    }

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getAllPTS", options)
    .then(response => response.json())
    .then(async json => {
        let nodes = []
        const projects = json.projects
        const tasks = json.tasks
        for(let i = 0; i < projects.length; i ++){
          for(let j = 0; j < tasks.length; j ++){
            let node = {project: projects[i].name, task: tasks[j].task, subtask:tasks[j].subtask, hours: tasks[j].hours}
            if(this.state.tree_nodes.some(e => e.project === node.project && e.task === node.task && e.subtask === node.subtask && e.hours === node.hours)) {
              node["checked"] = true
            }else{
              node["checked"] = false
            }
            nodes.push(node)
          }
        }
        await this.setState({rowData: nodes})    
    })

    let initial_nodes = []

    for(let i = 0; i < this.gridApi.getSelectedNodes().length; i++){
      initial_nodes.push(this.gridApi.getSelectedNodes()[i].data)
    }
    
    await this.setState({initial_nodes: initial_nodes})
  }

  
  render() {
    
    
    let settingsTasks = {
      licenseKey: 'non-commercial-and-evaluation',
      colWidths: 1000,
      
      className:'excel'
    }

    let settingsSubtasks= {
      licenseKey: 'non-commercial-and-evaluation',
      colWidths: 333,
    }

    return (
      <div>
      <div style={{marginTop: "140px"}}>
      <button className="projects__button" onClick={()=>this.props.back()} style={{width:"175px", marginLeft:"-1603px"}}><img src={BackIcon} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="projects__button__text">Back to menu</p></button>
      <button className="projects__button" onClick={()=>this.saveChanges()} style={{width:"175px", marginLeft:"20px"}}><img src={SaveIcon} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="projects__button__text">Save</p></button>
      </div>
      <div style={{display: "flex"}}>
        
        <div style={{ width: '40%', height: '70%', marginTop:"55px", marginLeft:"200px"}}>
          <div
            style={{
              height: '800px',
              width: '800px',
            }}
            className="ag-theme-alpine"
          >

            <AgGridReact
              columnDefs={this.state.columnDefs}
              defaultColDef={this.state.defaultColDef}
              autoGroupColumnDef={this.state.autoGroupColumnDef}
              rowSelection={this.state.rowSelection}
              suppressRowClickSelection={true}
              suppressAggFuncInHeader={true}
              onGridReady={this.onGridReady}
              rowData={this.state.rowData}
              animateRows={true}
              isRowSelectable={this.isRowSelectable}
              rowStyle={this.state.rowStyle}
            />
          </div>
        </div>
        <div id="hot-app" className="excel__container">
              <HotTable
                data={this.state.tasks}
                colHeaders = {["<b>Task</b>"]}
                rowHeaders={true}
                width="1200"
                
                height="300"
                rowHeights="25"
                settings={settingsTasks} 
                manualColumnResize={true}
                manualRowResize={true}
                columns= { [{data: "Task"}]}
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
              />
              <br></br>
              <center>
                  <button className="projects__add__button" onClick={()=>this.addRowTasks()} style={{width:"70px", marginBottom:"50px", height:"30px"}}><p className="projects__add__button__text">Add</p></button>
                </center>
              <HotTable
                data={this.state.subtasks}
                colHeaders = {["<b>Task</b>", "<b>Subtask</b>", "<b>Hours</b>"]}
                rowHeaders={true}
                width="1200"
                
                height="300"
                rowHeights="25"
                settings={settingsSubtasks} 
                manualColumnResize={true}
                manualRowResize={true}
                columns= { [{data: "Task", type: Handsontable.cellTypes.dropdown, strict: true, source: this.state.tasksNames}, {data: "Subtask"}, {data: "Hours"}]}
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
              />
              <br></br>
              <center>
                  <button className="projects__add__button" onClick={()=>this.addRowSubtasks()} style={{width:"70px", height: "30px"}}><p className="projects__add__button__text">Add</p></button>
                </center>
            </div>
      </div>
      </div>
    );
  }
}

export default ProjectsTreeGrid;