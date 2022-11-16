import React from 'react';
import 'antd/dist/antd.css';
import { Table } from 'antd';
import QtrackerNWCSpecPopUp from '../qtrackerNWCSpecPopUp/qtrackerNWCSpecPopUp';
import QtrackerNVNSpecPopUp from '../qtrackerNVNSpecPopUp/qtrackerNVNSpecPopUp';
import QtrackerNRISpecPopUp from '../qtrackerNRISpecPopUp/qtrackerNRISpecPopUp';
import QtrackerNRBSpecPopUp from '../qtrackerNRBSpecPopUp/qtrackerNRBSpecPopUp';
import QtrackerNRIDSSpecPopUp from '../qtrackerNRIDSSpecPopUp/qtrackerNRIDSSpecPopUp';
import QtrackerRPSpecPopUp from '../qtrackerRPSpecPopUp/qtrackerRPSpecPopUp';
import './projectsViewDataTable.css'
import AttachIcon from "../../assets/images/attach.png"
import ChangeAdminPopUp from '../changeAdminPopUp/changeAdminPopUp';
import { JoinFull } from '@mui/icons-material';

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

class ProjectsViewDataTable extends React.Component { //Tabla de tareas de los proyectos. Funciona igual que la de incidencias
  state = {
    searchText: '',
    searchedColumn: '',
    data: [],
    displayData: [],
    filterData: ["", "", "", "", "", "", "", ""],
    observations: {},
    tab: this.props.currentTab,
    selectedRows: [],
    selectedRowsKeys: [],
    updateData: this.props.updateData,
    username: "",
    acronyms: null,
    steps: [],
    filters: [],
    hours: {},
  };

  async componentDidMount() {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },

    }
    await fetch("http://" + process.env.REACT_APP_SERVER + ":" + process.env.REACT_APP_NODE_PORT + "/getProjectsTasks", options)
      .then(response => response.json())
      .then(async json => {
        let rows = []
        let row = {}
        for (let i = 0; i < json.tasks.length; i++) {
          row = { task: json.tasks[i].task, subtask: json.tasks[i].subtask, project: json.tasks[i].project + " (" + json.tasks[i].code + ")", date: json.tasks[i].date.toString().substring(0, 10) + " " + json.tasks[i].date.toString().substring(11, 19), observations: <input style={{ width: "275px" }} type="text" selected={json.tasks[i].observations} onChange={(event) => this.updateObservations(json.tasks[i].id, event.target.value)} />, ar_date: "", admin: <ChangeAdminPopUp updateData={this.state.updateData} admin={json.tasks[i].admin} incidence_number={json.tasks[i].id} changeAdmin={this.changeAdmin.bind(this)} />, hours: <input style={{ width: "55px" }} type="text" selected={json.tasks[i].hours} onChange={(event) => this.updateHours(json.tasks[i].id, event.target.value)} />, estimated: json.tasks[i].estimated }
          if (json.tasks[i].accept_reject_date) {
            row["ar_date"] = json.tasks[i].accept_reject_date.toString().substring(0, 10) + " " + json.tasks[i].accept_reject_date.toString().substring(11, 19)
          }

          if (json.tasks[i].status === 0 || !json.tasks[i].status) {
            row.status = <select name="status" id="status" onChange={(event) => this.statusChange(json.tasks[i].id, event.target.value)} >
              <option value="pending" selected>Pending</option>
              <option value="progress">In progress</option>
              <option value="ready">Ready</option>
              <option value="rejected">Cancelled</option>
            </select>
            row.color = "#www"
          } else if (json.tasks[i].status === 1) {
            row.status = <select name="status" id="status" onChange={(event) => this.statusChange(json.tasks[i].id, event.target.value)}>
              <option value="pending">Pending</option>
              <option value="progress" selected style={{ backgroundColor: "#yyy" }}>In progress</option>
              <option value="ready">Ready</option>
              <option value="rejected">Cancelled</option>
            </select>
            row.color = "#yyy"
          } else if (json.tasks[i].status === 2) {
            row.status = <select name="status" id="status" onChange={(event) => this.statusChange(json.tasks[i].id, event.target.value)}>
              <option value="pending">Pending</option>
              <option value="progress">In progress</option>
              <option value="ready" selected>Ready</option>
              <option value="rejected">Cancelled</option>
            </select>
            row.color = "#ggg"
          } else {
            row.status = <select name="status" id="status" onChange={(event) => this.statusChange(json.tasks[i].id, event.target.value)}>
              <option value="pending">Pending</option>
              <option value="progress">In progress</option>
              <option value="ready">Ready</option>
              <option value="rejected" selected>Cancelled</option>
            </select>
            row.color = "#rrr"
          }
          rows.push(row)
        }
        const filterRow = [{ task: <div><input type="text" className="filter__input" placeholder="Task" onChange={(e) => this.filter(0, e.target.value)} /></div>, subtask: <div><input type="text" className="filter__input" placeholder="Subtask" onChange={(e) => this.filter(1, e.target.value)} /></div>, project: <div><input type="text" className="filter__input" placeholder="Project" onChange={(e) => this.filter(2, e.target.value)} /></div>, date: <div><input type="text" className="filter__input" placeholder="Date" onChange={(e) => this.filter(3, e.target.value)} /></div>, ar_date: <div><input type="text" className="filter__input" placeholder="A/R Date" onChange={(e) => this.filter(5, e.target.value)} /></div>, admin: <div><input type="text" className="filter__input" placeholder="Admin" onChange={(e) => this.filter(6, e.target.value)} /></div>, status: <div><input type="text" className="filter__input" placeholder="Status" onChange={(e) => this.filter(9, e.target.value)} /></div>, estimated: <div><input type="text" className="filter__input" placeholder="Estimated" onChange={(e) => this.filter(8, e.target.value)} /></div> }]

        await this.setState({ data: rows, selectedRows: [], displayData: rows, filters: filterRow });
      })
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps !== this.props) {
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },

      }
      await fetch("http://" + process.env.REACT_APP_SERVER + ":" + process.env.REACT_APP_NODE_PORT + "/getProjectsTasks", options)
        .then(response => response.json())
        .then(async json => {
          let rows = []
          let row = {}
          for (let i = 0; i < json.tasks.length; i++) {
            row = { task: json.tasks[i].task, subtask: json.tasks[i].subtask, project: json.tasks[i].project + " (" + json.tasks[i].code + ")", date: json.tasks[i].date.toString().substring(0, 10) + " " + json.tasks[i].date.toString().substring(11, 19), observations: <input style={{ width: "275px" }} type="text" selected={json.tasks[i].observations} onChange={(event) => this.updateObservations(json.tasks[i].id, event.target.value)} />, ar_date: "", admin: <ChangeAdminPopUp updateData={this.state.updateData} admin={json.tasks[i].admin} incidence_number={json.tasks[i].id} changeAdmin={this.changeAdmin.bind(this)} />, hours: <input style={{ width: "55px" }} type="text" selected={json.tasks[i].hours} onChange={(event) => this.updateHours(json.tasks[i].id, event.target.value)} />, estimated: json.tasks[i].estimated }
            if (json.tasks[i].accept_reject_date) {
              row["ar_date"] = json.tasks[i].accept_reject_date.toString().substring(0, 10) + " " + json.tasks[i].accept_reject_date.toString().substring(11, 19)
            }

            if (json.tasks[i].status === 0 || !json.tasks[i].status) {
              row.status = <select name="status" id="status" onChange={(event) => this.statusChange(json.tasks[i].id, event.target.value)} >
                <option value="pending" selected>Pending</option>
                <option value="progress">In progress</option>
                <option value="ready">Ready</option>
                <option value="rejected">Cancelled</option>
              </select>
              row.color = "#www"
            } else if (json.tasks[i].status === 1) {
              row.status = <select name="status" id="status" onChange={(event) => this.statusChange(json.tasks[i].id, event.target.value)}>
                <option value="pending">Pending</option>
                <option value="progress" selected style={{ backgroundColor: "#yyy" }}>In progress</option>
                <option value="ready">Ready</option>
                <option value="rejected">Cancelled</option>
              </select>
              row.color = "#yyy"
            } else if (json.tasks[i].status === 2) {
              row.status = <select name="status" id="status" onChange={(event) => this.statusChange(json.tasks[i].id, event.target.value)}>
                <option value="pending">Pending</option>
                <option value="progress">In progress</option>
                <option value="ready" selected>Ready</option>
                <option value="rejected">Cancelled</option>
              </select>
              row.color = "#ggg"
            } else {
              row.status = <select name="status" id="status" onChange={(event) => this.statusChange(json.tasks[i].id, event.target.value)}>
                <option value="pending">Pending</option>
                <option value="progress">In progress</option>
                <option value="ready">Ready</option>
                <option value="rejected" selected>Cancelled</option>
              </select>
              row.color = "#rrr"
            }
            rows.push(row)
          }
          const filterRow = [{ task: <div><input type="text" className="filter__input" placeholder="Task" onChange={(e) => this.filter(0, e.target.value)} /></div>, subtask: <div><input type="text" className="filter__input" placeholder="Subtask" onChange={(e) => this.filter(1, e.target.value)} /></div>, project: <div><input type="text" className="filter__input" placeholder="Project" onChange={(e) => this.filter(2, e.target.value)} /></div>, date: <div><input type="text" className="filter__input" placeholder="Date" onChange={(e) => this.filter(3, e.target.value)} /></div>, ar_date: <div><input type="text" className="filter__input" placeholder="A/R Date" onChange={(e) => this.filter(5, e.target.value)} /></div>, admin: <div><input type="text" className="filter__input" placeholder="Admin" onChange={(e) => this.filter(6, e.target.value)} /></div>, status: <div><input type="text" className="filter__input" placeholder="Status" onChange={(e) => this.filter(9, e.target.value)} /></div>, estimated: <div><input type="text" className="filter__input" placeholder="Estimated" onChange={(e) => this.filter(8, e.target.value)} /></div> }]

          await this.setState({ data: rows, selectedRows: [], displayData: rows, filters: filterRow });
        })
    }
  }

  async statusChange(id, status) {
    let status_id
    if (status === "pending") {
      status_id = 0
    } else if (status === "progress") {
      status_id = 1
    } else if (status === "ready") {
      status_id = 2
    } else if (status === "rejected") {
      status_id = 3
    }

    await this.props.updateStatus([id, status_id])
  }


  async changeAdmin(admin, id) {
    this.props.changeAdmin(admin, id)
  }


  async filter(column, value) {
    let fd = this.state.filterData
    fd[column] = value
    await this.setState({ filterData: fd })

    let auxDisplayData = this.state.data
    let resultData = []
    let fil, exists = null
    for (let i = 0; i < auxDisplayData.length; i++) {
      exists = true
      for (let column = 0; column < Object.keys(auxDisplayData[i]).length - 1; column++) {

        fil = Object.keys(auxDisplayData[i])[column]
        if (fil === "specifications") {
          fil = "status"
        }
        if (fil === "status") {
          if (auxDisplayData[i][fil].props) {
            for (let p = 0; p < auxDisplayData[i][fil].props.children.length; p++) {
              if (auxDisplayData[i][fil].props.children[p].props.selected) {
                if (this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].props.children[p].props.children.includes(this.state.filterData[column])) {
                  exists = false
                }
              }
            }
          } else if (auxDisplayData[i][fil]) {
            if (this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].includes(this.state.filterData[column])) {
              exists = false
            }
          } else {
            if (this.state.filterData[column] !== "" && this.state.filterData[column]) {
              exists = false
            }
          }
        } else if (fil === "admin") {
          if (auxDisplayData[i][fil].props) {
            if (auxDisplayData[i][fil].props.admin) {
              if (this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].props.admin.includes(this.state.filterData[column])) {
                exists = false
              }
            }

          } else if (auxDisplayData[i][fil]) {
            if (this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].includes(this.state.filterData[column])) {
              exists = false
            }
          } else {
            if (this.state.filterData[column] !== "" && this.state.filterData[column]) {
              exists = false
            }
          }
        } else if (fil === "observations" || fil === "hours") {

        } else {
          if (auxDisplayData[i][fil]) {
            if (this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].toString().includes(this.state.filterData[column])) {
              exists = false
            }
          } else if (!auxDisplayData[i][fil] && this.state.filterData[column]) {
            exists = false
          }

        }

      }
      if (exists) {
        resultData.push(auxDisplayData[i])
      }
    }
    await this.setState({ displayData: resultData })
  }

  async updateObservations(id, observations) {
    let observationsAux = this.state.observations
    observationsAux[id] = observations
    await this.setState({ observations: observationsAux })
    this.props.updateObservations(this.state.observations)
  }

  async updateHours(id, hours) {
    let hoursAux = this.state.hours
    hoursAux[id] = hours
    await this.setState({ hours: hoursAux })
    await this.props.updateHours(hoursAux)
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
    for (let i = 0; i < selectedRows.length; i++) {
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
        title: <center className="dataTable__header__text">Task</center>,
        dataIndex: 'task',
        key: 'task',
        ...this.getColumnSearchProps('task'),
        sorter: {
          compare: (a, b) => a.task.localeCompare(b.task),
        },
      },
      {
        title: <center className="dataTable__header__text">Subtask</center>,
        dataIndex: 'subtask',
        key: 'subtask',
        ...this.getColumnSearchProps('subtask'),
        sorter: {
          compare: (a, b) => a.subtask.localeCompare(b.subtask),
        },
      },
      {
        title: <center className="dataTable__header__text">Project</center>,
        dataIndex: 'project',
        key: 'project',
        ...this.getColumnSearchProps('project'),
        sorter: {
          compare: (a, b) => a.project.localeCompare(b.project),
        },
      },
      {
        title: <div className="dataTable__header__text">Date</div>,
        dataIndex: 'date',
        key: 'date',
        ...this.getColumnSearchProps('date'),
        sorter: {
          compare: (a, b) => { return a.date.localeCompare(b.date) },
        },

      },
      {
        title: <center className="dataTable__header__text">Observations</center>,
        dataIndex: 'observations',
        key: 'observations',
        ...this.getColumnSearchProps('observations'),
        width: "290px"
      },
      {
        title: <center className="dataTable__header__text">Accepted/Rejected Date</center>,
        dataIndex: 'ar_date',
        key: 'ar_date',
        ...this.getColumnSearchProps('ar_date'),
        width: "220px",
        sorter: {
          compare: (a, b) => { return a.ar_date.localeCompare(b.ar_date) },
        },
      },
      {
        title: <center className="dataTable__header__text">Admin</center>,
        dataIndex: 'admin',
        key: 'admin',
        align: "center",
        ...this.getColumnSearchProps('admin'),
        width: "270px"
      },
      {
        title: <center className="dataTable__header__text">Status</center>,
        dataIndex: 'status',
        key: 'status',
        ...this.getColumnSearchProps('status'),
        width: '160px'
      },
      {
        title: <center className="dataTable__header__text">Estimated hours</center>,
        dataIndex: 'estimated',
        key: 'estimated',
        ...this.getColumnSearchProps('estimated'),
        width: '150px'
      },
      {
        title: <center className="dataTable__header__text">Hours</center>,
        dataIndex: 'hours',
        key: 'hours',
        ...this.getColumnSearchProps('hours'),
        width: '70px'
      },
    ]

    var totalElements = null;
    if (this.state.data.length === 0) {
      totalElements = null;
    } else {
      totalElements = (<div style={{ position: "absolute", margin:"-30px 2050px -20px -20px" }}>
        <b>Total elements: {this.state.data.length}</b>
      </div>);
    }
    return (
      <div>
        {this.state.updateData}
        <div className="estimatedDataTable__container" style={{ width: "auto" }}>
          <Table className="customTable" bordered={true} columns={columns} dataSource={this.state.displayData} style={{ height: '540px' }} scroll={{ y: 437 }} pagination={{ disabled: true, defaultPageSize: 5000 }} size="small"
            rowClassName={(record) => record.color.replace('#', '')} />
          <Table className="filter__table" pagination={{ disabled: true }} scroll={{ y: 437 }} showHeader={false} bordered={true} columns={columns} dataSource={this.state.filters} size="small" />
          {totalElements}
        </div>

      </div>
    );
  }
}

export default ProjectsViewDataTable;