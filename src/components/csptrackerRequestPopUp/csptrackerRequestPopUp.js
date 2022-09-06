import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import './csptrackerRequestPopUp.css';
import Request from "../../assets/images/hand_requests.svg";
import { BuildOutlined } from '@mui/icons-material';

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
            project: null,
            pidlist: null,
            pidsArray: null,
            projectList: null,
            projectsArray: null
        }
    }

    async componentDidMount(){
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getProjectsByEmail/" + secureStorage.getItem("user"), options)
        .then(response => response.json())
        .then(async json => {
            console.log(json)
            let projectList = []
            let projectsArray = []
            for(let i = 0; i < json.projects.length; i++){
                projectList.push(<option value={json.projects[i].name}/>)
                projectsArray.push(json.projects[i].name)
            }
            await this.setState({projectList: projectList})
            await this.setState({projectsArray: projectsArray})
        }) 
    
    }

    async openModal() {
        await this.setState({
            visible : true,
            tag: null,
            pid: null,
            sptag: null,
            project: null
        });
    }

    async closeModal() {
        await this.setState({
            visible : false,
            tag: null,
            pid: null,
            sptag: null,
            project: null
        });

        this.refs.tag.value = null;
        this.refs.pids.value = null;
        this.refs.sptag.value = null;
        this.refs.projects.value = null;
    }

    async getPids(project){
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }
        await this.setState({project: project})
        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/csptracker/pids/" + project, options)
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

    async request(){
        
        if(this.state.tag && this.state.pid && this.state.sptag && this.state.pidsArray.indexOf(this.state.pid) > -1 && this.state.projectsArray.indexOf(this.state.project) > -1){
            const body ={
                tag : this.state.tag,
                pid: this.state.pid,
                project: this.state.project,
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
                <button className="navBar__button" onClick={() => this.openModal()} style={{width:"150px", marginTop:"5px"}}><img src={Request} alt="request" className="navBar__icon" style={{marginRight:"4px"}}></img><p className="navBar__button__text">Request SP</p></button>
                <div>
                    <Modal visible={this.state.visible} width="500" height="400" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                        
                        <div className="popUp__container" style={{marginLeft:"100px"}}>
                            <center className="title__popUp">Request SP</center>
                        </div>

                        <div className="request__container">
                            
                            <table className='tabla__sptracker'>
                                <tr>
                                    <td>
                                        <label className="priority__label" style={{color: 'black', textAlign: 'left'}}>Line ID: </label>
                                    </td>
                                    <td >
                                        <input type="text" id="tag" className="popUp__input__text" ref="tag" style={{color:'black'}} value={this.state.tag} onChange={(e) => this.setState({tag: e.target.value})} ></input>
                                    </td>
                                </tr>
                                
                                <tr style={{marginTop:"20px"}}>
                                    <td>
                                        <label className="priority__label" style={{color: 'black', textAlign: 'left'}}>Projects: </label>
                                    </td>
                                    <td>
                                        <input list="projects" name="projects" className="popUp__input__text" ref="projects" style={{color:"black"}} onChange={(e) => this.getPids(e.target.value)}/>
                                        <datalist id="projects">
                                        {this.state.projectList}
                                        </datalist>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <label className="priority__label" style={{color: 'black', textAlign: 'left'}}>P&ID: </label>
                                    </td>
                                    <td>
                                        <input list="pids" name="pids" className="popUp__input__text" ref="pids" style={{color:"black"}} onChange={(e) => this.setState({pid: e.target.value})}/>
                                        <datalist id="pids">
                                        {this.state.pidlist}
                                        </datalist>            
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <label className="priority__label" style={{color: 'black', textAlign: 'left'}}>Description: </label>
                                    </td>
                                    <td>                                        
                                        <input type="text" id="sptag" className="popUp__input__text" ref="sptag" style={{color:"black"}} value={this.state.sptag} onChange={(e) => this.setState({sptag: e.target.value})} ></input>
                                    </td>
                                </tr>
                            </table>                            
                        </div>
                        <div className="popUp__buttons__container__manage" style={{marginTop:"30px"}}>    
                            <button class="btn__submit" onClick={() => this.request()} style={{marginRight:"5px", fontSize:"16px"}}>Submit</button>
                            <button class="btn__cancel" onClick={() => this.closeModal()} style={{marginLeft:"5px", fontSize:"16px"}}>Cancel</button>
                        </div>
                    </Modal>
                </div>
            </div>
        );
    }
}