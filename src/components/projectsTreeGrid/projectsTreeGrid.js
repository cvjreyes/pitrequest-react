import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './projectsTreeGrid.css'

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
      rowStyle:{fontSize: "22px", }
    };
    
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
          console.log(this.state.tree_nodes)
        }
        await this.setState({rowData: nodes})
    })

    
    })
    this.gridApi.forEachNode(node => {
      if(node.data){
        if(node.data.checked === true){
          node.setSelected(true)
        }
      }
    });
    

  };

  isRowSelectable = function(rowNode) {
    return rowNode.data ? rowNode.data.subtask : false;
  }


  render() {
    return (
      <div style={{ width: '100%', height: '100%', marginTop:"230px", marginLeft:"200px" }}>
        <div
          style={{
            height: '700px',
            width: '700px',
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
    );
  }
}

export default ProjectsTreeGrid;