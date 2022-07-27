import React from 'react';
import 'antd/dist/antd.css';
import { Table } from 'antd';
import Highlighter from 'react-highlight-words';
import { Link } from 'react-router-dom';
import './requestAccessDataTable.css'

class RequestAccessDataTable extends React.Component{
  state = {
    searchText: '',
    searchedColumn: '',
    data: [],
    displayData: [],
    filterData: ["", "", "", "", "", "", ""],
    weights: [],
    role: this.props.role,
    selectedRows: [],
    selectedRowsKeys: [],
    dataAux : [],
    update: this.props.updateData,
    users: [],
    mounted: false,
    filters: []
  };

  rejectRequest(id){
    this.props.rejectRequest(id)
  }
  
  acceptRequest(id){
    this.props.acceptRequest(id)
  }

  async componentDidMount(){
    const options = {
      method: "GET",
      headers: {
          "Content-Type": "application/json"
      },

    }


    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getAccessRequests/" + this.props.user, options)
        .then(response => response.json())
        .then(async json => {
          let row = []
          let rows = []
          for(let i = 0; i < json.requests.length; i++){
            row = {email: json.requests[i].email, project: json.requests[i].name + " (" +  json.requests[i].code + ")", actions: <div><button className="btn"  style={{padding:"2px 5px 2px 5px", marginRight:"5px", marginLeft:"5px", width:"90px", fontSize:"12px", float:"right", backgroundColor:"#DC143C", color:"white"}} onClick={() => this.rejectRequest(json.requests[i].id)}>REJECT</button><button className="btn"  style={{padding:"2px 5px 2px 5px", marginRight:"5px", marginLeft:"5px", width:"90px", fontSize:"12px", float:"right", backgroundColor:"#78B28A", color:"white"}} onClick={() => this.acceptRequest(json.requests[i].id)}>ACCEPT</button></div>}
           
            if(json.requests[i].project_name){
              row.project = json.requests[i].project_name 
              row.actions = ""
              row.status = "Not in PITRequest"
              row["color"] = "#yyy"
            }

            if(json.requests[i].status === 0){
              row.status = "Pending"
              row["color"] = "#fff"
            }else if(json.requests[i].status === 1){
              row.status = "Accepted"
              row.actions = ""
              row["color"] = "#ggg"
            }else if(json.requests[i].status === 2){
              row.status = "Rejected"
              row.actions = ""
              row["color"] = "#rrr"
            }

            rows.push(row)
            }
          await this.setState({data : rows, selectedRows: [], displayData: rows});
          
      })
      const filterRow = [{key:0, email: <div><input type="text" className="filter__input" placeholder="Email" onChange={(e) => this.filter(0,e.target.value)}/></div>, project: <div><input type="text" className="filter__input" placeholder="Project" onChange={(e) => this.filter(1,e.target.value)}/></div>, status: <div><input type="text" className="filter__input" placeholder="Status" onChange={(e) => this.filter(3,e.target.value)}/></div>}]
      
      await this.setState({filters : filterRow})
}
  


  async componentDidUpdate(prevProps, prevState){
    if(prevProps !== this.props){
      const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
  
    }
  
  
    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getAccessRequests/" + this.props.user, options)
    .then(response => response.json())
    .then(async json => {
      let row = []
      let rows = []
      for(let i = 0; i < json.requests.length; i++){
            row = {email: json.requests[i].email, project: json.requests[i].name + " (" +  json.requests[i].code + ")", actions: <div><button className="btn"  style={{padding:"2px 5px 2px 5px", marginRight:"5px", marginLeft:"5px", width:"90px", fontSize:"12px", float:"right", backgroundColor:"#DC143C", color:"white"}} onClick={() => this.rejectRequest(json.requests[i].id)}>REJECT</button><button className="btn"  style={{padding:"2px 5px 2px 5px", marginRight:"5px", marginLeft:"5px", width:"90px", fontSize:"12px", float:"right", backgroundColor:"#78B28A", color:"white"}} onClick={() => this.acceptRequest(json.requests[i].id)}>ACCEPT</button></div>}

            if(json.requests[i].project_name){
              row.project = json.requests[i].project_name 
              row.actions = ""
              row.status = "Not in PITRequest"
              row["color"] = "#yyy"
            }
            if(json.requests[i].status === 0){
              row.status = "Pending"
              row["color"] = "#fff"
            }else if(json.requests[i].status === 1){
              row.status = "Accepted"
              row.actions = ""
              row["color"] = "#ggg"
            }else if(json.requests[i].status === 2){
              row.status = "Rejected"
              row.actions = ""
              row["color"] = "#rrr"
            }

            rows.push(row)
        }
      await this.setState({data : rows, selectedRows: [], displayData: rows});
      
    })
    
    }
  }

  async filter(column, value){
    let fd = this.state.filterData
    fd[column] = value
    await this.setState({filterData: fd})

    let auxDisplayData = this.state.data
    let resultData = []
    let fil, exists = null
    for(let i = 0; i < auxDisplayData.length; i++){
      exists = true
      for(let column = 0; column < Object.keys(auxDisplayData[i]).length-1; column ++){
        fil = Object.keys(auxDisplayData[i])[column]
        if(auxDisplayData[i][fil]){
          if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].includes(this.state.filterData[column])){
            exists = false
          }
        }else{
          if(fil !== "actions"){
            exists = false
          }
        }
      }
      if(exists){
        resultData.push(auxDisplayData[i])
      }
    }
    await this.setState({displayData: resultData})
  }
  
  getColumnSearchProps = dataIndex => ({
    render: text =>
    text != null ? (
    text.props && text.type !== "div" ? (
      <Link onClick={() => this.getMaster(text.props.children)}>{text.props.children}</Link>
    ) : this.state.searchedColumn === dataIndex ? (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text ? text : ''}
      />
    ) : (
      text
    )
    ) : (
      text
    )
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
    this.props.onChange(ids);
  };


  render() {

    const columns = [
      {
        title: <center className="dataTable__header__text">Email</center>,
        dataIndex: 'email',
        key: 'email',
        ...this.getColumnSearchProps('email'),
        sorter:{
          compare: (a, b) => a.email.localeCompare(b.email),
        },
      },
      {
        title: <div className="dataTable__header__text">Project</div>,
        dataIndex: 'project',
        key: 'project',
        ...this.getColumnSearchProps('project'),
      },
      {
        title: <div className="dataTable__header__text">Status</div>,
        dataIndex: 'status',
        key: 'status',
        ...this.getColumnSearchProps('status'),
      },
      {
        title: <div className="dataTable__header__text">Actions</div>,
        dataIndex: 'actions',
        key: 'actions',
        width: '220px',
        ...this.getColumnSearchProps('actions'),
      }
    ];



    return (
      <div>
        {this.state.update}
        <div className="dataTable__container">
        <Table className="customTable" bordered = {true} columns={columns} style={{ height: '540px' }} dataSource={this.state.displayData} scroll={{y:437}} pagination={{disabled:true, defaultPageSize:5000}} size="small" rowClassName= {(record) => record.color.replace('#', '')}/>
        <Table className="filter__table" pagination={{disabled:true}} scroll={{y:437}} showHeader = {false} bordered = {true} columns={columns} dataSource={this.state.filters} size="small"/>
          <div style={{position: "absolute", bottom:25, left:0}}>
            <b>Total elements: {this.state.data.length}</b>
          </div>
        </div>
        
      </div>
    );
  }
}

export default RequestAccessDataTable;