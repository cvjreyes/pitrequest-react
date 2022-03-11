import React from 'react';
import 'antd/dist/antd.css';
import { Table } from 'antd';
import Highlighter from 'react-highlight-words';
import './usersDataTable.css'
import { Link } from 'react-router-dom';
import ManageRolesPopUp from '../manageRolesPopUp/manageRolesPopUp';
import ManageProjectsPopUp from '../manageProjectsPopUp/manageProjectsPopUp';
import DeleteUserConfPopUp from '../deleteUserConfPopUp/deleteUserConfPopUp';


class UsersDataTable extends React.Component{
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

  deleteUser(id){
    this.props.deleteUser(id)
  }
  
  

  async componentDidMount(){
    const options = {
      method: "GET",
      headers: {
          "Content-Type": "application/json"
      },

  }


    const rolesBtnsDict = {"Design": <button className="btn"  disabled style={{fontSize:"12px", padding:"2px 5px 2px 5px", marginRight: "5px", backgroundColor:"#00FF7F"}}>DES</button>, 
    "DesignLead": <button className="btn"  disabled style={{fontSize:"12px", padding:"2px 5px 2px 5px", marginRight: "5px", backgroundColor:"lightgreen"}}>LDE</button>, 
    "Stress": <button className="btn"  disabled style={{fontSize:"12px", padding:"2px 5px 2px 5px", marginRight: "5px", backgroundColor:"#00BFFF"}}>STR</button>, 
    "StressLead": <button className="btn"  disabled style={{fontSize:"12px", padding:"2px 5px 2px 5px", marginRight: "5px", backgroundColor:"#87CEEB"}}>LST</button>, 
    "Supports": <button className="btn"  disabled style={{color: "white",fontSize:"12px", padding:"2px 5px 2px 5px", marginRight: "5px", backgroundColor:"#1E90FF"}}>SUP</button>, 
    "SupportsLead": <button className="btn"  disabled style={{color: "white",fontSize:"12px", padding:"2px 5px 2px 5px", marginRight: "5px", backgroundColor:"#6495ED"}}>LSP</button>, 
    "Materials": <button className="btn"  disabled style={{color:"white", fontSize:"12px", padding:"2px 5px 2px 5px", marginRight: "5px", backgroundColor:"#6A5ACD"}}>MAT</button>, 
    "Issuer": <button className="btn"  disabled style={{fontSize:"12px", padding:"2px 5px 2px 5px", marginRight: "5px", backgroundColor:"#FFC0CB"}}>ISS</button>, 
    "SpecialityLead": <button className="btn"  disabled style={{fontSize:"12px", padding:"2px 5px 2px 5px", marginRight: "5px", backgroundColor:"	#FFA500"}}>LOS</button>, 
    "Process": <button className="btn"  disabled style={{color: "white",fontSize:"12px", padding:"2px 5px 2px 5px", marginRight: "5px", backgroundColor:"#FF4500"}}>PRO</button>, 
    "Instrument": <button className="btn"  disabled style={{fontSize:"12px", padding:"2px 5px 2px 5px", marginRight: "5px", backgroundColor:"#FFD700"}}>INS</button>, 
    "Review": <button className="btn"  disabled style={{fontSize:"12px", padding:"2px 5px 2px 5px", marginRight: "5px", backgroundColor:"white"}}>REV</button>,
    "Project": <button className="btn"  disabled style={{fontSize:"12px", color:"white", padding:"2px 5px 2px 5px", marginRight: "5px", backgroundColor:"#F033FF"}}>PRJ</button>,
    "3D Admin": <button className="btn"  disabled style={{width:"32px", color:"white", fontSize:"12px", padding:"2px 5px 2px 5px", marginRight: "5px", backgroundColor:"#CD853F"}}>3D</button>}
    

    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/api/users", options)
        .then(response => response.json())
        .then(async json => {
          for(let i = 0; i < json.length; i++){
              let row = {user_id: json[i].id, username: json[i].name, email: json[i].email, roles: null, projects: null, actions: null}
              let userid = json[i].id
              let users = this.state.users
              users.push(json[i].email)
              this.setState({
                users: users
              })
              const body = {
                  user: json[i].email,
                  id: json[i].id
              }
              let options = {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json"
                  },
                  body: JSON.stringify(body)
              }

              await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/api/roles/user", options)
                  .then(response => response.json())
                  .then(async json => {
                    
                    row["actions"] = <div style={{display:"flex"}}><DeleteUserConfPopUp  deleteUser={this.deleteUser.bind(this)} id={row.user_id} username={row.username}/><ManageRolesPopUp roles={json.roles} id={row.user_id} email={json.email} submitRoles={this.submitRoles.bind(this)}/><ManageProjectsPopUp id={row.user_id} submitProjects={this.submitProjects.bind(this)}/></div>                  
                    let roles = [rolesBtnsDict[json.roles[0]]]
                          for(let j = 1; j < json.roles.length; j++){
                              roles.push(rolesBtnsDict[json.roles[j]])

                          }

                      
                      row["roles"] = <div> {roles} </div>
                      if(i % 2 === 0){
                          row["color"] = "#fff"
                      }else{
                          row["color"] = "#eee"
                      }

                      options = {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json"
                        },
                      }

                      fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getProjectsByUser/"+userid, options)
                      .then(response => response.json())
                      .then(async json =>{
                          const projects = json.codes
                          const projectsBtns = []
                          for(let i = 0; i < projects.length; i++){
                            projectsBtns.push(<button className="btn" disabled style={{fontSize:"12px", padding:"2px 5px 2px 5px", marginRight: "5px", backgroundColor:"white",  border: "1px solid black"}}>{projects[i]}</button>)
                          }
                          row["projects"] = projectsBtns
                          let currentData = this.state.dataAux
                           currentData.push(row)
                           
                           await this.setState({dataAux: currentData})
                      })                     
                  
                      
                  })
              
          }
      })
      const filterRow = [{key:0, username: <div><input type="text" className="filter__input" placeholder="Username" onChange={(e) => this.filter(0, e.target.value)}/></div>, email: <div><input type="text" className="filter__input" placeholder="Email" onChange={(e) => this.filter(1,e.target.value)}/></div>, roles: <div><input type="text" className="filter__input" placeholder="Roles" onChange={(e) => this.filter(2,e.target.value)}/></div>, projects: <div><input type="text" className="filter__input" placeholder="Projects" onChange={(e) => this.filter(3,e.target.value)}/></div>}]
      
      await this.setState({data : this.state.dataAux, selectedRows: [], displayData: this.state.dataAux});
      await this.setState({filters : filterRow})
      await this.setState({mounted: true})
}
  


  async componentDidUpdate(prevProps, prevState){
    if(prevProps !== this.props){
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
    
        }
    
          const rolesBtnsDict = {"Design": <button className="btn"  disabled style={{fontSize:"12px", padding:"2px 5px 2px 5px", marginRight: "5px", backgroundColor:"#00FF7F"}}>DES</button>, 
          "DesignLead": <button className="btn"  disabled style={{fontSize:"12px", padding:"2px 5px 2px 5px", marginRight: "5px", backgroundColor:"lightgreen"}}>LDE</button>, 
          "Stress": <button className="btn"  disabled style={{fontSize:"12px", padding:"2px 5px 2px 5px", marginRight: "5px", backgroundColor:"#00BFFF"}}>STR</button>, 
          "StressLead": <button className="btn"  disabled style={{fontSize:"12px", padding:"2px 5px 2px 5px", marginRight: "5px", backgroundColor:"#87CEEB"}}>LST</button>, 
          "Supports": <button className="btn"  disabled style={{color: "white",fontSize:"12px", padding:"2px 5px 2px 5px", marginRight: "5px", backgroundColor:"#1E90FF"}}>SUP</button>, 
          "SupportsLead": <button className="btn"  disabled style={{color: "white",fontSize:"12px", padding:"2px 5px 2px 5px", marginRight: "5px", backgroundColor:"#6495ED"}}>LSP</button>, 
          "Materials": <button className="btn"  disabled style={{color:"white", fontSize:"12px", padding:"2px 5px 2px 5px", marginRight: "5px", backgroundColor:"#6A5ACD"}}>MAT</button>, 
          "Issuer": <button className="btn"  disabled style={{fontSize:"12px", padding:"2px 5px 2px 5px", marginRight: "5px", backgroundColor:"#FFC0CB"}}>ISS</button>, 
          "SpecialityLead": <button className="btn"  disabled style={{fontSize:"12px", padding:"2px 5px 2px 5px", marginRight: "5px", backgroundColor:"	#FFA500"}}>LOS</button>, 
          "Process": <button className="btn"  disabled style={{color: "white",fontSize:"12px", padding:"2px 5px 2px 5px", marginRight: "5px", backgroundColor:"#FF4500"}}>PRO</button>, 
          "Instrument": <button className="btn"  disabled style={{fontSize:"12px", padding:"2px 5px 2px 5px", marginRight: "5px", backgroundColor:"#FFD700"}}>INS</button>, 
          "Review": <button className="btn"  disabled style={{fontSize:"12px", padding:"2px 5px 2px 5px", marginRight: "5px", backgroundColor:"white"}}>REV</button>,
          "Project": <button className="btn"  disabled style={{fontSize:"12px", color:"white", padding:"2px 5px 2px 5px", marginRight: "5px", backgroundColor:"#F033FF"}}>PRJ</button>,
          "3D Admin": <button className="btn"  disabled style={{width: "32px",color:"white", fontSize:"12px", padding:"2px 5px 2px 5px", marginRight: "5px", backgroundColor:"#CD853F"}}>3D</button>}
          
          await this.setState({dataAux: []})

          await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/api/users", options)
              .then(response => response.json())
              .then(async json => {
                for(let i = 0; i < json.length; i++){
                    
                    let row = {user_id: json[i].id, username: json[i].name, email: json[i].email, roles: null, actions: null}
                    let userid = json[i].id
                    const body = {
                        user: json[i].email,
                        id: json[i].id
                    }
                    let options = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(body)
                    }
    
                    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/api/roles/user", options)
                        .then(response => response.json())
                        .then(async json => {

                          row["actions"] = <div style={{display:"flex"}}><DeleteUserConfPopUp  deleteUser={this.deleteUser.bind(this)} id={row.user_id} username={row.username}/><ManageRolesPopUp roles={json.roles} id={row.user_id} email={json.email} submitRoles={this.submitRoles.bind(this)}/><ManageProjectsPopUp id={row.user_id} submitProjects={this.submitProjects.bind(this)}/></div>                  
                          let roles = [rolesBtnsDict[json.roles[0]]]
                            for(let j = 1; j < json.roles.length; j++){
                                roles.push(rolesBtnsDict[json.roles[j]])
                            }
    
                            row["roles"] = <div> {roles} </div>
                            if(i % 2 === 0){
                                row["color"] = "#fff"
                            }else{
                                row["color"] = "#eee"
                            }

                            options = {
                              method: "GET",
                              headers: {
                                  "Content-Type": "application/json"
                              },
                            }

                            fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getProjectsByUser/"+userid, options)
                            .then(response => response.json())
                            .then(async json =>{
                                const projects = json.codes
                                const projectsBtns = []
                                for(let i = 0; i < projects.length; i++){
                                  projectsBtns.push(<button className="btn" disabled style={{fontSize:"12px", padding:"2px 5px 2px 5px", marginRight: "5px", backgroundColor:"white", border: "1px solid black"}}>{projects[i]}</button>)
                                }
                                row["projects"] = projectsBtns
                                let currentData = this.state.dataAux
                              
                                 currentData.push(row)
                                 await this.setState({dataAux: currentData})
                            })                     
                        })
                    
                }
            })
            await this.setState({data: this.state.dataAux})

            let auxDisplayData = this.state.data
            let resultData = []
            let fil, exists = null
            for(let i = 0; i < auxDisplayData.length; i++){
              exists = true
              for(let column = 0; column < Object.keys(auxDisplayData[i]).length-2; column ++){
                fil = Object.keys(auxDisplayData[i])[column+1]
                if(fil === "roles"){
                  if(this.state.filterData[column] !== "" && this.state.filterData[column]){
                    let filter_roles = this.state.filterData[column].split(" ")
                    for(let r1 = 0; r1 < filter_roles.length; r1++){
                      let exist_role = false
                      for(let r2 = 0; r2 <  auxDisplayData[i][fil].props.children[1].length; r2++){

                          if(auxDisplayData[i][fil].props.children[1][r2].props.children.includes(filter_roles[r1])){
                            exist_role = true
                          }
                        
                      }
                      if(!exist_role){
                        exists = false
                      }
                      
                    }
                    
                  }
                }else{
                  if(auxDisplayData[i][fil]){
                    if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].includes(this.state.filterData[column])){
                      exists = false
                    }
                  }else{
                    exists = false
                  }
                }
                
              }
              if(exists){
                resultData.push(auxDisplayData[i])
              }
            }

            await this.setState({displayData: resultData})
            console.log(this.state.displayData)
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
      for(let column = 0; column < Object.keys(auxDisplayData[i]).length-2; column ++){
        fil = Object.keys(auxDisplayData[i])[column+1]
        if(fil === "roles"){
          if(this.state.filterData[column] !== "" && this.state.filterData[column]){
            let filter_roles = this.state.filterData[column].split(" ")
            for(let r1 = 0; r1 < filter_roles.length; r1++){
              let exist_role = false
              for(let r2 = 0; r2 <  auxDisplayData[i][fil].props.children[1].length; r2++){
                if(auxDisplayData[i][fil].props.children[1][r2].props.children.includes(filter_roles[r1])){
                  exist_role = true
                }    
              }
              if(!exist_role){
                exists = false
              }
              
            }
            
          }
        }else if(fil === "projects"){
          if(this.state.filterData[column] !== "" && this.state.filterData[column]){
            let filter_projects = this.state.filterData[column].split(" ")
            for(let p1 = 0; p1 < filter_projects.length; p1++){
              let exist_pro = false
              for(let p2 = 0; p2 < auxDisplayData[i][fil].length; p2++){
                console.log( auxDisplayData[i][fil][p2])
                if(auxDisplayData[i][fil][p2].props.children.includes(filter_projects[p1])){
                  exist_pro = true
                }    
              }
              if(!exist_pro){
                exists = false
              }
              
            }
            
          }
        
        }else{
          if(auxDisplayData[i][fil]){
            if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].includes(this.state.filterData[column])){
              exists = false
            }
          }else{
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

  submitRoles(id, roles){
    this.props.submitRoles(id, roles)
  }

  submitProjects(id, projects){
    this.props.submitProjects(id, projects)
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
            title: <div className="dataTable__header__text">Username</div>,
            dataIndex: 'username',
            key: 'username',
            ...this.getColumnSearchProps('username'),
            sorter: {
                compare: (a, b) => { return a.username.localeCompare(b.username)},
            },
        },
          
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
        title: <div className="dataTable__header__text">Roles</div>,
        dataIndex: 'roles',
        key: 'roles',
        ...this.getColumnSearchProps('roles'),
      },
      {
        title: <div className="dataTable__header__text">Projects</div>,
        dataIndex: 'projects',
        key: 'projects',
        width: "350px",
        ...this.getColumnSearchProps('projects'),
      },
      {
        title: <div className="dataTable__header__text">Actions</div>,
        dataIndex: 'actions',
        key: 'actions',
        width: '250px',
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

export default UsersDataTable;