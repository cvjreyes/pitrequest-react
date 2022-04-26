import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import './csptrackerRequestPopUp.css';
import Request from "../../assets/images/hand_requests.svg";

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

export default class CSPTrackerRequestPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible : false,
            tag: null,
            pid: null,
            sptag: null,
            pidlist: null,
            pidsArray: null
        }
    }

    async componentDidMount(){
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }
        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/csptracker/pids", options)
        .then(response => response.json())
        .then(async json => {
            let pids = []
            let pidsArray = []
            for(let i = 0; i < json.rows.length; i++){
                pids.push(<option value={json.rows[i].pid}/>)
                pidsArray.push(json.rows[i].pid)
            }
            await this.setState({pidlist: pids})
            await this.setState({pidsArray: pidsArray})
        }) 
    
    }

    async openModal() {
        await this.setState({
            visible : true,
            tag: null,
            pid: null,
            sptag: null
        });
    }

    async closeModal() {
        await this.setState({
            visible : false,
            tag: null,
            pid: null,
            sptag: null
        });

        this.refs.tag.value = null;
        this.refs.pids.value = null;
        this.refs.sptag.value = null;

    }

    async request(){
        
        if(this.state.tag && this.state.pid && this.state.sptag && this.state.pidsArray.indexOf(this.state.pid) > -1){
            const body ={
                tag : this.state.tag,
                pid: this.state.pid,
                sptag: this.state.sptag,
                user: secureStorage.getItem("user")
              }
              const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            }
              await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/requestSP", options)
                  .then(response => response.json())
                  .then(json => {
                      if(json.success){
                          this.props.successRequest()
                      }else{
                          this.props.existsErrorRequest()
                      }
                  })
                  this.closeModal()
        }else if(this.state.pidsArray.indexOf(this.state.pid) < 0){
            this.props.errorPidRequest()
        }else{
            this.props.errorBlankRequest()
        }
        
    }

    

    render() {       

        return (
            <div style={{marginRight:"5px", marginLeft:"5px", float:"right"}}>
                <button className="navBar__button" onClick={() => this.openModal()} style={{width:"150px"}}><img src={Request} alt="request" className="navBar__icon" style={{marginRight:"4px"}}></img><p className="navBar__button__text">Request SP</p></button>
                <div>
                    <Modal visible={this.state.visible} width="450" height="320" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                        <center className="popUp__title" style={{marginBottom: "30px"}}><h3>Request SP</h3></center>
                        <div className="request__container">
                            <input type="text" placeholder="LINE ID" id="tag" className="popUp__input__text" ref="tag" style={{marginBottom: "20px", color:'black'}} value={this.state.tag} onChange={(e) => this.setState({tag: e.target.value})} ></input>

                            <input list="pids" name="pids" className="popUp__input__text" placeholder="P&ID" ref="pids" style={{marginBottom:"20px", color:"black"}} onChange={(e) => this.setState({pid: e.target.value})}/>
                            <datalist id="pids">
                            {this.state.pidlist}
                            </datalist>

                            <input type="text" placeholder="DESCRIPTION" id="sptag"className="popUp__input__text" ref="sptag" style={{marginBottom: "30px", color:"black"}} value={this.state.sptag} onChange={(e) => this.setState({sptag: e.target.value})} ></input>
                            <button class="btn btn-sm btn-success" onClick={() => this.request()} style={{marginRight:"5px", fontSize:"16px"}}>Submit</button>
                            <button class="btn btn-sm btn-danger" onClick={() => this.closeModal()} style={{marginLeft:"5px", fontSize:"16px"}}>Cancel</button>
                        </div>
                    </Modal>
                </div>
            </div>
        );
    }
}