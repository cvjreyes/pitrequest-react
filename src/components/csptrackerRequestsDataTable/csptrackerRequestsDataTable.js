import React from 'react';
import './csptrackerRequestsDataTable.css'
import 'antd/dist/antd.css';
import { Table, Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Trash from "../../assets/images/Trash.png"

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

class CSPTrackerdRequestsDataTable extends React.Component{ //Tabla de requests de sp
  state = {
    searchText: '',
    searchedColumn: '',
    data: [],
    tab: this.props.currentTab,
    selectedRows: [],
    selectedRowsKeys: [],
    updateData: this.props.updateData,
    username: "",
    acronyms : null,
    steps: []
  };

  async markAsRead(id){ //Marcar una request como leida
    const body = {
      id: id,
      user: secureStorage.getItem("user")
    }
    const options = {
      method: "POst",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/markAsRead", options)
    .then(response => response.json())
    .then(json =>{
      this.props.updateDataMethod()
    })

  }

  async markAsUnread(id){ //Marcar como no leida
    const body = {
      id: id,
      user: secureStorage.getItem("user")
    }
    const options = {
      method: "POst",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/markAsUnread", options)
    .then(response => response.json())
    .then(json =>{
      this.props.updateDataMethod()
    })
  }

  async accept(id){ //Aceptar una request (cuando se acepta la request se crea el sp correspondiente)
    const body = {
      id: id,
      email: secureStorage.getItem("user")
    }
    const options = {
      method: "POst",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/acceptRequest", options)
    .then(response => response.json())
    .then(json =>{
      this.props.updateDataMethod()
    })
  }

  async reject(id){ //Rechazar una request
    const body = {
      id: id,
      email: secureStorage.getItem("user")
    }
    const options = {
      method: "POst",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/rejectRequest", options)
    .then(response => response.json())
    .then(json =>{
      this.props.updateDataMethod()
    })
  }

  async deleteNotification(id){ //Eliminar la request para que no salga en la bandeja
    const body = {
      id: id,
      user: secureStorage.getItem("user")
    }
    const options = {
      method: "POst",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/deleteCSPNotification", options)
    .then(response => response.json())
    .then(json =>{
      this.props.updateDataMethod()
    })
  }

  async componentDidMount(){

    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }

    //Get de las requests de sptracker
    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/csptrackerRequests/"+ secureStorage.getItem("user"), options)
            .then(response => response.json())
            .then(async json => {
                var rows = []
                var row = null
                for(let i = 0; i < json.rows.length; i++){//Por cada request
                  //Cremos la fila
                    row = {key:i, tag: json.rows[i].tag, pid: json.rows[i].pid, sptag: json.rows[i].sptag, project: json.rows[i].name}
                    if(json.rows[i].read === 0){ //Dependiendo del estado ponemos unos botones o otros
                      row.actions = <div className="request__buttons__container">
                          <button className="read__button btn-info" onClick={()=>this.markAsRead(json.rows[i].id)}>Mark as read</button>
                          <button className="accept__button btn-success" onClick={()=>this.accept(json.rows[i].id)}>Accept</button>
                          <button className="reject__button btn-danger" onClick={()=>this.reject(json.rows[i].id)}>Reject</button>
                      </div>
                      row["color"] = "#ddd"
                  }else if(json.rows[i].read === 1){ //Si esta leida
                      row.actions = <div className="request__buttons__container">
                        <button className="unread__button btn-info" onClick={()=>this.markAsUnread(json.rows[i].id)}>Mark as unread</button>
                          <button className="accept__button btn-success" onClick={()=>this.accept(json.rows[i].id)}>Accept</button>
                          <button className="reject__button btn-danger" onClick={()=>this.reject(json.rows[i].id)}>Reject</button>
                      </div>
                      row["color"] = "#www"
                  }else if(json.rows[i].read === 2){ //Si esta aceptada
                    row.actions = <div className="request__buttons__container">
                        <button className="accept__button btn-success" disabled style={{opacity: "0.6"}}  onClick={()=>this.accept(json.rows[i].id)}>Accepted</button>
                        <button className="delete__button" onClick={()=>this.deleteNotification(json.rows[i].id)}>&nbsp;<img src={Trash} alt="trash" className="trash__icon" style={{marginRight:"0px"}}></img></button>                 
                    </div>
                    row["color"] = "#www"
                  }else if(json.rows[i].read === 3){ //Si esta rechazada
                    row.actions = <div className="request__buttons__container">
                        <button className="reject__button btn-danger" disabled style={{opacity: "0.6"}}  onClick={()=>this.accept(json.rows[i].id)}>Rejected</button>
                        <button className="delete__button" onClick={()=>this.deleteNotification(json.rows[i].id)}>&nbsp;<img src={Trash} alt="trash" className="trash__icon" style={{marginRight:"0px"}}></img></button>                 
                    </div>
                    row["color"] = "#www"
                  }

                rows.push(row)
                }
                await this.setState({data: rows})
            })
            .catch(error => {
                console.log(error);
            }) 
            

  }


  async componentDidUpdate(prevProps, prevState){

    
    if(prevProps !== this.props){
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }

        fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/csptrackerRequests/"+ secureStorage.getItem("user"), options)
            .then(response => response.json())
            .then(async json => {
                var rows = []
                var row = null
                for(let i = 0; i < json.rows.length; i++){
                  row = {key:i, tag: json.rows[i].tag, pid: json.rows[i].pid, sptag: json.rows[i].sptag, project: json.rows[i].name}
                  if(json.rows[i].read === 0){
                      row.actions = <div className="request__buttons__container">
                          <button className="read__button btn-info" onClick={()=>this.markAsRead(json.rows[i].id)}>Mark as read</button>
                          <button className="accept__button btn-success" onClick={()=>this.accept(json.rows[i].id)}>Accept</button>
                          <button className="reject__button btn-danger" onClick={()=>this.reject(json.rows[i].id)}>Reject</button>
                      </div>
                      row["color"] = "#ddd"
                  }else if(json.rows[i].read === 1){
                      row.actions = <div className="request__buttons__container">
                        <button className="unread__button btn-info" onClick={()=>this.markAsUnread(json.rows[i].id)}>Mark as unread</button>
                          <button className="accept__button btn-success" onClick={()=>this.accept(json.rows[i].id)}>Accept</button>
                          <button className="reject__button btn-danger" onClick={()=>this.reject(json.rows[i].id)}>Reject</button>
                      </div>
                      row["color"] = "#www"
                  }else if(json.rows[i].read === 2){
                    row.actions = <div className="request__buttons__container">
                        <button className="accept__button btn-success" disabled style={{opacity: "0.6"}} onClick={()=>this.accept(json.rows[i].id)}>Accepted</button>
                        <button className="delete__button" onClick={()=>this.deleteNotification(json.rows[i].id)}>&nbsp;<img src={Trash} alt="trash" className="trash__icon" style={{marginRight:"0px"}}></img></button>                 
                    </div>
                    row["color"] = "#www"
                  }else if(json.rows[i].read === 3){
                    row.actions = <div className="request__buttons__container">
                        <button className="reject__button btn-danger" disabled style={{opacity: "0.6"}}  onClick={()=>this.accept(json.rows[i].id)}>Rejected</button>
                        <button className="delete__button" onClick={()=>this.deleteNotification(json.rows[i].id)}>&nbsp;<img src={Trash} alt="trash" className="trash__icon" style={{marginRight:"0px"}}></img></button>                 
                    </div>
                    row["color"] = "#www"
                  }

                rows.push(row)
                }
                await this.setState({data: rows})
            })
            .catch(error => {
                console.log(error);
            })   
                    
        }

  }
  

  
  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>


      
        record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
          


    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: text => 
      
      text
    
      
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

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

    const columns = [
      {
        title: <center className="dataTable__header__text">TAG</center>,
        dataIndex: 'tag',
        key: 'tag',
        ...this.getColumnSearchProps('tag'),
        sorter:{
          compare: (a, b) => a.tag.localeCompare(b.tag),
        },
      },
      {
        title: <center className="dataTable__header__text">PROJECT</center>,
        dataIndex: 'project',
        key: 'project',
        ...this.getColumnSearchProps('project'),
        sorter:{
          compare: (a, b) => a.project.localeCompare(b.project),
        },
      },
      {
        title: <center className="dataTable__header__text">P&ID</center>,
        dataIndex: 'pid',
        key: 'pid',
        ...this.getColumnSearchProps('pid'),
        sorter:{
          compare: (a, b) => a.pid.localeCompare(b.pid),
        },
      },
      {
        title: <div className="dataTable__header__text">SP TAG</div>,
        dataIndex: 'sptag',
        key: 'sptag',
        ...this.getColumnSearchProps('sptag'),
        sorter: {
            compare: (a, b) => a.sptag - b.sptag,
        },
      },
      {
        title: <center className="dataTable__header__text">ACTIONS</center>,
        dataIndex: 'actions',
        key: 'actions',
        ...this.getColumnSearchProps('actions'),
        sorter:{
          compare: (a, b) => a.actions.localeCompare(b.actions),
        },
        width: "800px"
      },
    ]

    var totalElements = null;
    if (this.state.data.length === 0){
      totalElements = null;
    }else{
      totalElements = (<div style={{position: "absolute", margin:"-30px 2050px -20px -20px"}}>
      <b>Total elements: {this.state.data.length}</b>
     </div>);
    }

    return (
      <div>
        {this.state.updateData}
        <div className="estimatedDataTable__container" style={{width:"auto"}}>
        <Table className="customTable" bordered = {true} columns={columns} dataSource={this.state.data} scroll={{y:437}} pagination={{disabled:true, defaultPageSize:5000}} size="small"
         rowClassName= {(record) => record.color.replace('#', '')}/>
          {totalElements}
        </div>
        
      </div>
    );
  }
}

export default CSPTrackerdRequestsDataTable;