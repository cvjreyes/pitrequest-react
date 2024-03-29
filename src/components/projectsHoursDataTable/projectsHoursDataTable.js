import React from 'react';
import 'antd/dist/antd.css';
import { Table } from 'antd';
import './projectsHoursDataTable.css'
import CopyIcon from "../../assets/images/Notepad.png"

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

class ProjectsHoursDataTable extends React.Component{ //Tabla de las horas de los proyectos
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
    //Get de los proyectos y las horas
    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getProjectsTotalHours", options)
    .then(response => response.json())
    .then(async json => {
        let rows = []
        let row = {}
        for(let i = 0; i < json.projects.length; i++){
            row = {project: <div style={{display: "flex", height: "30px"}}><button className="copy__users__button" onClick={()=>this.copyUsersByProject(json.projects[i].id)}><img src={CopyIcon} alt="save" className="copy__icon"></img></button><p>{json.projects[i].name}</p></div>, hours: json.projects[i].hours, estimated: json.projects[i].estimated}
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
  
  async copyUsersByProject(project_id){
    const options = {
      method: "GET",
      headers: {
          "Content-Type": "application/json"
      },
    }

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getUsersByProject/" + project_id, options)
        .then(response => response.json())
        .then(async json => {
          let emails = ""
          for (let i = 0; i < json.emails.length; i++) {
            emails += json.emails[i].email + ";"
          }
          if (navigator.clipboard && window.isSecureContext) {
            // navigator clipboard api method'
            return navigator.clipboard.writeText(emails);
          } else {
              // text area method
              let textArea = document.createElement("textarea");
              textArea.value = emails;
              // make the textarea out of viewport
              textArea.style.position = "fixed";
              textArea.style.left = "-999999px";
              textArea.style.top = "-999999px";
              document.body.appendChild(textArea);
              textArea.focus();
              textArea.select();
              return new Promise((res, rej) => {
                  // here the magic happens
                  document.execCommand('copy') ? res() : rej();
                  textArea.remove();
              });
          }
        })
  }

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
      totalElements = (<div style={{position: "absolute", margin:"20px 2000px 20px 20px"}}>
      <b>Total elements: {this.state.data.length}</b>
     </div>);
    }
    return (
      <div>
        {this.state.updateData}
        <div className="estimatedDataTable__container" style={{width:"auto"}}>
        <Table className="customTable" bordered = {true} columns={columns} dataSource={this.state.data} style={{ height: '540px' }} scroll={{y:490}} pagination={{disabled:true, defaultPageSize:5000}} size="small"/>
          {totalElements}
        </div>
        
      </div>
    );
  }
}

export default ProjectsHoursDataTable;