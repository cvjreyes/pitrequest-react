import React from 'react';
import './csptrackerExpansionJoinsDataTable.css'
import 'antd/dist/antd.css';
import { Table, Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

class CSPtrackerExpansionJoinsDataTable extends React.Component{
  state = {
    searchText: '',
    searchedColumn: '',
    data: [],
    displayData: [],
    filterData: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    tab: this.props.currentTab,
    selectedRows: [],
    selectedRowsKeys: [],
    updateData: this.props.updateData,
    username: "",
    acronyms : null,
    steps: [],
    filters: []
  };

  async readyE3D(id){
    const body = {
      id: id
    }

    const options = {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
  }


  fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/expansionJoinsReadye3d", options)
      .then(response => response.json())
      .then(
        this.props.updateDataMethod()
      )
  }

  async cancelReadyE3D(id){
    const body = {
      id: id
    }

    const options = {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
  }


  fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/expansionJoinsCancelReadye3d", options)
      .then(response => response.json())
      .then(
        this.props.updateDataMethod()
        )
  }

  async deleteExpansionJoin(id){
    const body = {
      id: id
    }

    const options = {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }

    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/deleteExpansionJoin", options)
      .then(response => response.json())
      .then(
        this.props.updateDataMethod()
      )
  }
  
  async excludeExpansionJoin(id){
    const body = {
      id: id
    }

    const options = {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }

    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/excludeExpansionJoin", options)
      .then(response => response.json())
      .then(
        this.props.updateDataMethod()
      )
  }

  async updateData(){
    this.props.updateDataMethod()
  }

  async componentDidMount(){

    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }


    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getExpansionJoinsByProject/"+ this.props.currentProject, options)
        .then(response => response.json())
        .then(async json => {
          var rows = []
          var row = null
          for(let i = 0; i < json.rows.length; i++){
            row = {key:i, id: json.rows[i].id, tag: json.rows[i].tag, spec: json.rows[i].spec, p1bore: json.rows[i].p1bore, p2bore: json.rows[i].p2bore, rating: json.rows[i].rating, end_preparation: json.rows[i].end_preparation, description_iso: json.rows[i].description_iso, face_to_face: json.rows[i].face_to_face, bolt_type: json.rows[i].bolt_type, ready_load: json.rows[i].ready_load, ready_load_date: json.rows[i].ready_load_date, ready_e3d: json.rows[i].ready_e3d, ready_e3d_date: json.rows[i].ready_e3d_date, comments: json.rows[i].comments, updated: json.rows[i].updated}

            if(json.rows[i].ready_load_date){
              row.ready_load_date = json.rows[i].ready_load_date.toString().substring(0,10) + " "+ json.rows[i].ready_load_date.toString().substring(11,19)
            }else{
              row.ready_load_date = ""
            }

            if(json.rows[i].ready_e3d_date){
              row.ready_e3d_date = json.rows[i].ready_e3d_date.toString().substring(0,10) + " "+ json.rows[i].ready_e3d_date.toString().substring(11,19)
            }else{
              row.ready_e3d_date = ""
            }
            
            if(json.rows[i].updated === 2){
              row.ready_load = "DELETED"
              row.ready_e3d = "DELETED"
              row.color = "#rrr"
            }else if(json.rows[i].ready_e3d === 2){
              row.ready_load = "READY"
              row.ready_e3d = "EXCLUDED"
              row.color = "#ppp"
            }else{

              if(row.ready_load === 1 && json.rows[i].drawing_filename !== null && json.rows[i].updated === 1 && json.rows[i].ready_e3d === 0){
                row.ready_load = "UPDATED"
                row.color = "#yyy"
                  if(this.props.currentRole === "3D Admin"){
                    row.ready_e3d = <button class="ready__btn btn-sm btn-success" onClick={() => this.readyE3D(json.rows[i].id)}>READY</button>
                  }else{
                    row.ready_e3d = "NOT READY"
                  }
                }else if(row.ready_load === 1 && json.rows[i].drawing_filename !== null ){
                  row.ready_load = "READY"
                if(row.ready_e3d === 1){
                  if(json.rows[i].updated === 0){
                    row.color = "#ggg"
                    if(this.props.currentRole === "3D Admin"){
                      row.ready_e3d = <button class="csp__cancel__btn btn-sm btn-danger" onClick={() => this.cancelReadyE3D(json.rows[i].id)}>CANCEL</button>
                    }else{
                      row.ready_e3d = "READY"
                      row.ready_load = <div>READY <button class="csp_delete_btn btn-sm btn-danger" onClick={() => this.deleteExpansionJoin(json.rows[i].id)}>DELETE</button></div>
                    }
                  }else{
                    row.color = "#bbb"
                    if(this.props.currentRole === "3D Admin"){
                      row.ready_e3d = <button class="csp__cancel__btn btn-sm btn-danger" onClick={() => this.cancelReadyE3D(json.rows[i].id)}>CANCEL</button>
                    }else{
                      row.ready_e3d = "READY"
                      row.ready_load = <div>READY <button class="csp_delete_btn btn-sm btn-danger" onClick={() => this.deleteExpansionJoin(json.rows[i].id)}>DELETE</button></div>
                    }
                  }
                  
                }else{
                  row.color = "#yyy"
                  if(this.props.currentRole === "3D Admin"){
                    row.ready_e3d = <button class="ready__btn btn-sm btn-success" onClick={() => this.readyE3D(json.rows[i].id)}>READY</button>
                  }else{
                    row.ready_e3d = "NOT READY"
                    row.ready_load = <div>READY <button class="csp_delete_btn btn-sm btn-danger" onClick={() => this.deleteExpansionJoin(json.rows[i].id)}>DELETE</button><button class="csp_exclude_btn btn-sm btn-danger" onClick={() => this.excludeExpansionJoin(json.rows[i].id)}>EXCLUDE 3D</button></div>
                  }
                }
                
              }else{
                row.ready_load = "NOT READY"
                row.color = "white"
                if(this.props.currentRole === "3D Admin"){
                  row.ready_e3d = <button disabled class="ready__disabled btn-sm btn-success">READY</button>
                }else{
                  row.ready_e3d = "NOT READY"
                  row.ready_load = <div>NOT READY<button class="csp_delete_btn btn-sm btn-danger" onClick={() => this.deleteExpansionJoin(json.rows[i].id)}>DELETE</button></div>
                }
              }
            }
            

            for (const [key, value] of Object.entries(row)) {
              if(!value){
                row[key] = ""
              }
            }

            if(json.rows[i].type){
              row.type = <b>{json.rows[i].type}</b>
            }else{
              <b> </b>
            }

            if(json.rows[i].tag){
              row.tag = <b>{json.rows[i].tag}</b>
            }else{
              <b> </b>
            }

            rows.push(row)
          }
         
          
          this.setState({data: rows, displayData: rows})
          
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

      fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getExpansionJoinsByProject/"+ this.props.currentProject, options)
      .then(response => response.json())
        .then(async json => {
          var rows = []
          var row = null
          for(let i = 0; i < json.rows.length; i++){
            row = {key:i, id: json.rows[i].id, tag: json.rows[i].tag, spec: json.rows[i].spec, p1bore: json.rows[i].p1bore, p2bore: json.rows[i].p2bore, rating: json.rows[i].rating, end_preparation: json.rows[i].end_preparation, description_iso: json.rows[i].description_iso, face_to_face: json.rows[i].face_to_face, bolt_type: json.rows[i].bolt_type, ready_load: json.rows[i].ready_load, ready_load_date: json.rows[i].ready_load_date, ready_e3d: json.rows[i].ready_e3d, ready_e3d_date: json.rows[i].ready_e3d_date, comments: json.rows[i].comments, updated: json.rows[i].updated}

            if(json.rows[i].ready_load_date){
              row.ready_load_date = json.rows[i].ready_load_date.toString().substring(0,10) + " "+ json.rows[i].ready_load_date.toString().substring(11,19)
            }else{
              row.ready_load_date = ""
            }

            if(json.rows[i].ready_e3d_date){
              row.ready_e3d_date = json.rows[i].ready_e3d_date.toString().substring(0,10) + " "+ json.rows[i].ready_e3d_date.toString().substring(11,19)
            }else{
              row.ready_e3d_date = ""
            }
            
            if(json.rows[i].updated === 2){
              row.ready_load = "DELETED"
              row.ready_e3d = "DELETED"
              row.color = "#rrr"
            }else if(json.rows[i].ready_e3d === 2){
              row.ready_load = "READY"
              row.ready_e3d = "EXCLUDED"
              row.color = "#ppp"
            }else{

              if(row.ready_load === 1 && json.rows[i].drawing_filename !== null && json.rows[i].updated === 1 && json.rows[i].ready_e3d === 0){
                row.ready_load = "UPDATED"
                row.color = "#yyy"
                  if(this.props.currentRole === "3D Admin"){
                    row.ready_e3d = <button class="ready__btn btn-sm btn-success" onClick={() => this.readyE3D(json.rows[i].id)}>READY</button>
                  }else{
                    row.ready_e3d = "NOT READY"
                  }
                }else if(row.ready_load === 1 && json.rows[i].drawing_filename !== null ){
                  row.ready_load = "READY"
                if(row.ready_e3d === 1){
                  if(json.rows[i].updated === 0){
                    row.color = "#ggg"
                    if(this.props.currentRole === "3D Admin"){
                      row.ready_e3d = <button class="csp__cancel__btn btn-sm btn-danger" onClick={() => this.cancelReadyE3D(json.rows[i].id)}>CANCEL</button>
                    }else{
                      row.ready_e3d = "READY"
                      row.ready_load = <div>READY <button class="csp_delete_btn btn-sm btn-danger" onClick={() => this.deleteExpansionJoin(json.rows[i].id)}>DELETE</button></div>
                    }
                  }else{
                    row.color = "#bbb"
                    if(this.props.currentRole === "3D Admin"){
                      row.ready_e3d = <button class="csp__cancel__btn btn-sm btn-danger" onClick={() => this.cancelReadyE3D(json.rows[i].id)}>CANCEL</button>
                    }else{
                      row.ready_e3d = "READY"
                      row.ready_load = <div>READY <button class="csp_delete_btn btn-sm btn-danger" onClick={() => this.deleteExpansionJoin(json.rows[i].id)}>DELETE</button></div>
                    }
                  }
                  
                }else{
                  row.color = "#yyy"
                  if(this.props.currentRole === "3D Admin"){
                    row.ready_e3d = <button class="ready__btn btn-sm btn-success" onClick={() => this.readyE3D(json.rows[i].id)}>READY</button>
                  }else{
                    row.ready_e3d = "NOT READY"
                    row.ready_load = <div>READY <button class="csp_delete_btn btn-sm btn-danger" onClick={() => this.deleteExpansionJoin(json.rows[i].id)}>DELETE</button><button class="csp_exclude_btn btn-sm btn-danger" onClick={() => this.excludeExpansionJoin(json.rows[i].id)}>EXCLUDE 3D</button></div>
                  }
                }
                
              }else{
                row.ready_load = "NOT READY"
                row.color = "white"
                if(this.props.currentRole === "3D Admin"){
                  row.ready_e3d = <button disabled class="ready__disabled btn-sm btn-success">READY</button>
                }else{
                  row.ready_e3d = "NOT READY"
                  row.ready_load = <div>NOT READY<button class="csp_delete_btn btn-sm btn-danger" onClick={() => this.deleteExpansionJoin(json.rows[i].id)}>DELETE</button></div>
                }
              }
            }
            

            for (const [key, value] of Object.entries(row)) {
              if(!value){
                row[key] = ""
              }
            }

            if(json.rows[i].type){
              row.type = <b>{json.rows[i].type}</b>
            }else{
              <b> </b>
            }

            if(json.rows[i].tag){
              row.tag = <b>{json.rows[i].tag}</b>
            }else{
              <b> </b>
            }

          
            rows.push(row)
              
            }
            await this.setState({data: rows})
            let auxDisplayData = this.state.data
            let resultData = []
            let fil, exists = null
            for(let i = 0; i < auxDisplayData.length; i++){
              exists = true
              for(let column = 0; column < Object.keys(auxDisplayData[i]).length-2; column ++){
                fil = Object.keys(auxDisplayData[i])[column+1]
                if(this.props.currentRole === "3D Admin"){
                  if(fil === "tag" || fil === "type" || fil === "ready_e3d"){
                    if(!auxDisplayData[i][fil].props && this.state.filterData[column]){
                      exists = false
                    }else if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].props.children.includes(this.state.filterData[column])){
                      exists = false
                    }   
                  }else{
                    if(auxDisplayData[i][fil]){
                      if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].toString().includes(this.state.filterData[column])){
                        exists = false
                      }
                    }else if(this.state.filterData[column]){
                      exists = false
                    }
                
                  }
                }else{
                  if(fil === "tag" || fil === "type"){
                    if(!auxDisplayData[i][fil].props && this.state.filterData[column]){
                      exists = false
                    }else if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].props.children.includes(this.state.filterData[column])){
                      exists = false
                    }          
                  }else{
                    if(auxDisplayData[i][fil]){
                      if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].toString().includes(this.state.filterData[column])){
                        exists = false
                      }
                    }else if(this.state.filterData[column]){
                      exists = false
                    }
                
                  }
                }
              }
                
              if(exists){
                resultData.push(auxDisplayData[i])
              }
            }
            await this.setState({displayData: resultData})
                    
                  })
                  .catch(error => {
                      console.log(error);
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
      for(let column = 0; column < Object.keys(auxDisplayData[i]).length-2; column ++){
        fil = Object.keys(auxDisplayData[i])[column+1]
        if(this.props.currentRole === "3D Admin"){
          if(fil === "tag" || fil === "type" || fil === "ready_e3d"){
            if(!auxDisplayData[i][fil].props && this.state.filterData[column]){
              exists = false
            }else if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].props.children.includes(this.state.filterData[column])){
              exists = false
            }   
          }else{
            if(auxDisplayData[i][fil]){
              if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].toString().includes(this.state.filterData[column])){
                exists = false
              }
            }else if(this.state.filterData[column]){
              exists = false
            }
        
          }
        }else{
          if(fil === "tag" || fil === "type"){
            if(!auxDisplayData[i][fil].props && this.state.filterData[column]){
              exists = false
            }else if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].props.children.includes(this.state.filterData[column])){
              exists = false
            }          
          }else{
            if(auxDisplayData[i][fil]){
              if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].toString().includes(this.state.filterData[column])){
                exists = false
              }
            }else if(this.state.filterData[column]){
              exists = false
            }
        
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
            type="a"
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


      
    record[dataIndex].props ? record[dataIndex].props.children.toString().toLowerCase().includes(value.toLowerCase()) :
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
        title: <center className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="TAG" style={{textAlign:"center"}} onChange={(e) => this.filter(1, e.target.value)}/></center>,
        dataIndex: 'tag',
        key: 'tag',
        fixed: 'left',
        align: "center"
      },
      {
        title: <center className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="SPEC" style={{textAlign:"center"}} onChange={(e) => this.filter(2, e.target.value)}/></center>,
        dataIndex: 'spec',
        key: 'spec',
        align: "center"
      },
      {
        title: <div className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="P1Bore" style={{textAlign:"center"}} onChange={(e) => this.filter(3, e.target.value)}/></div>,
        dataIndex: 'p1bore',
        key: 'p1bore',
        align: "center"
      },
      {
        title: <div className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="P2Bore" style={{textAlign:"center"}} onChange={(e) => this.filter(4, e.target.value)}/></div>,
        dataIndex: 'p2bore',
        key: 'p2bore',
        align: "center"
      },
      {
        title: <div className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="Rating" style={{textAlign:"center"}} onChange={(e) => this.filter(5, e.target.value)}/></div>,
        dataIndex: 'rating',
        key: 'rating',
        align: "center"
      },
      {
        title: <div className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="End Preparation" style={{textAlign:"center"}} onChange={(e) => this.filter(6, e.target.value)}/></div>,
        dataIndex: 'end_preparation',
        key: 'end_preparation',
        align: "center"
      },
      {
        title: <div className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="Iso Description" style={{textAlign:"center"}} onChange={(e) => this.filter(7, e.target.value)}/></div>,
        dataIndex: 'description_iso',
        key: 'description_iso',
        align: "center"
      },
      {
        title: <div className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="Face to face" style={{textAlign:"center"}} onChange={(e) => this.filter(8, e.target.value)}/></div>,
        dataIndex: 'face_to_face',
        key: 'face_to_face',
        align: "center"
      },
      {
        title: <div className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="FLG Short Code" style={{textAlign:"center"}} onChange={(e) => this.filter(9, e.target.value)}/></div>,
        dataIndex: 'bolt_type',
        key: 'bolt_type',
        align: "center"
      },
      {
        title: <div className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="Ready in E3D date" style={{textAlign:"center"}} onChange={(e) => this.filter(13, e.target.value)}/></div>,
        dataIndex: 'ready_e3d_date',
        key: 'ready_e3d_date',
        align: "center"
      },
      {
        title: <div className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="Comments" style={{textAlign:"center"}} onChange={(e) => this.filter(14, e.target.value)}/></div>,
        dataIndex: 'comments',
        key: 'comments',
        align: "center"
      },
      {
        title: <div className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="Ready to load" style={{textAlign:"center"}} onChange={(e) => this.filter(10, e.target.value)}/></div>,
        dataIndex: 'ready_load',
        key: 'ready_load',
        fixed: "right",
        align: "center"
      },
      {
        title: <div className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="Ready in 3D" style={{textAlign:"center"}} onChange={(e) => this.filter(12, e.target.value)}/></div>,
        dataIndex: 'ready_e3d',
        key: 'ready_e3d',
        fixed: "right",
        align: "center"
      }
    ];
    

    var totalElements = null;
    if (this.state.data.length === 0){
      totalElements = null;
    }else{
      totalElements = (<div style={{position: "absolute", bottom: 120, left:110}}>
      <p className='navBar__button__text__general'>Total elements: {this.state.data.length}</p>
     </div>);
    }

    return (
      <div>
        {this.state.updateData}
        <div className="estimatedDataTable__container" style={{width:"auto"}}>
        <Table className="customTable" bordered = {true} columns={columns} dataSource={this.state.displayData} pagination={{disabled:true, defaultPageSize:5000}} size="small"
         rowClassName= {(record) => record.color.replace('#', '')} scroll={{x:4050, y: 437}}/>
          {totalElements}
        </div>
        
      </div>
    );
  }
}

export default CSPtrackerExpansionJoinsDataTable;