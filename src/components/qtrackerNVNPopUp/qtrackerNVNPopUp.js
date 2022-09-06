import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AlertF from "../../components/alert/alert"
import ReactTooltip from "react-tooltip"

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

    const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
        color: theme.palette.text.secondary,
        [`& .${treeItemClasses.content}`]: {
          color: theme.palette.text.secondary,
          borderTopRightRadius: theme.spacing(2),
          borderBottomRightRadius: theme.spacing(2),
          paddingRight: theme.spacing(1),
          fontWeight: theme.typography.fontWeightMedium,
          '&.Mui-expanded': {
            fontWeight: theme.typography.fontWeightRegular,
          },
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
          '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
            color: 'var(--tree-view-color)',
          },
          [`& .${treeItemClasses.label}`]: {
            fontWeight: 'inherit',
            color: 'inherit',
          },
        },
        [`& .${treeItemClasses.group}`]: {
          marginLeft: 0,
          [`& .${treeItemClasses.content}`]: {
            paddingLeft: theme.spacing(2),
          },
        },
      }));
      
      function StyledTreeItem(props) {
        const {
          bgColor,
          color,
          labelIcon: LabelIcon,
          labelInfo,
          labelText,
          ...other
        } = props;
      
        return (
          <StyledTreeItemRoot
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0}}>
                <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 'inherit', flexGrow: 1, fontFamily: "Quicksand, sans-serif", fontSize:"30px" }}>
                  {labelText}
                </Typography>
                <Typography variant="caption">
                  {labelInfo}
                </Typography>
              </Box>
            }
            style={{
              '--tree-view-color': color,
              '--tree-view-bg-color': bgColor,
            }}
            {...other}
          />
        );
      }
      
      StyledTreeItem.propTypes = {
        bgColor: PropTypes.string,
        color: PropTypes.string,
        labelIcon: PropTypes.elementType.isRequired,
        labelInfo: PropTypes.string,
        labelText: PropTypes.string.isRequired,
      };

export default class QtrackerNVNPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible : false,
            name: null,
            attach: null,
            description: null,
            errorBlankRequest: false,
            projects: [],
            carta: null,
            projectName: ""
        }
    }

    async componentDidMount(){
      const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
      }

      await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getProjectsByEmail/"+ secureStorage.getItem("user"), options)
        .then(response => response.json())
        .then(async json => {
          let projects = []
          for(let i = 0; i < json.projects.length; i++){
            projects.push(json.projects[i].name)
          }
          this.setState({projects:projects, projectName: projects[0]})
        })
    }

    async openModal() {
        await this.setState({
            visible : true,
            name: null,
            description: null,
            attach: null,
        });
    }

    async closeModal() {
        await this.setState({
            visible : false,
            name: null,
            description: null,
            attach: null
        });

        this.refs.name.value = null;
        this.refs.description.value = null;
        this.refs.attach.value = null;

    }


    async request(){
        
      if(this.state.name && this.state.description){
        let has_attach

        if(this.state.attach){
          has_attach = true
        }else{
          has_attach = false
        }

        let body ={
            name : this.state.name,
            description: this.state.description,
            has_attach: has_attach,
            user: secureStorage.getItem("user"),
            project: this.state.projectName,
            priority: document.getElementById("prioritySelect").value,
            carta: this.state.carta
          }
          let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }
          await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/requestNVN", options)
              .then(response => response.json())
              .then(async json => {
                  if(json.filename && this.state.attach){
                    const extension = this.state.attach.name.split('.').pop();
                    const file  = new FormData(); 
                    file.append('file', this.state.attach, json.filename + "." + extension);
                    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/uploadAttach", {
                        method: 'POST',
                        body: file,
                        }).then(response =>{
                            if (response.status === 200){
                                this.props.success()
                            }
                        })                       
                    
                  }else{
                      this.props.success()
                  }
              })
              this.closeModal()
    }else{
        this.setState({errorBlankRequest: true})
    }
        
    }    

    render() {       
      return (
        <div>
          <div className='mainmenu__item__container' style={{marginTop:"10px"}}>
            <span style={{display:"flex"}} ><div style={{width:"280px"}}><text className='mainmenu__item' onClick={()=> this.openModal()}>Navisworks</text></div></span>
          </div>   
          <div>
          <Modal visible={this.state.visible} width="660px" height="640px" effect="fadeInUp" onClickAway={() => this.closeModal()}>
              <div
              className={`alert alert-success ${this.state.errorBlankRequest ? 'alert-shown' : 'alert-hidden'}`}
              onTransitionEnd={() => this.setState({errorBlankRequest: false})}
              >
              <AlertF type="qtracker" text="At least one field is blank!" margin="5px"/>                            
              </div>
              <div className="qtrackerRequest__container">
                <table>
                <thead>
                  <tr>
                    <th colSpan={3}>
                      <center className="qtracker__popUp__title" style={{marginBottom: "30px"}}><h3>Navisworks</h3></center>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Primer fila: Project - Carta - Priority */}
                  <tr>
                    <td style={{textAlign: "left"}}>
                      <label className="priority__label" for="projectSelect" >Project</label>                            
                    </td>
                    <td style={{textAlign: "left"}}>
                      <label className="priority__label" for="carta">Carta</label>                            
                    </td>
                    <td style={{textAlign: "left"}}>
                      <label className="priority__label" for="prioritySelect">Priority</label>
                    </td>
                  </tr>
                  <tr>
                    <td style={{textAlign: "left"}}>
                      <select id="projectSelect" className="projectSelect" onChange={(e) => this.setState({projectName: e.target.value})}>
                          {this.state.projects.map(project =>(
                              <option>{project}</option>
                          ))}
                      </select>
                    </td>
                    <td style={{textAlign: "left"}}>
                      <input type="text" id="carta" className="carta__input" onChange={(e) => this.setState({carta: e.target.value})}></input>                      
                    </td>
                    <td style={{textAlign: "left"}}>
                      <select id="prioritySelect" className="prioritySelect">    
                              <option value="0">Low</option> 
                              <option value="1">Medium</option>  
                              <option value="2">High</option>                                
                      </select>
                    </td>
                  </tr>
                  {/* Segunda fila: Name */}
                  <tr>
                    <td style={{textAlign: "left"}}>
                      <label className="priority__label" for="name">Name</label>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3}>
                      <input data-for="name-help" data-tip="Name help" data-iscapture="true" type="text" id="name" className="qtrackerPopUp__input__text" ref="name" style={{marginBottom: "20px", color:'black'}} value={this.state.name} onChange={(e) => this.setState({name: e.target.value})} ></input>
                      <ReactTooltip id="name-help" place="right" type="dark" effect="solid"/>
                    </td>
                  </tr>
                  {/* Tercera fila: Description */}
                  <tr>
                    <td style={{textAlign: "left"}}>
                      <label className="priority__label" for="description">Description</label>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3}>
                      <textarea name="description" className="qtrackerPopUp__input__text" rows="5" ref="description" style={{marginBottom:"20px", color:"black"}} onChange={(e) => this.setState({description: e.target.value})}/>
                    </td>
                  </tr>
                  {/* Cuarta fila: Attach */}
                  <tr>
                    <td style={{textAlign: "left"}}>
                    <label for="attach" className="priority__label" style={{marginRight: "10px"}}>Attach </label>
                      <input type="file" id="attach"className="qtrackerPopUp__input__file"  ref="attach" style={{marginBottom: "30px"}} onChange={(e) => this.setState({attach: e.target.files[0]})} ></input>
                    </td>
                  </tr>
                </tbody>
                </table>
                {/* Quinta fila: los dos botones */}
                <button class="btn__submit" onClick={() => this.request()} >Submit</button>
                <button class="btn__cancel" onClick={() => this.closeModal()} >Cancel</button>
              </div>
          </Modal>
        </div>
      </div>
    );
  }
}