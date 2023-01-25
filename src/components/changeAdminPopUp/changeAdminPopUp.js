import React, { Component } from "react";
import Modal from "react-awesome-modal";
import "./changeAdminPopUp.css";

const CryptoJS = require("crypto-js");
const SecureStorage = require("secure-web-storage");
var SECRET_KEY = "sanud2ha8shd72h";

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
  },
});

export default class ChangeAdminPopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      admins: [],
      currentAdmin: null,
      updateData: this.props.updateData,
    };
    this.id = props.id;
  }

  async openModal() {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    await this.setState({
      admins: [],
    });
    //Cogemos todos los admins para poder selccionar a quien le asignamos la incidencia
    await fetch(
      "http://" +
        process.env.REACT_APP_SERVER +
        ":" +
        process.env.REACT_APP_NODE_PORT +
        "/getAdmins",
      options
    )
      .then((response) => response.json())
      .then(async (json) => {
        await this.setState({
          admins: json.admins,
          currentAdmin: json.admins[0],
        });
      });
    this.setState({
      visible: true,
    });
  }

  closeModal() {
    this.setState({
      visible: false,
      admins: [],
    });
  }

  changeAdmin() {
    //Cambio de admin
    this.props.changeAdmin(
      this.state.currentAdmin,
      this.props.incidence_number,
      this.props.type
    );
    console.log("change admin: ", this.state.currentAdmin, this.props.incidence_number, this.props.type);
    this.closeModal();
  }

  handleChange = async (e) => {
    await this.setState({ currentAdmin: e.target.value });
  };

  render() {
    return (
      <section>
        {this.state.updateData}
        <button
          value="admin"
          className="btn"
          style={{
            padding: "2px 5px 2px 5px",
            fontSize: "16px",
            backgroundColor: "#78B28A",
            color: "white",
          }}
          onClick={() => this.openModal()}
        >
          {this.props.admin}
        </button>{" "}
        <div>
          <Modal
            visible={this.state.visible}
            width="650"
            height="180"
            effect="fadeInUp"
            onClickAway={() => this.closeModal()}
          >
            <div className="popUp__container">
              <center
                style={{ marginRight: "-250px" }}
                className="title__popUp"
              >
                Select a new admin
              </center>
            </div>
            <div className="selector__container">
              <select
                selected={this.state.currentAdmin}
                onChange={this.handleChange}
                id="userSelect"
                className="userSelect"
              >
                {this.state.admins.map((admin) => (
                  <option>{admin}</option>
                ))}
              </select>

              <button
                className="btn__assign"
                onClick={() => this.changeAdmin()}
              >
                Assign
              </button>
            </div>
          </Modal>
        </div>
      </section>
    );
  }
}
