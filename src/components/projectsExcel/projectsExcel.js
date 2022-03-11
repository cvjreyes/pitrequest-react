import React from 'react';
import 'antd/dist/antd.css';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';
import './projectsExcel.css'
import Handsontable from 'handsontable';


class ProjectsExcel extends React.Component{
  state = {
    searchText: '',
    searchedColumn: '',
    data: [],
    projectsData: [],
    selectedRows: [],
    selectedRowsKeys: [],
    admins: []
  };

  async componentDidMount(){

    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }

  fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getProjects", options)
    .then(response => response.json())
    .then(json => {
      var rows = []
      var row = null
      for(let i = 0; i < json.projects.length; i++){
          row = {"Project": json.projects[i].name, "Code": json.projects[i].code, "Admin" : json.projects[i].admin, "id": json.projects[i].id}
          rows.push(row)
      }
      
      this.setState({data : rows, selectedRows: []});
  })

  fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getAdmins", options)
      .then(response => response.json())
      .then(json => {
        this.setState({admins: json.admins})
      })

  }

  addRow(){
    let rows = this.state.data
    rows.push({"Project": "", "Code": "", "Admin": "", "id": ""})
    this.setState({data: rows})
  }
  
  submitChanges(){
    const body = {
      rows: this.state.data,
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }
    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/submitProjects", options)
    .then(response => response.json())
    .then(json =>{

    })
  }
 

  render() {

    const settings = {
        licenseKey: 'non-commercial-and-evaluation',
        colWidths: 400,
        
        //... other options
    }

      return (

          <div style={{marginLeft:"430px", marginTop:"40px"}}>

            <div id="hot-app">
              <HotTable
                data={this.state.data}
                colHeaders = {["<b>PROJECT</b>", "<b>CODE</b>", "<b>ADMIN</b>"]}
                rowHeaders={true}
                width="2040"
                
                height="300"
                settings={settings} 
                manualColumnResize={true}
                manualRowResize={true}
                columns= { [{data: "Project"}, {data: "Code"}, {data: "Admin", type: Handsontable.cellTypes.dropdown, strict:true, source: this.state.admins}]}
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
                  <button className="navBar__button" onClick={()=>this.addRow()} style={{marginLeft:"-490px", width:"100px"}}><p className="navBar__button__text">Add</p></button>
                  <button className="navBar__button" onClick={()=>this.submitChanges()} style={{ width:"100px"}}><p className="navBar__button__text">Save</p></button>              
                </center>
            </div>
          </div>
         
      );
  }
}

export default ProjectsExcel;