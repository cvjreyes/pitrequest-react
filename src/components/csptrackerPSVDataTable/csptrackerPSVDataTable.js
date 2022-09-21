import React from 'react';
import './csptrackerPSVDataTable.css'
import 'antd/dist/antd.css';
import { Table, Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import UploadDrawingPopUp from '../uploadDrawingPopUp/uploadDrawingPopUp';
import UpdateDrawingPopUp from '../updateDrawingPopUp/updateDrawingPopUp';

class CSPtrackerPSVDataTable extends React.Component{
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


  fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/psvReadye3d", options)
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


  fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/psvCancelreadye3d", options)
      .then(response => response.json())
      .then(
        this.props.updateDataMethod()
        )
  }

  async deletePSV(id){
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

    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/deletePSV", options)
      .then(response => response.json())
      .then(
        this.props.updateDataMethod()
      )
  }
  
  async excludePSV(id){
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

    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/excludePSV", options)
      .then(response => response.json())
      .then(
        this.props.updateDataMethod()
      )
  }

  async updateData(){
    this.props.updateDataMethod()
  }

  async uploadDrawingSuccess(){
    this.props.uploadDrawingSuccess()
  }

  async updateDrawingSuccess(){
    this.props.updateDrawingSuccess()
  }

  async drawingUploadError(){
    this.props.drawingUploadError()
  }

  async getDrawing(fileName){
    const options = {
      method: "GET",
      headers: {
          "Content-Type": "application/pdf"
      }
    }
    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getDrawing/"+fileName, options)
    .then(res => res.blob())
    .then(response => {
      const file = new Blob([response], {
        type: "application/pdf"
      });
      //Build a URL from the file
      const fileURL = URL.createObjectURL(file);
      //Open the URL on new Window
      let w = window.open(fileURL);

        w.addEventListener("load", function() {
          setTimeout(()=> w.document.title = fileName
          , 300);


        });

        // create <a> tag dinamically
        var filea = document.createElement('a');
        filea.href = fileURL;

        // it forces the name of the downloaded file
        filea.download = fileName;

        // triggers the click event
        filea.click();


      
    })
    .catch(error => {
      console.log(error);
    });
  }

  async componentDidMount(){

    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }


    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getPSVByProject/" + this.props.currentProject, options)
        .then(response => response.json())
        .then(async json => {
          var rows = []
          var row = null
          for(let i = 0; i < json.rows.length; i++){
            row = {key:i, id: json.rows[i].id, tag: json.rows[i].tag, spec_inlet: json.rows[i].spec_inlet, p1bore_inlet: json.rows[i].p1bore_inlet, rating_inlet: json.rows[i].rating_inlet, flg_inlet: json.rows[i].flg_inlet, bolt_longitude_inlet: json.rows[i].bolt_longitude_inlet, spec_outlet: json.rows[i].spec_outlet, p2bore_outlet: json.rows[i].p2bore_outlet, rating_outlet: json.rows[i].rating_outlet, flg_outlet: json.rows[i].flg_outlet, bolt_longitude_outlet: json.rows[i].bolt_longitude_outlet, h1: json.rows[i].h1, a: json.rows[i].a, b: json.rows[i].b, ready_load: json.rows[i].ready_load, ready_load_date: json.rows[i].ready_load_date, ready_e3d: json.rows[i].ready_e3d, ready_e3d_date: json.rows[i].ready_e3d_date, comments: json.rows[i].comments, updated: json.rows[i].updated, updated_at: json.rows[i].updated_at, actions: null/*, request_date: json.rows[i].request_date.toString().substring(0,10) + " "+ json.rows[i].request_date.toString().substring(11,19), project: json.rows[i].project*/}

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

              if(row.ready_load === 1 && json.rows[i].updated === 1 && json.rows[i].ready_e3d === 0){
                row.ready_load = "UPDATED"
                row.color = "#yyy"
                  if(this.props.currentRole === "3D Admin"){
                    row.ready_e3d = "NOT READY"
                    row.actions = <button class="insts__ready__btn btn-sm btn-success" style={{width:"70px"}} onClick={() => this.readyE3D(json.rows[i].id)}>READY</button>
                  }else{
                    row.ready_e3d = "NOT READY"
                  }
                }else if(row.ready_load === 1){
                  row.ready_load = "READY"
                if(row.ready_e3d === 1){
                  if(json.rows[i].updated === 0){
                    row.color = "#ggg"
                    if(this.props.currentRole === "3D Admin"){
                      row.ready_e3d = "READY"
                      row.actions = <button class="insts__cancel__btn btn-sm btn-danger" style={{width:"70px"}} onClick={() => this.cancelReadyE3D(json.rows[i].id)}>CANCEL</button>
                    }else{
                      row.ready_e3d = "READY"
                      row.ready_load = "READY"
                      row.actions = <button class="insts__delete_btn btn-sm btn-danger" style={{width:"70px"}} onClick={() => this.deletePSV(json.rows[i].id)}>DELETE</button>
                    }
                  }else{
                    row.color = "#bbb"
                    if(this.props.currentRole === "3D Admin"){
                      row.actions = <button class="insts__cancel__btn btn-sm btn-danger" style={{width:"70px"}} onClick={() => this.cancelReadyE3D(json.rows[i].id)}>CANCEL</button>
                      row.ready_e3d = "READY"
                    }else{
                      row.ready_e3d = "READY"
                      row.ready_load = "READY"
                      row.actions = <div><button class="insts__delete_btn btn-sm btn-danger" style={{width:"70px"}} onClick={() => this.deletePSV(json.rows[i].id)}>DELETE</button></div>
                    }
                  }
                  
                }else{
                  row.color = "#yyy"
                  if(this.props.currentRole === "3D Admin"){
                    row.actions = <button class="insts__ready__btn btn-sm btn-success" style={{width:"70px"}} onClick={() => this.readyE3D(json.rows[i].id)}>READY</button>
                    row.ready_e3d = "NOT READY"
                  }else{
                    row.ready_e3d = "NOT READY"
                    row.ready_load = "READY"
                    row.actions = <div><button class="insts__delete_btn btn-sm btn-danger" style={{width:"70px"}} onClick={() => this.deletePSV(json.rows[i].id)}>DELETE</button><button class="insts__exclude_btn btn-sm btn-danger" style={{width:"70px"}} onClick={() => this.excludePSV(json.rows[i].id)}>EXCLUDE</button></div>
                  }
                }
                
              }else if(row.ready_load === 0 && row.ready_e3d === 1 && row.updated === 1){
                row.ready_load = "NOT READY"
                row.color = "#ooo"
                row.ready_e3d = "NOT READY"
                row.ready_load = "READY"
                row.actions = <div><button class="insts__delete_btn btn-sm btn-danger" style={{width:"70px"}} onClick={() => this.deletePSV(json.rows[i].id)}>DELETE</button></div>
              }else{
                row.ready_load = "NOT READY"
                row.color = "white"
                if(this.props.currentRole === "3D Admin"){
                  row.ready_e3d = "NOT READY"
                  row.actions = <button disabled style={{width:"70px"}} class="insts__ready__disabled btn-sm btn-success">READY</button>
                }else{
                  row.ready_e3d = "NOT READY"
                  row.ready_load = "NOT READY"
                  row.actions = <div><button class="insts__delete_btn btn-sm btn-danger" style={{width:"70px"}} onClick={() => this.deletePSV(json.rows[i].id)}>DELETE</button></div>
                }
              }
            }
            

            for (const [key, value] of Object.entries(row)) {
              if(!value){
                row[key] = ""
              }
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


    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getPSVByProject/" + this.props.currentProject, options)
        .then(response => response.json())
        .then(async json => {
          var rows = []
          var row = null
          for(let i = 0; i < json.rows.length; i++){
            row = {key:i, id: json.rows[i].id, tag: json.rows[i].tag, spec_inlet: json.rows[i].spec_inlet, p1bore_inlet: json.rows[i].p1bore_inlet, rating_inlet: json.rows[i].rating_inlet, flg_inlet: json.rows[i].flg_inlet, bolt_longitude_inlet: json.rows[i].bolt_longitude_inlet, spec_outlet: json.rows[i].spec_outlet, p2bore_outlet: json.rows[i].p2bore_outlet, rating_outlet: json.rows[i].rating_outlet, flg_outlet: json.rows[i].flg_outlet, bolt_longitude_outlet: json.rows[i].bolt_longitude_outlet, h1: json.rows[i].h1, a: json.rows[i].a, b: json.rows[i].b, ready_load: json.rows[i].ready_load, ready_load_date: json.rows[i].ready_load_date, ready_e3d: json.rows[i].ready_e3d, ready_e3d_date: json.rows[i].ready_e3d_date, comments: json.rows[i].comments, updated: json.rows[i].updated, updated_at: json.rows[i].updated_at, actions: null/*, request_date: json.rows[i].request_date.toString().substring(0,10) + " "+ json.rows[i].request_date.toString().substring(11,19), project: json.rows[i].project*/}

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

              if(row.ready_load === 1 && json.rows[i].updated === 1 && json.rows[i].ready_e3d === 0){
                row.ready_load = "UPDATED"
                row.color = "#yyy"
                  if(this.props.currentRole === "3D Admin"){
                    row.ready_e3d = "NOT READY"
                    row.actions = <button class="insts__ready__btn btn-sm btn-success" style={{width:"70px"}} onClick={() => this.readyE3D(json.rows[i].id)}>READY</button>
                  }else{
                    row.ready_e3d = "NOT READY"
                  }
                }else if(row.ready_load === 1){
                  row.ready_load = "READY"
                if(row.ready_e3d === 1){
                  if(json.rows[i].updated === 0){
                    row.color = "#ggg"
                    if(this.props.currentRole === "3D Admin"){
                      row.ready_e3d = "READY"
                      row.actions = <button class="insts__cancel__btn btn-sm btn-danger" style={{width:"70px"}} onClick={() => this.cancelReadyE3D(json.rows[i].id)}>CANCEL</button>
                    }else{
                      row.ready_e3d = "READY"
                      row.ready_load = "READY"
                      row.actions = <button class="insts__delete_btn btn-sm btn-danger" style={{width:"70px"}} onClick={() => this.deletePSV(json.rows[i].id)}>DELETE</button>
                    }
                  }else{
                    row.color = "#bbb"
                    if(this.props.currentRole === "3D Admin"){
                      row.actions = <button class="insts__cancel__btn btn-sm btn-danger" style={{width:"70px"}} onClick={() => this.cancelReadyE3D(json.rows[i].id)}>CANCEL</button>
                      row.ready_e3d = "READY"
                    }else{
                      row.ready_e3d = "READY"
                      row.ready_load = "READY"
                      row.actions = <div><button class="insts__delete_btn btn-sm btn-danger" style={{width:"70px"}} onClick={() => this.deletePSV(json.rows[i].id)}>DELETE</button></div>
                    }
                  }
                  
                }else{
                  row.color = "#yyy"
                  if(this.props.currentRole === "3D Admin"){
                    row.actions = <button class="insts__ready__btn btn-sm btn-success" style={{width:"70px"}} onClick={() => this.readyE3D(json.rows[i].id)}>READY</button>
                    row.ready_e3d = "NOT READY"
                  }else{
                    row.ready_e3d = "NOT READY"
                    row.ready_load = "READY"
                    row.actions = <div><button class="insts__delete_btn btn-sm btn-danger" style={{width:"70px"}} onClick={() => this.deletePSV(json.rows[i].id)}>DELETE</button><button class="insts__exclude_btn btn-sm btn-danger" style={{width:"70px"}} onClick={() => this.excludePSV(json.rows[i].id)}>EXCLUDE</button></div>
                  }
                }
                
              }else if(row.ready_load === 0 && row.ready_e3d === 1 && row.updated === 1){
                row.ready_load = "NOT READY"
                row.color = "#ooo"
                row.ready_e3d = "NOT READY"
                row.ready_load = "READY"
                row.actions = <div><button class="insts__delete_btn btn-sm btn-danger" style={{width:"70px"}} onClick={() => this.deletePSV(json.rows[i].id)}>DELETE</button></div>
              }else{
                row.ready_load = "NOT READY"
                row.color = "white"
                if(this.props.currentRole === "3D Admin"){
                  row.ready_e3d = "NOT READY"
                  row.actions = <button disabled style={{width:"70px"}} class="insts__ready__disabled btn-sm btn-success">READY</button>
                }else{
                  row.ready_e3d = "NOT READY"
                  row.ready_load = "NOT READY"
                  row.actions = <div><button class="insts__delete_btn btn-sm btn-danger" style={{width:"70px"}} onClick={() => this.deletePSV(json.rows[i].id)}>DELETE</button></div>
                }
              }
            }
            

            for (const [key, value] of Object.entries(row)) {
              if(!value){
                row[key] = ""
              }
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
        title: <center className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="TAG" style={{textAlign:"center"}} onChange={(e) => this.filter(0, e.target.value)}/></center>,
        dataIndex: 'tag',
        key: 'tag',
        fixed: 'left',
        align: "center"
      },
      {
        title: <center className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="SPEC INLET" style={{textAlign:"center"}} onChange={(e) => this.filter(25, e.target.value)}/></center>,
        dataIndex: 'spec_inlet',
        key: 'spec_inlet',
        align: "center"
      },
      {
        title: <center className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="P1BORE INLET" style={{textAlign:"center"}} onChange={(e) => this.filter(25, e.target.value)}/></center>,
        dataIndex: 'p1bore_inlet',
        key: 'p1bore_inlet',
        align: "center"
      },
      {
        title: <center className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="RATING INLET" style={{textAlign:"center"}} onChange={(e) => this.filter(25, e.target.value)}/></center>,
        dataIndex: 'rating_inlet',
        key: 'rating_inlet',
        align: "center"
      },
      {
        title: <div className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="FLG Short Code INLET" style={{textAlign:"center"}} onChange={(e) => this.filter(2, e.target.value)}/></div>,
        dataIndex: 'flg_inlet',
        key: 'flg_inlet',
        align: "center"
      },
      {
        title: <div className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="BOLT LOGITUDE INTLET" style={{textAlign:"center"}} onChange={(e) => this.filter(12, e.target.value)}/></div>,
        dataIndex: 'bolt_longitude_inlet',
        key: 'bolt_longitude_inlet',
        align: "center"
      },
      {
        title: <div className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="SPEC OUTLET" style={{textAlign:"center"}} onChange={(e) => this.filter(7, e.target.value)}/></div>,
        dataIndex: 'spec_outlet',
        key: 'spec_outlet',
        align: "center"
      },
      {
        title: <div className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="P2BORE OUTLET" style={{textAlign:"center"}} onChange={(e) => this.filter(7, e.target.value)}/></div>,
        dataIndex: 'p2bore_outlet',
        key: 'p2bore_outlet',
        align: "center"
      },
      {
        title: <div className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="RATING OUTLET" style={{textAlign:"center"}} onChange={(e) => this.filter(7, e.target.value)}/></div>,
        dataIndex: 'rating_outlet',
        key: 'rating_outlet',
        align: "center"
      },
      {
        title: <div className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="FLG Short Code OUTLET" style={{textAlign:"center"}} onChange={(e) => this.filter(8, e.target.value)}/></div>,
        dataIndex: 'flg_outlet',
        key: 'flg_outlet',
        align: "center"
      },
      {
        title: <div className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="BOLT LOGITUDE OUTLET" style={{textAlign:"center"}} onChange={(e) => this.filter(12, e.target.value)}/></div>,
        dataIndex: 'bolt_longitude_outlet',
        key: 'bolt_longitude_outlet',
        align: "center"
      },
      {
        title: <div className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="H1" style={{textAlign:"center"}} onChange={(e) => this.filter(12, e.target.value)}/></div>,
        dataIndex: 'h1',
        key: 'h1',
        align: "center"
      },
      {
        title: <div className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="A" style={{textAlign:"center"}} onChange={(e) => this.filter(12, e.target.value)}/></div>,
        dataIndex: 'a',
        key: 'a',
        align: "center"
      },
      {
        title: <div className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="B" style={{textAlign:"center"}} onChange={(e) => this.filter(12, e.target.value)}/></div>,
        dataIndex: 'b',
        key: 'b',
        align: "center"
      },
      {
        title: <div className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="Ready to load date" style={{textAlign:"center"}} onChange={(e) => this.filter(10, e.target.value)}/></div>,
        dataIndex: 'ready_load_date',
        key: 'ready_load_date',
        align: "center"
      },
      {
        title: <div className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="Ready in E3D date" style={{textAlign:"center"}} onChange={(e) => this.filter(11, e.target.value)}/></div>,
        dataIndex: 'ready_e3d_date',
        key: 'ready_e3d_date',
        align: "center"
      },
      {
        title: <div className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="Comments" style={{textAlign:"center"}} onChange={(e) => this.filter(11, e.target.value)}/></div>,
        dataIndex: 'comments',
        key: 'comments',
        align: "center"
      },
      {
        title: <div className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="Ready to load" style={{textAlign:"center"}} onChange={(e) => this.filter(16, e.target.value)}/></div>,
        dataIndex: 'ready_load',
        key: 'ready_load',
        fixed: "right",
        align: "center"
      },
      {
        title: <div className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="Ready in 3D" style={{textAlign:"center"}} onChange={(e) => this.filter(17, e.target.value)}/></div>,
        dataIndex: 'ready_e3d',
        key: 'ready_e3d',
        fixed: "right",
        align: "center"
      },
      {
        title: <div className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="Actions" style={{textAlign:"center"}} onChange={(e) => this.filter(17, e.target.value)}/></div>,
        dataIndex: 'actions',
        key: 'actions',
        fixed: "right",
        align: "center"
      }
    ];
    

    var totalElements = null;
    if (this.state.data.length === 0){
      totalElements = null;
    }else{
      totalElements = (<div style={{position: "absolute", bottom: 110, left:110}}>
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

export default CSPtrackerPSVDataTable;