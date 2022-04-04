import React from 'react';
import 'antd/dist/antd.css';
import { Table } from 'antd';
import './projectsHoursDataTable.css'
import ChangeAdminPopUp from '../changeAdminPopUp/changeAdminPopUp';

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

class ProjectsHoursDataTable extends React.Component{
  state = {
    searchText: '',
    searchedColumn: '',
    data: [],
    tab: this.props.currentTab,
    selectedRows: [],
    selectedRowsKeys: [],
    updateData: this.props.updateData,
  };

  async componentDidMount(){
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
  
    }
    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getProjectsTotalHours", options)
    .then(response => response.json())
    .then(async json => {
        let rows = []
        let row = {}
        for(let i = 0; i < json.projects.length; i++){
            row = {project: json.projects[i].name, hours: json.projects[i].hours, estimated: json.projects[i].estimated}
            rows.push(row)
        }
        await this.setState({data : rows, selectedRows: []});
    })
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
        title: <center className="dataTable__header__text">Project</center>,
        dataIndex: 'project',
        key: 'project',
        ...this.getColumnSearchProps('project'),
        sorter:{
          compare: (a, b) => a.project.localeCompare(b.project),
        },
      },
      {
        title: <center className="dataTable__header__text">Hours</center>,
        dataIndex: 'hours',
        key: 'hours',
        ...this.getColumnSearchProps('hours'),
        sorter:{
          compare: (a, b) => a.hours.localeCompare(b.hours),
        },
      },
      {
        title: <center className="dataTable__header__text">Estimated</center>,
        dataIndex: 'estimated',
        key: 'estimated',
        ...this.getColumnSearchProps('estimated'),
        sorter:{
          compare: (a, b) => a.estimated.localeCompare(b.estimated),
        },
      },
    ]

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
        <Table className="customTable" bordered = {true} columns={columns} dataSource={this.state.data} style={{ height: '540px' }} scroll={{y:437}} pagination={{disabled:true, defaultPageSize:5000}} size="small"/>
          {totalElements}
        </div>
        
      </div>
    );
  }
}

export default ProjectsHoursDataTable;