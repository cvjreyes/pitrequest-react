import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';
import Handsontable from 'handsontable'
import '../projectsTreeGrid/projectsTreeGrid.css'
import './offersTreeGrid.css'
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import SaveIcon from "../../assets/images/save.svg"
import SaveIcon2 from "../../assets/images/SaveIcon2.svg"

class OffersTreeGrid extends Component {

  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        { field: 'offer', rowGroup: true, hide: true, checkboxSelection:  false },
        { field: 'software', checkboxSelection: true, rowGroup: true, hide: true, headerClass: 'header-custom'},
        { field: 'task', checkboxSelection: true, rowGroup: true, hide: true, headerClass: 'header-custom'},
        { field: 'subtask',checkboxSelection: true, hide: true, width:20, headerClass: 'header-custom'},
        { field: 'hours', headerClass: 'header-custom', aggFunc: values =>{
          let sum = 0
          if(values){
            for(let i = 0; i < values.rowNode.allLeafChildren.length; i++){
              if(values.rowNode.allLeafChildren[i].data.checked){
                sum+= values.rowNode.allLeafChildren[i].data.hours
              }
            }
          }
          if(sum > 0){
            return sum
          }else{
            return null
          }
          
        }}
      ],
      defaultColDef: {
        resizable: true,
        flex: 2
      },
      autoGroupColumnDef: {
        headerClass: 'header-custom',
        headerName: 'Offers and tasks',
        field: 'subtask',
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
          suppressCount: true,
          checkbox: true
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
      updateData: false,
      error: false,
      offers: [],
      softwares: [],
      tab: '1',
    };
    
  }


  async componentDidMount(){

    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getSoftwares", options)
      .then(response => response.json())
      .then(async json => {
        let soft = json.softwares
        let softwares = []
        for(let i = 0; i < soft.length; i++){
          softwares.push(soft[i].name)
        }
        await this.setState({softwares: softwares})
      })

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getTasks", options)
    .then(response => response.json())
    .then(async json => {
      let tasks = []
      let tasksNames = []
      let subtasks =[]
      console.log(json)
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
            if(ts[j][0] != "software"){
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

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getOffersWithHours", options)
      .then(response => response.json())
      .then(async json => {
        let offers = []
        if(json.offers){
          for(let i = 0; i < json.offers.length; i++){
            offers.push({"Offer": json.offers[i].name, "Hours": json.offers[i].sup_estihrs, "id": json.offers[i].id})
          }
        }else{
            offers.push({"Offer": null, "Hours": null, "id": null})
        }
        
        await this.setState({offers : offers});
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
    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getOffersTreeData", options)
    .then(response => response.json())
    .then(async json => {
        let tree_nodes = []
        let node = {}
        for(let i = 0; i < json.rows.length; i++){
            node = {offer: json.rows[i].offer, software: json.rows[i].software, task: json.rows[i].task, subtask: json.rows[i].subtask, hours: json.rows[i].hours}
            if(node){
                tree_nodes.push(node)
            }
            
        }
        await this.setState({tree_nodes: tree_nodes})

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getAllOTS", options)
    .then(response => response.json())
    .then(async json => {
        let nodes = []
        const offers = json.offers
        const tasks = json.tasks

        for(let i = 0; i < offers.length; i ++){
          let support_node = {offer: offers[i].name, software: "Support", task: "Estimated", subtask:"Hours", hours: offers[i].sup_estihrs, checked: true}
          if(tasks){
            for(let j = 0; j < tasks.length; j ++){
              let node = {offer: offers[i].name, software: tasks[j].software, task: tasks[j].task, subtask:tasks[j].subtask, hours: tasks[j].hours}
              if(this.state.tree_nodes.some(e => e.offer === node.offer && e.task === node.task && e.subtask === node.subtask && e.hours === node.hours)) {
                node["checked"] = true
                support_node.hours -= node.hours
              }else{
                node["checked"] = false
              }
              nodes.push(node)
            }
          }else{
            let node = {offer: offers[i].name, task: "No offers available", subtasks: null, hours: null}
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
    return rowNode.data ? rowNode.data.subtask : false;
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
      if(!this.state.initial_nodes.some(e => e.offer === current_nodes[i].offer && e.task === current_nodes[i].task && e.subtask === current_nodes[i].subtask && e.hours === current_nodes[i].hours)){
        new_nodes.push(current_nodes[i])
      }
    }

    for(let i = 0; i < this.state.initial_nodes.length; i++){
      if(!current_nodes.some(e => e.offer === this.state.initial_nodes[i].offer && e.task === this.state.initial_nodes[i].task && e.subtask === this.state.initial_nodes[i].subtask && e.hours === this.state.initial_nodes[i].hours)){
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

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/submitOffersChanges", options)
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
      rows: this.state.offers,
    }

    options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }
    if(this.state.offers){
      await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/submitOffersHours", options)
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
      console.log(json)
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
            if(ts[j][0] != "software"){
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

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getOffersTreeData", options)
    .then(response => response.json())
    .then(async json => {
        let tree_nodes = []
        let node = {}
        for(let i = 0; i < json.rows.length; i++){
            node = {offer: json.rows[i].offer, software: json.rows[i].software, task: json.rows[i].task, subtask: json.rows[i].subtask, hours: json.rows[i].hours}
            if(node){
                tree_nodes.push(node)
            }
            
        }
        await this.setState({tree_nodes: tree_nodes})
    })

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getAllOTS", options)
    .then(response => response.json())
    .then(async json => {
        let nodes = []
        const offers = json.offers
        const tasks = json.tasks

        for(let i = 0; i < offers.length; i ++){
          let support_node = {offer: offers[i].name, software: "Support", task: "Estimated", subtask:"Hours", hours: offers[i].sup_estihrs, checked: true}
          if(tasks){
            for(let j = 0; j < tasks.length; j ++){
              let node = {offer: offers[i].name, software: tasks[j].software, task: tasks[j].task, subtask:tasks[j].subtask, hours: tasks[j].hours}
              if(this.state.tree_nodes.some(e => e.offer === node.offer && e.task === node.task && e.subtask === node.subtask && e.hours === node.hours)) {
                node["checked"] = true
                support_node.hours -= node.hours
              }else{
                node["checked"] = false
              }
              nodes.push(node)
            }
          }else{
            let node = {offer: offers[i].name, task: "No offers available", subtasks: null, hours: null}
            nodes.push(node)
          }
          nodes.push(support_node)
          
        }
        await this.setState({rowData: nodes})
    })

    let initial_nodes = []

    for(let i = 0; i < this.gridApi.getSelectedNodes().length; i++){
      initial_nodes.push(this.gridApi.getSelectedNodes()[i].data)
    }

    await this.setState({initial_nodes: initial_nodes})

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getOffersWithHours", options)
      .then(response => response.json())
      .then(async json => {
        let offers = []
        if(json.offers){
          for(let i = 0; i < json.offers.length; i++){
            offers.push({"Offer": json.offers[i].name, "Hours": json.offers[i].sup_estihrs, "id": json.offers[i].id})
          }
        }else{
            offers.push({"Offer": null, "Hours": null, "id": null})
        }
        
        await this.setState({offers : offers});
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

    let settingsTasks = {
      licenseKey: 'non-commercial-and-evaluation',
      colWidths: 400,
      
      className:'excel'
    }

    let settingsSubtasks= {
      licenseKey: 'non-commercial-and-evaluation',
      colWidths: 266,
    }

    let settingsProjects = {
      licenseKey: 'non-commercial-and-evaluation',
      colWidths: 400,
    }

    return <div>{
      <Box sx={{ width: '100%', marginTop: '5px'}}>
        <TabContext value={this.state.tab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} centered>
              <Tab label="Offers" value="1" style={{fontSize: '22px', textTransform: 'capitalize', fontFamily:'Montserrat'}} />
              <Tab label="Software" value="2" style={{fontSize: '22px', textTransform: 'capitalize', fontFamily:'Montserrat'}}/>
              <Tab label="Tasks" value="3" style={{fontSize: '22px', textTransform: 'capitalize', fontFamily:'Montserrat'}}/>
            </TabList>
          </Box>
          <TabPanel value="1" centered>
            <div className="excel__container__offers__1">
                  <HotTable
                  data={this.state.offers}
                  colHeaders = {["<b>Offer</b>", "<b>Estimated hours</b>"]}
                  rowHeaders={false}
                  width="1800"
                  height="775"
                  className="custom__table__1"
                  rowHeights="38"
                  settings={settingsProjects} 
                  manualColumnResize={true}
                  manualRowResize={true}
                  columns= { [{data: "Offer", editor: false}, {data: "Hours"}]}
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
          </TabPanel>
          <TabPanel value="2" centered>
          <div id="hot-app" className="excel__container__offer__2">
            <HotTable
                data={this.state.tasks}
                colHeaders = {["<b>Software</b>", "<b>Task</b>"]}
                rowHeaders={false}
                width="1092"
                height="710"
                className="custom__table__1"
                rowHeights="38"
                settings={settingsTasks} 
                manualColumnResize={true}
                manualRowResize={true}
                columns= { [{data: "Software", type: Handsontable.cellTypes.dropdown, strict: true, source: this.state.softwares},{data: "Task"}]}
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
            <div style={{display: "flex", float:"left", marginTop:"0px"}}>
              <div style={{marginLeft:"320px", marginBottom: "20px"}}>
              <button className="projects__add__button" onClick={()=>this.addRowTasks()} style={{width:"70px", marginBottom:"50px", height:"10px", }}><p className="projects__add__button__text">+ Add</p></button>
              </div>
            </div>
          </TabPanel>
          <TabPanel value="3" centered>
          <div id="hot-app" className="excel__container__offer__3">
              <HotTable
                data={this.state.subtasks}
                colHeaders = {["<b>Task</b>", "<b>Subtask</b>", "<b>Hours</b>"]}
                rowHeaders={false}
                width="800"
                className="custom__table__3"
                height="710"
                rowHeights="38"
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
            </div>
              <div style={{display: "flex", float:"left"}}>
                <div style={{marginLeft:"320px"}}>
                  <button className="offers__add__button" onClick={()=>this.addRowSubtasks()} style={{width:"70px", height: "30px"}}><p className="projects__add__button__text">+ Add</p></button>
                </div>
              </div>
          </TabPanel>
        </TabContext>
      </Box>  
    }</div>
  }
  
  render() {
    
    
    {/*let settingsTasks = {
      licenseKey: 'non-commercial-and-evaluation',
      colWidths: 400,
      
      className:'excel'
    }

    let settingsSubtasks= {
      licenseKey: 'non-commercial-and-evaluation',
      colWidths: 266,
    }

    let settingsProjects = {
      licenseKey: 'non-commercial-and-evaluation',
      colWidths: 400,
    }*/}

    const MyTabs = this._tabs();

    return (
      <div>
        <div style={{marginTop: "140px"}}>
          <button className="projects__button__save" onClick={()=>this.saveChanges()} style={{width:"175px", marginLeft:"-1800px"}}><img src={SaveIcon2} alt="hold" className="navBar__icon__save" style={{marginRight:"-20px"}}></img><p className="projects__button__text">Save</p></button>
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
          <div>
          <MyTabs />
          {/*<div className="excel__container__offers__1">
              <HotTable
              data={this.state.offers}
              colHeaders = {["<b>Offer</b>", "<b>Estimated hours</b>"]}
              rowHeaders={false}
              width="1800"
              height="200"
              className="custom__table__1"
              rowHeights="38"
              settings={settingsProjects} 
              manualColumnResize={true}
              manualRowResize={true}
              columns= { [{data: "Offer", editor: false}, {data: "Hours"}]}
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
          <div id="hot-app" className="excel__container__offer__2">
          <HotTable
              data={this.state.tasks}
              colHeaders = {["<b>Software</b>", "<b>Task</b>"]}
              rowHeaders={false}
              width="1092"
              height="200"
              className="custom__table__1"
              rowHeights="38"
              settings={settingsTasks} 
              manualColumnResize={true}
              manualRowResize={true}
              columns= { [{data: "Software", type: Handsontable.cellTypes.dropdown, strict: true, source: this.state.softwares},{data: "Task"}]}
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
          <div style={{display: "flex", float:"left", marginTop:"0px"}}>
            <div style={{marginLeft:"320px", marginBottom: "20px"}}>
            <button className="projects__add__button" onClick={()=>this.addRowTasks()} style={{width:"70px", marginBottom:"50px", height:"10px", }}><p className="projects__add__button__text">+ Add</p></button>
            </div>
          </div>
          <br></br>
          <div id="hot-app" className="excel__container__offer__3">
            <HotTable
              data={this.state.subtasks}
              colHeaders = {["<b>Task</b>", "<b>Subtask</b>", "<b>Hours</b>"]}
              rowHeaders={false}
              width="800"
              className="custom__table__3"
              height="680"
              rowHeights="38"
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
          </div>
            <div style={{display: "flex", float:"left"}}>
              <div style={{marginLeft:"320px", marginTop: "-450px"}}>
                <button className="offers__add__button" onClick={()=>this.addRowSubtasks()} style={{width:"70px", height: "30px"}}><p className="projects__add__button__text">+ Add</p></button>
              </div>
            </div>
          </div> */}
        </div>
      </div>
      </div>
      
    );
  }
}

export default OffersTreeGrid;