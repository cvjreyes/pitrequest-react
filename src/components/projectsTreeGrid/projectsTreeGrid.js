import React from 'react';
import './projectsTreeGrid.css';
//ag-Grid
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
class ProjectsTreeGrid extends React.Component {
  //initialize array variable
  constructor(props) {
    //super is used to access the variables to parent classes
    super(props);
    //ag-Grid columns and rows defining
    this.state = {
      columnDefs: [{
        headerName: "Make", field: "make", sortable: true, filter: true
      }, {
        headerName: "Model", field: "model"
      }, {
        headerName: "Price", field: "price"
      }],
      rowData: [{
        make: "Toyota", model: "Celica", price: 35000
      }, {
        make: "Ford", model: "Mondeo", price: 32000
      }, {
        make: "Porsche", model: "Boxter", price: 72000
      }]
    }
  }
  //ag-Grid hook ready
  onGridReady = params => {
    this.gridApi = params.api;
    
  };
  //ag-Grid add new row functions
  onAddRow = () => {
    
    this.gridApi.updateRowData({
      add: [{ make: 'BMW', model: 'S2', price: '63000' }]
         });
}
 
  
render() {
  //output for browser
  return (
    <div className="container">
      <h1 className="text-center mt-5 mb-5">Reactjs ag-Grid Add New Row</h1>
      <button className="btn btn-primary mb-3" onClick={this.onAddRow}>Add Row</button>
      <div
        className="ag-theme-alpine"
        style={{
        height: '350px',
        width: '603px' }}
      >
        <AgGridReact
          onGridReady={this.onGridReady}
          columnDefs={this.state.columnDefs}
          rowData={this.state.rowData}>
        </AgGridReact>
    </div>
  </div>
  );
  
}
}
export default ProjectsTreeGrid;