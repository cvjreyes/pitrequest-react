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

class KeyParamTreeGrid extends Component{ //Tablas de edicion de los keyparams que se usan para sptracker, psvs, etc

  constructor(props) {
    super(props);
    this.state = {
      updateData: false,
      error: false,
      projects_list: [],
      specs_list: [],
      tab: '1',
      specs: [],
      specs_projects : [],
      instrument_types: [],
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

    //Get de todos los proyectos
    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getAllProjects", options)
    .then(response => response.json())
    .then(json => {
      var projects = []
      for(let i = 0; i < json.projects.length; i++){
        projects.push(json.projects[i].name)
      }
      this.setState({projects_list : projects});  

    }) 

    //Get de los specs
    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/csptracker/specs", options)
      .then(response => response.json())
      .then(async json => {
          let spec_data = []
          let specs_list = []
          for(let i = 0; i < json.rows.length; i++){
              spec_data.push({"Name": json.rows[i].spec, id: json.rows[i].id})
              specs_list.push(json.rows[i].spec)
          }
          await this.setState({specs: spec_data, specs_list: specs_list})
      })

    //Get de los specs por proyecto
    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getSpecsByAllProjects", options)
    .then(response => response.json())
    .then(async json => {
        let spec_data = []
        for(let i = 0; i < json.specs.length; i++){
            spec_data.push({spec: json.specs[i].spec, project: json.specs[i].project, id: json.specs[i].id})
        }
        await this.setState({specs_projects: spec_data})
    })

    //Get de los tipos de instrumentos
    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getInstTypes", options)
    .then(response => response.json())
    .then(async json => {
        let types_data = []
        for(let i = 0; i < json.instrument_types.length; i++){
            types_data.push({type: json.instrument_types[i].type, id: json.instrument_types[i].id})
        }
        await this.setState({instrument_types: types_data})
    })

    //Get de los pcons
    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getPComs", options)
    .then(response => response.json())
    .then(async json => {
        let pcons_data = []
        for(let i = 0; i < json.pcons.length; i++){
            pcons_data.push({pcon: json.pcons[i].name, id: json.pcons[i].id})
        }
        await this.setState({pcons: pcons_data})
    })

    //Get de los boltTypes
    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/csptracker/boltTypes", options)
      .then(response => response.json())
      .then(async json => {
          let bolt_types_data = []
          for(let i = 0; i < json.rows.length; i++){
              bolt_types_data.push({"Name": json.rows[i].type, id: json.rows[i].id})
          }
          await this.setState({bolt_types: bolt_types_data})
        })

    //Get ratings
    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/csptracker/ratings", options)
      .then(response => response.json())
      .then(json => {
        var rows = []
        for(let i = 0; i < json.rows.length; i++){
            rows.push({"Name": json.rows[i].rating, id: json.rows[i].id})
        }
        this.setState({ratings: rows});
  
      }) 

    //Get de los end preparations
    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/csptracker/endPreparations", options)
    .then(response => response.json())
    .then(json => {
      var rows = []
      for(let i = 0; i < json.rows.length; i++){
          rows.push({"Name": json.rows[i].state, id: json.rows[i].id})
      }

      this.setState({end_preparations : rows});

    })

    //Get de los pids
    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/csptracker/pids", options)
      .then(response => response.json())
      .then(async json => {
          let pids = []
          for(let i = 0; i < json.rows.length; i++){
              pids.push({pid: json.rows[i].pid, project: json.rows[i].name, id: json.rows[i].id})
          }
          await this.setState({pids: pids})
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

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/csptracker/specs", options)
      .then(response => response.json())
      .then(async json => {
          let spec_data = []
          let specs_list = []
          for(let i = 0; i < json.rows.length; i++){
              spec_data.push({"Name": json.rows[i].spec, id: json.rows[i].id})
              specs_list.push(json.rows[i].spec)
          }
          await this.setState({specs: spec_data, specs_list: specs_list})
      })

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getSpecsByAllProjects", options)
    .then(response => response.json())
    .then(async json => {
        let spec_data = []
        for(let i = 0; i < json.specs.length; i++){
            spec_data.push({spec: json.specs[i].spec, project: json.specs[i].project, id: json.specs[i].id})
        }
        await this.setState({specs_projects: spec_data})
    })

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getInstTypes", options)
    .then(response => response.json())
    .then(async json => {
        let types_data = []
        for(let i = 0; i < json.instrument_types.length; i++){
            types_data.push({type: json.instrument_types[i].type, id: json.instrument_types[i].id})
        }
        await this.setState({instrument_types: types_data})
    })

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getPComs", options)
    .then(response => response.json())
    .then(async json => {
        let pcons_data = []
        for(let i = 0; i < json.pcons.length; i++){
            pcons_data.push({pcon: json.pcons[i].name, id: json.pcons[i].id})
        }
        await this.setState({pcons: pcons_data})
    })

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/csptracker/boltTypes", options)
      .then(response => response.json())
      .then(async json => {
          let bolt_types_data = []
          for(let i = 0; i < json.rows.length; i++){
              bolt_types_data.push({"Name": json.rows[i].type, id: json.rows[i].id})
          }
          await this.setState({bolt_types: bolt_types_data})
        })

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/csptracker/ratings", options)
      .then(response => response.json())
      .then(json => {
        var rows = []
        for(let i = 0; i < json.rows.length; i++){
            rows.push({"Name": json.rows[i].rating, id: json.rows[i].id})
        }
        this.setState({ratings: rows});
  
      }) 

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/csptracker/endPreparations", options)
    .then(response => response.json())
    .then(json => {
      var rows = []
      for(let i = 0; i < json.rows.length; i++){
          rows.push({"Name": json.rows[i].state, id: json.rows[i].id})
      }

      this.setState({end_preparations : rows});

    })

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/csptracker/pids", options)
      .then(response => response.json())
      .then(async json => {
          let pids = []
          for(let i = 0; i < json.rows.length; i++){
              pids.push({pid: json.rows[i].pid, project: json.rows[i].name, id: json.rows[i].id})
          }
          await this.setState({pids: pids})
      }) 

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getProjects", options)
    .then(response => response.json())
    .then(json => {
      var projects = []
      for(let i = 0; i < json.projects.length; i++){
        projects.push(json.projects[i].name)
      }
      this.setState({projects_list : projects});  

    }) 
    }
  }

  //Metodos para añadir filas en las tablas

  addRowSpecs(){
    let rows = this.state.specs
    rows.push({"Name": ""})
    this.setState({specs: rows})
  }

  addRowSpecsByProject(){
    let rows = this.state.specs_projects
    rows.push({"spec": "", "project": "", "id": ""})
    this.setState({specs_projects: rows})
  }

  addRowGenerics(){
    let rows = this.state.instrument_types
    rows.push({"type": "",  "id": ""})
    this.setState({instrument_types: rows})
  }

  addRowPcons(){
    let rows = this.state.pcons
    rows.push({"pcon": "",  "id": ""})
    this.setState({pcons: rows})
  }

  addRowBoltTypes(){
    let rows = this.state.bolt_types
    rows.push({"Name": "",  "id": ""})
    this.setState({bolt_types: rows})
  }

  addRowRatings(){
    let rows = this.state.ratings
    rows.push({"Name": "",  "id": ""})
    this.setState({ratings: rows})
  }

  addRowsEndPreparations(){
    let rows = this.state.end_preparations
    rows.push({"Name": "",  "id": ""})
    this.setState({end_preparation: rows})
  }

  addRowsPIDs(){
    let rows = this.state.pids
    rows.push({"pid": "", "project": "", "id": ""})
    this.setState({pids: rows})
  }

  
  async saveChanges(){ //Guardar cambios hechos sobre todas las tablas

    let error = false

    let body ={
      rows: this.state.specs,
    }

    let options = {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/submit/csptracker/specs", options)
      .then(response => response.json())
      .then(async json => {
          if(!json.success){
            error = true
          }
      })

    body ={
      specs: this.state.specs_projects,
    }

    options = {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/submitSpecsByProject", options)
      .then(response => response.json())
      .then(async json => {
          if(!json.success){
            error = true
          }
      })

    body ={
      generics: this.state.instrument_types,
    }

    options = {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/submitGenerics", options)
      .then(response => response.json())
      .then(async json => {
        if(!json.success){
          error = true
        }
      })
    body ={
      pcons: this.state.pcons,
    }

    options = {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/submitPcons", options)
      .then(response => response.json())
      .then(async json => {
        if(!json.success){
          error = true
        }
      })

    body ={
      rows: this.state.bolt_types,
    }

    options = {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/submit/csptracker/boltTypes", options)
      .then(response => response.json())
      .then(async json => {
        if(!json.success){
          error = true
        }
      })

    body ={
      rows: this.state.ratings,
    }

    options = {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/submit/csptracker/ratings", options)
      .then(response => response.json())
      .then(async json => {
        if(!json.success){
          error = true
        }
      })

    body ={
      rows: this.state.end_preparations,
    }

    options = {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/submit/csptracker/endPreparations", options)
      .then(response => response.json())
      .then(async json => {
        if(!json.success){
          error = true
        }
      })

    body ={
      pids: this.state.pids,
    }

    options = {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/submitPIDsByProject", options)
      .then(response => response.json())
      .then(async json => {
        if(!json.success){
          error = true
        }
      })
    
    if(error){
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
      colWidths: [297, 261, 261, 91],
    }

    let settingsTasks = {
      licenseKey: 'non-commercial-and-evaluation',
      colWidths: 439,
      className:'excel'
    }

    let settingsSubtasks= {
      licenseKey: 'non-commercial-and-evaluation',
      colWidths: 299,
    }

    let settingsType= {
      licenseKey: 'non-commercial-and-evaluation',
      colWidths: 578,
    }

    return <div >{ 
      <Box sx={{ width: '100%', marginTop: '3px'}}>
        <TabContext value={this.state.tab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} centered>
              <Tab label="Specs" value="1" style={{fontSize: '22px', textTransform: 'capitalize', fontFamily:'Montserrat'}} />
              <Tab label="Specs by Project" value="2" style={{fontSize: '22px', textTransform: 'capitalize', fontFamily:'Montserrat'}}/>
              <Tab label="Generic" value="3" style={{fontSize: '22px', textTransform: 'capitalize', fontFamily:'Montserrat'}}/>
              <Tab label="P-CONs" value="4" style={{fontSize: '22px', textTransform: 'capitalize', fontFamily:'Montserrat'}}/>
              <Tab label="Bolt Types" value="5" style={{fontSize: '22px', textTransform: 'capitalize', fontFamily:'Montserrat'}}/>
              <Tab label="Ratings" value="6" style={{fontSize: '22px', textTransform: 'capitalize', fontFamily:'Montserrat'}}/>
              <Tab label="End preparation" value="7" style={{fontSize: '22px', textTransform: 'capitalize', fontFamily:'Montserrat'}}/>
              <Tab label="PIDs" value="8" style={{fontSize: '22px', textTransform: 'capitalize', fontFamily:'Montserrat'}}/>
            </TabList>
          </Box>
          <TabPanel value="1" centered>
          <div className="excel__container__2" style={{marginLeft: "420px"}}>
            <HotTable
              data={this.state.specs}
              colHeaders = {["<b>Spec</b>"]}
              rowHeaders={false}
              width="320"
              className="custom__table__2"
              height="775"
              rowHeights="38"
              settings={settingsProjects} 
              manualColumnResize={true}
              manualRowResize={true}
              columns= { [{data: "Name", type: "text"}]}
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
              <div style={{marginTop:"20px", marginLeft: "470px"}}>
                <button className="projects__add__button" type="button" onClick={()=> this.addRowSpecs()} style={{width:"70px"}}><p className="projects__add__button__text">+ Add</p></button>
              </div>
            </div>
          </TabPanel>
          <TabPanel value="2">
            <div id="hot-app" className="excel__container" style={{marginLeft: "110px"}}>
              <HotTable
                data={this.state.specs_projects}
                colHeaders = {["<b>Specs</b>", "<b>Project</b>"]}
                rowHeaders={false}
                width="900"
                height="775"
                className="custom__table__1"
                rowHeights="38"
                settings={settingsTasks} 
                manualColumnResize={true}
                manualRowResize={true}
                columns= { [{data: "spec", type: Handsontable.cellTypes.dropdown, strict: true, source: this.state.specs_list},{data: "project", type: Handsontable.cellTypes.dropdown, strict: true, source: this.state.projects_list}]}
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
              <div style={{marginLeft: "475px"}}>
                <button className="projects__add__button" type="button" onClick={()=> this.addRowSpecsByProject()} style={{width:"70px"}}><p className="projects__add__button__text">+ Add</p></button>
              </div>
            </div>
          </TabPanel>
          <TabPanel value="3">
            <div id="hot-app" className="excel__container" style={{marginLeft: "260px"}}>
              <HotTable
                data={this.state.instrument_types}
                colHeaders = {["<b>Type</b>"]}
                rowHeaders={false}
                width="600"
                height="775"
                className="custom__table__3"
                rowHeights="38"
                settings={settingsType} 
                manualColumnResize={true}
                manualRowResize={true}
                columns= { [{data: "type", type:"text"}]}
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
                <div style={{marginLeft:"470px"}}>
                  <button className="projects__add__button" onClick={()=>this.addRowGenerics()} style={{width:"70px"}}><p className="projects__add__button__text">+ Add</p></button>
                </div>
              </div>
          </TabPanel>
          <TabPanel value="4">
            <div id="hot-app" className="excel__container" style={{marginLeft: "420px"}}>
              <HotTable
                data={this.state.pcons}
                colHeaders = {["<b>P-CON</b>"]}
                rowHeaders={false}
                width="320"
                height="775"
                className="custom__table__3"
                rowHeights="38"
                settings={settingsSubtasks} 
                manualColumnResize={true}
                manualRowResize={true}
                columns= { [{data: "pcon", type: "text"}]}
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
                <div style={{marginLeft:"470px"}}>
                  <button className="projects__add__button" onClick={()=>this.addRowPcons()} style={{width:"70px"}}><p className="projects__add__button__text">+ Add</p></button>
                </div>
              </div>
          </TabPanel>
          <TabPanel value="5">
            <div id="hot-app" className="excel__container" style={{marginLeft: "420px"}}>
              <HotTable
                data={this.state.bolt_types}
                colHeaders = {["<b>Type</b>"]}
                rowHeaders={false}
                width="320"
                height="775"
                className="custom__table__3"
                rowHeights="38"
                settings={settingsSubtasks} 
                manualColumnResize={true}
                manualRowResize={true}
                columns= { [{data: "Name", type: "text"}]}
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
                <div style={{marginLeft:"470px"}}>
                  <button className="projects__add__button" onClick={()=>this.addRowBoltTypes()} style={{width:"70px"}}><p className="projects__add__button__text">+ Add</p></button>
                </div>
              </div>
          </TabPanel>
          <TabPanel value="6">
            <div id="hot-app" className="excel__container" style={{marginLeft: "420px"}}>
              <HotTable
                data={this.state.ratings}
                colHeaders = {["<b>Rating</b>"]}
                rowHeaders={false}
                width="320"
                height="775"
                className="custom__table__3"
                rowHeights="38"
                settings={settingsSubtasks} 
                manualColumnResize={true}
                manualRowResize={true}
                columns= { [{data: "Name", type: "text"}]}
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
                <div style={{marginLeft:"470px"}}>
                  <button className="projects__add__button" onClick={()=>this.addRowRatings()} style={{width:"70px"}}><p className="projects__add__button__text">+ Add</p></button>
                </div>
              </div>
          </TabPanel>
          <TabPanel value="7">
            <div id="hot-app" className="excel__container" style={{marginLeft: "420px"}}>
              <HotTable
                data={this.state.end_preparations}
                colHeaders = {["<b>End preparation</b>"]}
                rowHeaders={false}
                width="320"
                height="775"
                className="custom__table__3"
                rowHeights="38"
                settings={settingsSubtasks} 
                manualColumnResize={true}
                manualRowResize={true}
                columns= { [{data: "Name", type: "text"}]}
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
                <div style={{marginLeft:"470px"}}>
                  <button className="projects__add__button" onClick={()=>this.addRowsEndPreparations()} style={{width:"70px"}}><p className="projects__add__button__text">+ Add</p></button>
                </div>
              </div>
          </TabPanel>
          <TabPanel value="8">
            <div id="hot-app" className="excel__container" style={{marginLeft: "110px"}}>
              <HotTable
                data={this.state.pids}
                colHeaders = {["<b>PIDs</b>", "<b>Project</b>"]}
                rowHeaders={false}
                width="900"
                height="775"
                className="custom__table__1"
                rowHeights="38"
                settings={settingsTasks} 
                manualColumnResize={true}
                manualRowResize={true}
                columns= { [{data: "pid"}, {data: "project", type: Handsontable.cellTypes.dropdown, strict: true, source: this.state.projects_list}]}
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
              <div style={{marginLeft: "470px"}}>
                <button className="projects__add__button" type="button" onClick={()=> this.addRowsPIDs()} style={{width:"70px"}}><p className="projects__add__button__text">+ Add</p></button>
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
        <div style={{marginTop: "140px"}}>
          <button className="projects__button__save" onClick={()=>this.saveChanges()} style={{width:"175px", marginLeft:"-1770px"}}><img src={SaveIcon2} alt="hold" className="navBar__icon__save" style={{marginRight:"-20px"}}></img><p className="projects__button__text">Save</p></button>
        </div>
        <div style={{display: "center"}}>
          <div style={{marginLeft: "600px", marginRight: "600px"}}>
              <MyTabs />
          </div>
        </div>
      </div>
    );
  }
}

export default KeyParamTreeGrid;