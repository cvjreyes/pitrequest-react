import React, { Component } from 'react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './keyParamTreeGrid.css'
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';
import Handsontable from 'handsontable'
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import SaveIcon2 from "../../assets/images/SaveIcon2.svg"
import FolderIcon2 from "../../assets/images/FolderIcon2.svg"

class KeyParamTreeGrid extends Component{

  constructor(props) {
    super(props);

    this.state = {
      updateData: false,
      error: false,
      projects: [],
      tab: '1',
      specs: [],
      specs_projects : [],
      types_data: [],
      pcons: [],
      bolt_types: [],
      ratings: [],
      end_preparations: [],
      pids: []
    };
    
  }


  async componentDidMount(){

    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getSpecs", options)
      .then(response => response.json())
      .then(async json => {
          let spec_data = []
          for(let i = 0; i < json.specs.length; i++){
              spec_data.push(json.specs[i].spec)
          }
          await this.setState({specs: spec_data})
      })

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getSpecsByAllProjects", options)
    .then(response => response.json())
    .then(async json => {
        let spec_data = []
        for(let i = 0; i < json.specs.length; i++){
            spec_data.push({spec: json.specs[i].spec, project: json.specs[i].project})
        }
        await this.setState({specs_projects: spec_data})
    })

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getInstTypes", options)
    .then(response => response.json())
    .then(async json => {
        let types_data = []
        for(let i = 0; i < json.instrument_types.length; i++){
            types_data.push(json.instrument_types[i].type)
        }
        await this.setState({types_data: types_data})
    })

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getPComs", options)
    .then(response => response.json())
    .then(async json => {
        let pcons_data = []
        for(let i = 0; i < json.pcons.length; i++){
            pcons_data.push(json.pcons[i].name)
        }
        await this.setState({pcons: pcons_data})
    })

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/csptracker/boltTypes", options)
      .then(response => response.json())
      .then(async json => {
          let bolt_types_data = []
          for(let i = 0; i < json.rows.length; i++){
              bolt_types_data.push(json.rows[i].type)
          }
          await this.setState({bolt_types: bolt_types_data})
        })

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/csptracker/ratings", options)
      .then(response => response.json())
      .then(json => {
        var rows = []
        for(let i = 0; i < json.rows.length; i++){
            rows.push(json.rows[i].rating)
        }
        this.setState({ratings: rows});
  
      }) 

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/csptracker/endPreparations", options)
    .then(response => response.json())
    .then(json => {
      var rows = []
      for(let i = 0; i < json.rows.length; i++){
          rows.push(json.rows[i].state)
      }

      this.setState({end_preparations : rows});

    })

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getPIDs", options)
      .then(response => response.json())
      .then(async json => {
          let pids = []
          for(let i = 0; i < json.rows.length; i++){
              pids.push(json.rows[i].pid)
          }
          await this.setState({pids: pids})
      }) 

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getPIDsAllProjects", options)
      .then(response => response.json())
      .then(async json => {
          let pids = []
          for(let i = 0; i < json.rows.length; i++){
              pids.push({pid: json.rows[i].pid, project: json.rows[i].project})
          }
          await this.setState({pids_projects: pids})
      }) 
    
  }

  async componentDidUpdate(prevProps, prevState){
    if(this.props != prevProps){
      const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getSpecs", options)
      .then(response => response.json())
      .then(async json => {
          let spec_data = []
          for(let i = 0; i < json.specs.length; i++){
              spec_data.push(json.specs[i].spec)
          }
          await this.setState({specs: spec_data})
      })

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getSpecsByAllProjects", options)
    .then(response => response.json())
    .then(async json => {
        let spec_data = []
        for(let i = 0; i < json.specs.length; i++){
            spec_data.push({spec: json.specs[i].spec, project: json.specs[i].project})
        }
        await this.setState({specs_projects: spec_data})
    })

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getInstTypes", options)
    .then(response => response.json())
    .then(async json => {
        let types_data = []
        for(let i = 0; i < json.instrument_types.length; i++){
            types_data.push(json.instrument_types[i].type)
        }
        await this.setState({types_data: types_data})
    })

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getPComs", options)
    .then(response => response.json())
    .then(async json => {
        let pcons_data = []
        for(let i = 0; i < json.pcons.length; i++){
            pcons_data.push(json.pcons[i].name)
        }
        await this.setState({pcons: pcons_data})
    })

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/csptracker/boltTypes", options)
      .then(response => response.json())
      .then(async json => {
          let bolt_types_data = []
          for(let i = 0; i < json.rows.length; i++){
              bolt_types_data.push(json.rows[i].type)
          }
          await this.setState({bolt_types: bolt_types_data})
        })

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/csptracker/ratings", options)
      .then(response => response.json())
      .then(json => {
        var rows = []
        for(let i = 0; i < json.rows.length; i++){
            rows.push(json.rows[i].rating)
        }
        this.setState({ratings: rows});
  
      }) 

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/csptracker/endPreparations", options)
    .then(response => response.json())
    .then(json => {
      var rows = []
      for(let i = 0; i < json.rows.length; i++){
          rows.push(json.rows[i].state)
      }

      this.setState({end_preparations : rows});

    })

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getPIDs", options)
      .then(response => response.json())
      .then(async json => {
          let pids = []
          for(let i = 0; i < json.rows.length; i++){
              pids.push(json.rows[i].pid)
          }
          await this.setState({pids: pids})
      }) 

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getPIDsAllProjects", options)
      .then(response => response.json())
      .then(async json => {
          let pids = []
          for(let i = 0; i < json.rows.length; i++){
              pids.push({pid: json.rows[i].pid, project: json.rows[i].project})
          }
          await this.setState({pids_projects: pids})
      }) 
    }
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
            node = {project: json.rows[i].project, software: json.rows[i].software, task: json.rows[i].task, subtask: json.rows[i].subtask, hours: json.rows[i].hours}
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
          let support_node = {project: projects[i].name, software: "Support", task: "Estimated", subtask:"Hours", hours: projects[i].sup_estihrs, checked: true}
          if(tasks){
            for(let j = 0; j < tasks.length; j ++){
              let node = {project: projects[i].name, software: tasks[j].software, task: tasks[j].task, subtask:tasks[j].subtask, hours: tasks[j].hours}
              if(this.state.tree_nodes.some(e => e.project === node.project && e.task === node.task && e.subtask === node.subtask && e.hours === node.hours)) {
                node["checked"] = true
                support_node.hours -= node.hours
              }else{
                node["checked"] = false
              }
              nodes.push(node)
            }
          }else{
            let node = {project: projects[i].name, task: "No tasks available", subtasks: null, hours: null}
            nodes.push(node)
          }
          nodes.push(support_node)
          
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
    return true;
  }
  
  async saveChanges(){

    await this.setState({error: false})

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
      .then(async json =>{
        if(!json.success){
          await this.setState({error: true})
        }
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
      .then(async json =>{
        if(!json.success){
          await this.setState({error: true})
        }
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
    .then(async json =>{
      if(!json.success){
        await this.setState({error: true})
      }
    })

    body = {
      rows: this.state.projects,
    }

    options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }
    if(this.state.projects){
      await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/submitProjectsHours", options)
      .then(response => response.json())
      .then(async json =>{
        if(!json.success){
          await this.setState({error: true})
        }
      })
      
      options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
      }
    }

    
 
  await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getTasks", options)
    .then(response => response.json())
    .then(async json => {
      let tasks = []
      let tasksNames = []
      let subtasks =[]
      if(json.tasks){
        for(let i = 1; i < json.tasks.length; i++){
          let ts = []
          Object.entries(json.tasks[i])
          .map( ([key, value]) =>  ts.push([key, value]))
          tasks.push({"Task": ts[0][0], "id": ts[0][1], "Software": json.tasks[i]["software"]})
          if(ts[0][0]){
            tasksNames.push(ts[0][0])
          }
          for(let j = 1; j < ts.length; j++){
            if(ts[j][0] !== "software"){
              fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getSubtaskHours/"+ts[j][1], options)
              .then(response => response.json())
              .then(json => {
                if(ts[j][0] !== "null"){
                  subtasks.push({"Task": ts[0][0], "Subtask": ts[j][0], "Hours": json.hours, "id": ts[j][1]})
                }
              })
            }
          }
        }
      }
      
      await this.setState({tasks : tasks, subtasks: subtasks, tasksNames: tasksNames});
  })
    options = {
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
            node = {project: json.rows[i].project, software: json.rows[i].software, task: json.rows[i].task, subtask: json.rows[i].subtask, hours: json.rows[i].hours}
            if(node){
                tree_nodes.push(node)
            }
        }
        await this.setState({tree_nodes: tree_nodes})
      })
      
    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getAllPTS", options)
    .then(response => response.json())
    .then(async json => {
        let nodes = []
        const projects = json.projects
        const tasks = json.tasks
        for(let i = 0; i < projects.length; i ++){
          let support_node = {project: projects[i].name, software: "Support", task: "Estimated", subtask:"Hours", hours: projects[i].sup_estihrs, checked: true}
          if(tasks){
            for(let j = 0; j < tasks.length; j ++){
              let node = {project: projects[i].name, software: tasks[j].software, task: tasks[j].task, subtask:tasks[j].subtask, hours: tasks[j].hours}
              if(this.state.tree_nodes.some(e => e.project === node.project && e.task === node.task && e.subtask === node.subtask && e.hours === node.hours)) {
                node["checked"] = true
                support_node.hours -= node.hours
              }else{
                node["checked"] = false
              }
              nodes.push(node)
            }
          }else{
            let node = {project: projects[i].name, task: "No tasks available", subtasks: null, hours: null}
            nodes.push(node)
          }
          nodes.push(support_node)
          
        }
        await this.setState({rowData: nodes})    
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

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getProjectsWithHours", options)
      .then(response => response.json())
      .then(async json => {
        let projects = []
        if(json.projects){
          for(let i = 0; i < json.projects.length; i++){
            projects.push({"Project": json.projects[i].name, "Admin" : json.projects[i].admin, "Hours": json.projects[i].sup_estihrs, "id": json.projects[i].id, "Active": Boolean(json.projects[i].active)})
          }
        }else{
          projects.push({"Project": null, "Admin" : null, "Hours": null, "id": null, "Active":null})
        }
        await this.setState({projects : projects});
      })
      
    if(this.state.error){
      this.props.error()
    }else{
      this.props.success()
    }
  }

  _tabs = () => () => {

    const handleChange = (event, newValue) => {
      this.setState({tab: newValue})
    };

    let settingsProjects = {
      licenseKey: 'non-commercial-and-evaluation',
      colWidths: 400,
    }

    let settingsTasks = {
      licenseKey: 'non-commercial-and-evaluation',
      colWidths: 439,
      className:'excel'
    }

    let settingsSubtasks= {
      licenseKey: 'non-commercial-and-evaluation',
      colWidths: 400,
    }

    return <div >{ 
      <Box sx={{ width: '100%', marginTop: '3px'}}>
        <TabContext value={this.state.tab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} centered>
              <Tab label="Specs" value="1" style={{fontSize: '22px', textTransform: 'capitalize', fontFamily:'Montserrat'}} />
              <Tab label="Specs by Project" value="2" style={{fontSize: '22px', textTransform: 'capitalize', fontFamily:'Montserrat'}}/>
              <Tab label="Generic" value="3" style={{fontSize: '22px', textTransform: 'capitalize', fontFamily:'Montserrat'}}/>
              <Tab label="PComs" value="4" style={{fontSize: '22px', textTransform: 'capitalize', fontFamily:'Montserrat'}}/>
              <Tab label="Bolt Types" value="5" style={{fontSize: '22px', textTransform: 'capitalize', fontFamily:'Montserrat'}}/>
              <Tab label="Ratings" value="6" style={{fontSize: '22px', textTransform: 'capitalize', fontFamily:'Montserrat'}}/>
              <Tab label="End preparation" value="7" style={{fontSize: '22px', textTransform: 'capitalize', fontFamily:'Montserrat'}}/>
              <Tab label="PIDs" value="8" style={{fontSize: '22px', textTransform: 'capitalize', fontFamily:'Montserrat'}}/>
              <Tab label="PIDs by Project" value="9" style={{fontSize: '22px', textTransform: 'capitalize', fontFamily:'Montserrat'}}/>
            </TabList>
          </Box>
          <TabPanel value="1" centered>
          <div className="excel__container__2" style={{marginLeft: "430px"}}>
            <HotTable
              data={this.state.projects}
              colHeaders = {["<b>Project</b>"]}
              rowHeaders={false}
              width="400"
              className="custom__table__2"
              height="775"
              rowHeights="38"
              settings={settingsProjects} 
              manualColumnResize={true}
              manualRowResize={true}
              columns= { [{data: "Admin", type: Handsontable.cellTypes.dropdown, strict:true, source: this.state.admins}]}
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
            </div>
            <div style={{display: "flex", float:"center"}} >
              <div style={{marginTop:"20px", marginLeft: "520px"}}>
                <button className="projects__add__button" type="button" onClick={()=> this.addRowTasks()} style={{width:"70px"}}><p className="projects__add__button__text">+ Add</p></button>
              </div>
            </div>
          </TabPanel>
          <TabPanel value="2">
            <div id="hot-app" className="excel__container" style={{marginLeft: "175px"}}>
              <HotTable
                data={this.state.tasks}
                colHeaders = {["<b>Specs</b>", "<b>Project</b>"]}
                rowHeaders={false}
                width="900"
                height="775"
                className="custom__table__1"
                rowHeights="38"
                settings={settingsTasks} 
                manualColumnResize={true}
                manualRowResize={true}
                columns= { [{data: "Software", type: Handsontable.cellTypes.dropdown, strict: true, source: this.state.softwares},{data: "Task"}]}
                filters={false}
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
            </div>
            <div style={{display: "flex", float:"center"}} >
              <div style={{marginLeft: "520px"}}>
                <button className="projects__add__button" type="button" onClick={()=> this.addRowTasks()} style={{width:"70px"}}><p className="projects__add__button__text">+ Add</p></button>
              </div>
            </div>
          </TabPanel>
          <TabPanel value="3">
            <div id="hot-app" className="excel__container" style={{marginLeft: "430px"}}>
              <HotTable
                data={this.state.subtasks}
                colHeaders = {["<b>Generic</b>"]}
                rowHeaders={false}
                width="400"
                height="775"
                className="custom__table__3"
                rowHeights="38"
                settings={settingsSubtasks} 
                manualColumnResize={true}
                manualRowResize={true}
                columns= { [{data: "Task", type: Handsontable.cellTypes.dropdown, strict: true, source: this.state.tasksNames}]}
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
              </div>
              <div style={{display: "flex"}}>
                <div style={{marginLeft:"520px"}}>
                  <button className="projects__add__button" onClick={()=>this.addRowSubtasks()} style={{width:"70px"}}><p className="projects__add__button__text">+ Add</p></button>
                </div>
              </div>
          </TabPanel>
          <TabPanel value="4">
            <div id="hot-app" className="excel__container" style={{marginLeft: "430px"}}>
              <HotTable
                data={this.state.subtasks}
                colHeaders = {["<b>Pcoms</b>"]}
                rowHeaders={false}
                width="400"
                height="775"
                className="custom__table__3"
                rowHeights="38"
                settings={settingsSubtasks} 
                manualColumnResize={true}
                manualRowResize={true}
                columns= { [{data: "Task", type: Handsontable.cellTypes.dropdown, strict: true, source: this.state.tasksNames}]}
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
              </div>
              <div style={{display: "flex"}}>
                <div style={{marginLeft:"520px"}}>
                  <button className="projects__add__button" onClick={()=>this.addRowSubtasks()} style={{width:"70px"}}><p className="projects__add__button__text">+ Add</p></button>
                </div>
              </div>
          </TabPanel>
          <TabPanel value="5">
            <div id="hot-app" className="excel__container" style={{marginLeft: "430px"}}>
              <HotTable
                data={this.state.subtasks}
                colHeaders = {["<b>Bolt Types</b>"]}
                rowHeaders={false}
                width="400"
                height="775"
                className="custom__table__3"
                rowHeights="38"
                settings={settingsSubtasks} 
                manualColumnResize={true}
                manualRowResize={true}
                columns= { [{data: "Task", type: Handsontable.cellTypes.dropdown, strict: true, source: this.state.tasksNames}]}
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
              </div>
              <div style={{display: "flex"}}>
                <div style={{marginLeft:"520px"}}>
                  <button className="projects__add__button" onClick={()=>this.addRowSubtasks()} style={{width:"70px"}}><p className="projects__add__button__text">+ Add</p></button>
                </div>
              </div>
          </TabPanel>
          <TabPanel value="6">
            <div id="hot-app" className="excel__container" style={{marginLeft: "430px"}}>
              <HotTable
                data={this.state.subtasks}
                colHeaders = {["<b>Ratings</b>"]}
                rowHeaders={false}
                width="400"
                height="775"
                className="custom__table__3"
                rowHeights="38"
                settings={settingsSubtasks} 
                manualColumnResize={true}
                manualRowResize={true}
                columns= { [{data: "Task", type: Handsontable.cellTypes.dropdown, strict: true, source: this.state.tasksNames}]}
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
              </div>
              <div style={{display: "flex"}}>
                <div style={{marginLeft:"520px"}}>
                  <button className="projects__add__button" onClick={()=>this.addRowSubtasks()} style={{width:"70px"}}><p className="projects__add__button__text">+ Add</p></button>
                </div>
              </div>
          </TabPanel>
          <TabPanel value="7">
            <div id="hot-app" className="excel__container" style={{marginLeft: "430px"}}>
              <HotTable
                data={this.state.subtasks}
                colHeaders = {["<b>End Preparation</b>"]}
                rowHeaders={false}
                width="400"
                height="775"
                className="custom__table__3"
                rowHeights="38"
                settings={settingsSubtasks} 
                manualColumnResize={true}
                manualRowResize={true}
                columns= { [{data: "Task", type: Handsontable.cellTypes.dropdown, strict: true, source: this.state.tasksNames}]}
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
              </div>
              <div style={{display: "flex"}}>
                <div style={{marginLeft:"520px"}}>
                  <button className="projects__add__button" onClick={()=>this.addRowSubtasks()} style={{width:"70px"}}><p className="projects__add__button__text">+ Add</p></button>
                </div>
              </div>
          </TabPanel>
          <TabPanel value="8">
            <div id="hot-app" className="excel__container" style={{marginLeft: "430px"}}>
              <HotTable
                data={this.state.tasks}
                colHeaders = {["<b>PID</b>"]}
                rowHeaders={false}
                width="400"
                height="775"
                className="custom__table__1"
                rowHeights="38"
                settings={settingsSubtasks} 
                manualColumnResize={true}
                manualRowResize={true}
                columns= { [{data: "Software", type: Handsontable.cellTypes.dropdown, strict: true, source: this.state.softwares}]}
                filters={false}
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
            </div>
            <div style={{display: "flex", float:"center"}} >
              <div style={{marginLeft: "520px"}}>
                <button className="projects__add__button" type="button" onClick={()=> this.addRowTasks()} style={{width:"70px"}}><p className="projects__add__button__text">+ Add</p></button>
              </div>
            </div>
          </TabPanel>
          <TabPanel value="9">
            <div id="hot-app" className="excel__container" style={{marginLeft: "175px"}}>
              <HotTable
                data={this.state.tasks}
                colHeaders = {["<b>PIDS</b>", "<b>Project</b>"]}
                rowHeaders={false}
                width="900"
                height="775"
                className="custom__table__1"
                rowHeights="38"
                settings={settingsTasks} 
                manualColumnResize={true}
                manualRowResize={true}
                columns= { [{data: "Software", type: Handsontable.cellTypes.dropdown, strict: true, source: this.state.softwares},{data: "Task"}]}
                filters={false}
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
            </div>
            <div style={{display: "flex", float:"center"}} >
              <div style={{marginLeft: "520px"}}>
                <button className="projects__add__button" type="button" onClick={()=> this.addRowTasks()} style={{width:"70px"}}><p className="projects__add__button__text">+ Add</p></button>
              </div>
            </div>
          </TabPanel>
        </TabContext>
      </Box>
    }</div>
  }

  render() {

    const MyTabs = this._tabs();

    return (
      <div style={{marginLeft: "30px"}}>
        <div style={{marginTop: "90px", marginBottom: "50px"}}>
          <button className="projects__button__save" onClick={()=>this.saveChanges()} style={{width:"175px", marginLeft:"-1570px"}}><img src={SaveIcon2} alt="hold" className="navBar__icon__save" style={{marginRight:"-20px"}}></img><p className="projects__button__text">Save</p></button>
          {/* <button className="projects__button__task" onClick={()=>this.props.goToTasks()} style={{width:"155px", marginLeft:"20px"}}><img src={FolderIcon2} alt="hold" className="navBar__icon__task" style={{marginRight:"0px"}}></img><p className="projects__button__text">Tasks</p></button> */}
        </div>
        <div style={{display: "center"}}>
          <div style={{marginLeft: "500px", marginRight: "500px"}}>
              <MyTabs />
          </div>
        </div>
      </div>
    );
  }
}

export default KeyParamTreeGrid;