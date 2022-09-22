import React from 'react';
import 'antd/dist/antd.css';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';

class CSPTrackerKeyParams extends React.Component{
  state = {
    searchText: '',
    searchedColumn: '',
    ratingData: [],
    specData: [],
    endPreparationData: [],
    boltTypesData: [],
    pidData: [],
    projects: [],
    tab: this.props.currentTab,
    selectedRows: [],
    selectedRowsKeys: [],
    updateData: this.props.updateData,
    username: "",
    acronyms : null,
    steps: []
  };

  async componentDidMount(){

    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }

    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/csptracker/ratings", options)
    .then(response => response.json())
    .then(json => {
      var rows = []
      var row = null
      for(let i = 0; i < json.rows.length; i++){

          row = {"id": json.rows[i].id,"Name": json.rows[i].rating}
          rows.push(row)
      }
      this.setState({ratingData : rows, selectedRows: []});

    }) 

    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/csptracker/specs", options)
    .then(response => response.json())
    .then(json => {
      var rows = []
      var row = null
      for(let i = 0; i < json.rows.length; i++){

          row = {"id": json.rows[i].id, "Name": json.rows[i].spec}
          rows.push(row)
      }
      this.setState({specData : rows, selectedRows: []});

    }) 

    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/csptracker/endPreparations", options)
    .then(response => response.json())
    .then(json => {
      var rows = []
      var row = null
      for(let i = 0; i < json.rows.length; i++){

          row = {"id": json.rows[i].id, "Name": json.rows[i].state}
          rows.push(row)
      }
      this.setState({endPreparationData : rows, selectedRows: []});

    })
    
    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/csptracker/boltTypes", options)
    .then(response => response.json())
    .then(json => {
      var rows = []
      var row = null
      for(let i = 0; i < json.rows.length; i++){

          row = {"id": json.rows[i].id, "Name": json.rows[i].type}
          rows.push(row)
      }
      this.setState({boltTypesData : rows, selectedRows: []});

    }) 

    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/csptracker/pids", options)
    .then(response => response.json())
    .then(json => {
      var rows = []
      var row = null
      for(let i = 0; i < json.rows.length; i++){

          row = {"id": json.rows[i].id, "Name": json.rows[i].pid, "Project": json.rows[i].name}
          rows.push(row)
      }
      this.setState({pidData : rows, selectedRows: []});  

    }) 
    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getProjects", options)
    .then(response => response.json())
    .then(json => {
      var projects = []
      for(let i = 0; i < json.projects.length; i++){
        projects.push(json.projects[i].name)
      }
      this.setState({projects : projects});  

    }) 
  }

  addRowRatings(){
    let rows = this.state.ratingData
    rows.push({"Name":""})
    this.setState({ratingData: rows})
  }
  
  submitChangesRatings(){
    const body = {
      rows: this.state.ratingData,
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }
    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/submit/csptracker/ratings", options)
    .then(response => response.json())
    .then(json =>{
        
    })
    this.props.success()
  }

  addRowSpecs(){
    let rows = this.state.specData
    rows.push({"Name": ""})
    this.setState({specData: rows})
  }

  submitChangesSpecs(){
    const body = {
      rows: this.state.specData,
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }
    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/submit/csptracker/specs", options)
    .then(response => response.json())
    .then(json =>{

    })
    this.props.success()
  }

  addRowEndPreparations(){
    let rows = this.state.endPreparationData
    rows.push({"Name": ""})
    this.setState({endPreparationData: rows})
  }

  submitChangesEndPreparations(){
    const body = {
      rows: this.state.endPreparationData,
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }
    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/submit/csptracker/endPreparations", options)
    .then(response => response.json())
    .then(json =>{

    })
    this.props.success()
  }

  addRowBoltTypes(){
    let rows = this.state.boltTypesData
    rows.push({"Name": ""})
    this.setState({boltTypesData: rows})
  }

  submitChangesBoltTypes(){
    const body = {
      rows: this.state.boltTypesData,
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }
    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/submit/csptracker/boltTypes", options)
    .then(response => response.json())
    .then(json =>{

    })
    this.props.success()
  }

  addRowPids(){
    let rows = this.state.pidData
    rows.push({"Name": "", "Project": ""})
    this.setState({pidData: rows})
  }

  submitChangesPids(){
    const body = {
      rows: this.state.pidData,
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }
    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/submit/csptracker/pids", options)
    .then(response => response.json())
    .then(json =>{

    })
    this.props.success()
  }

 

  render() {

    const typesSettings = {
        licenseKey: 'non-commercial-and-evaluation',
        colWidths: 200,
        //... other options
      }
  
      const stepsSettings = {
        licenseKey: 'non-commercial-and-evaluation',
        colWidths: 200,
        //... other options
      }
  
      const progressSettings = {
        licenseKey: 'non-commercial-and-evaluation',
        colWidths: 280,
        //... other options
      }

      const pidsSettings = {
        licenseKey: 'non-commercial-and-evaluation',
        colWidths: 300,
        //... other options
      }

      return (
        <div className="row" style={{float:"left"}}>
           <div className="column" style={{marginLeft:"50px", width:"280px"}}>
            <div id="hot-app">
              <HotTable
                data={this.state.ratingData}
                colHeaders = {["<b>RATINGS</b>"]}
                rowHeaders={true}
                width="250"
                height="470"
                settings={stepsSettings} 
                manualColumnResize={true}
                manualRowResize={true}
                columns= {[{ data: "Name"}]}
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
                  <button class="btn btn-sm btn-info" onClick={() => this.addRowRatings()} style={{marginRight:"5px", fontSize:"16px", width:"60px", borderRadius:"10px", backgroundColor:"#338DF1"}}>Add</button>
                  <button class="btn btn-sm btn-success" onClick={() => this.submitChangesRatings()} style={{marginRight:"5px", fontSize:"16px", width:"60px", borderRadius:"10px", backgroundColor:"#7BD36D"}}>Save</button>
              </center>
            </div>
          </div>
          <div className="column" style={{marginLeft:"50px", width:"270px"}}>

            <div id="hot-app">
              <HotTable
                data={this.state.specData}
                colHeaders = {["<b>SPECS</b>"]}
                rowHeaders={true}
                width="250"
                height="470"
                settings={typesSettings} 
                manualColumnResize={true}
                manualRowResize={true}
                columns= {[{ data: "Name"}]}
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
                  <button class="btn btn-sm btn-info" onClick={() => this.addRowSpecs()} style={{marginRight:"5px", fontSize:"16px",width:"60px", borderRadius:"10px", backgroundColor:"#338DF1"}}>Add</button>
                  <button class="btn btn-sm btn-success" onClick={() => this.submitChangesSpecs()} style={{marginRight:"5px", fontSize:"16px", width:"60px", borderRadius:"10px", backgroundColor:"#7BD36D"}}>Save</button>
              </center>
            </div>
          </div>
         
          <div className="column" style={{marginLeft:"50px", width:"400px"}}>
            <div id="hot-app">
              <HotTable
                data={this.state.endPreparationData}
                colHeaders = {["<b>END PREPARATIONS</b>"]}
                rowHeaders={true}
                width="350"
                height="470"
                settings={progressSettings} 
                manualColumnResize={true}
                manualRowResize={true}
                columns= {[{ data: "Name"}]}
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
                  <button class="btn btn-sm btn-info" onClick={() => this.addRowEndPreparations()} style={{marginRight:"5px", fontSize:"16px",width:"60px", borderRadius:"10px", backgroundColor:"#338DF1"}}>Add</button>
                  <button class="btn btn-sm btn-success" onClick={() => this.submitChangesEndPreparations()} style={{marginRight:"5px", fontSize:"16px", width:"60px", borderRadius:"10px", backgroundColor:"#7BD36D"}}>Save</button>
              </center>
              <br></br>
            </div>
          </div>
          <div className="column" style={{marginLeft:"50px", width:"300px"}}>

            <div id="hot-app">
              <HotTable
                data={this.state.boltTypesData}
                colHeaders = {["<b>BOLT TYPES</b>"]}
                rowHeaders={true}
                width="250"
                height="470"
                settings={typesSettings} 
                manualColumnResize={true}
                manualRowResize={true}
                columns= {[{ data: "Name"}]}
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
                  <button class="btn btn-sm btn-info" onClick={() => this.addRowBoltTypes()} style={{marginRight:"5px", fontSize:"16px",width:"60px", borderRadius:"10px", backgroundColor:"#338DF1"}}>Add</button>
                  <button class="btn btn-sm btn-success" onClick={() => this.submitChangesBoltTypes()} style={{marginRight:"5px", fontSize:"16px", width:"60px", borderRadius:"10px", backgroundColor:"#7BD36D"}}>Save</button>
              </center>
            </div>
          </div>
          <div className="column" style={{marginLeft:"50px", width:"720px"}}>

            <div id="hot-app">
              <HotTable
                data={this.state.pidData}
                colHeaders = {["<b>PIDS</b>", "<b>PROJECT</b>"]}
                rowHeaders={true}
                width="650"
                height="470"
                settings={pidsSettings} 
                manualColumnResize={true}
                manualRowResize={true}
                columns= {[{ data: "Name"}, { data: "Project", type:"dropdown", source: this.state.projects, strict:"true"}]}
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
                  <button class="btn btn-sm btn-info" onClick={() => this.addRowPids()} style={{marginRight:"5px", fontSize:"16px",width:"60px", borderRadius:"10px", backgroundColor:"#338DF1"}}>Add</button>
                  <button class="btn btn-sm btn-success" onClick={() => this.submitChangesPids()} style={{marginRight:"5px", fontSize:"16px", width:"60px", borderRadius:"10px", backgroundColor:"#7BD36D"}}>Save</button>
              </center>
            </div>
          </div>
      </div>
      );
  }
}

export default CSPTrackerKeyParams;