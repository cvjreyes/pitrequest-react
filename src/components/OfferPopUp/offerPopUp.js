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
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import '../qtrackerNWCPopUp/qtrackerNWCPopUp.css'
import '../qtrackerISSpecPopUp/qtrackerISSpecPopUp.css'

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
                <Typography variant="h5" sx={{ fontWeight: 'inherit', flexGrow: 1, fontFamily: "Montserrat, sans-serif", fontSize:"30px" }}>
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

export default class OfferPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible : false,
            name: null,
            code: null,
            attach: null,
            description: null,
            errorBlankRequest: false,
            tasks: [],
            tasks_menu: [],
            checked: [],
            expanded: [],
            hours: null,
        }
    }

    

    async componentDidMount(){

      const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
      }


      await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getTasksPopUp", options)
        .then(response => response.json())
        .then(async json => {
          let softwares = json.softwares
          let c = 1
          let nodes = []
          Object.entries(softwares).map(async function([key, tasks]){ 
            let software = {
              value: c,
              label: <span style={{fontSize:"22px"}}>{key}</span>
            }
            let current_tasks = []
            let subtasks = []
            let task = {}
            let task_menu = []
            let init = 0
            for(let i = 0; i < tasks.length; i+=2){
              
              Object.entries(tasks[i]).map( function([key, value]){
                  if(current_tasks.indexOf(key) < 0){
                    if(init > 0){
                      task["children"] = subtasks
                      task_menu.push(task)
                      task = {}
                      subtasks = []
                    }else{
                      init += 1
                    }
                    task = {
                      value: key * 100,
                      label: <span style={{fontSize:"22px"}}>{value}</span>
                    }
                    current_tasks.push(key)
                  }
              })
              Object.entries(tasks[i+1]).map( function([key, value]){
                subtasks.push({
                  value: key,
                  label: value
                })
              })
            }
            c += 1
            task["children"] = subtasks
            task_menu.push(task)
            software["children"] = task_menu
            nodes.push(software)
          })
          await this.setState({tasks_menu: nodes})
        })
      }

    async openModal() {
        await this.setState({
            visible : true,
            name: null,
            description: null,
            attach: null,
            hours: null
        });
    }

    async closeModal() {
        await this.setState({
            visible : false,
            name: null,
            code: null,
            description: null,
            attach: null,
            checked: [],
            expanded: [],
            hours: null
        });

        this.refs.name.value = null;
        this.refs.code.value = null;
    }


    async createOffer(){
      if(this.state.name && this.state.code){

        let body ={
            name : this.state.name,
            code: this.state.code,
            tasks: this.state.checked,
            hours: this.state.hours
          }
          let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }
          await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/createOffer", options)
              .then(response => response.json())
              .then(async json => {                 
                this.props.successProject()              
              })
              this.closeModal()
        }else{
            this.setState({errorBlankRequest: true})
        }
        
    }    

    render() {       
        let tasks_tree = <p className='priority__label' style={{marginLeft:"6px"}}>No tasks available</p>
        if(this.state.tasks_menu.length > 0){
          tasks_tree = <CheckboxTree
                            nodes={this.state.tasks_menu}
                            checked={this.state.checked}
                            expanded={this.state.expanded}
                            onCheck={checked => this.setState({ checked })}
                            onExpand={expanded => this.setState({ expanded })}
                            icons="fa5"
                            
                        />   
        }
        return (
            <div>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css"></link>

                    <div className='mainmenu__item__container' style={{marginTop:"10px"}}>
                      <span style={{display:"flex"}} ><div style={{width:"280px"}}><text className='mainmenu__item' onClick={()=> this.openModal()}>Create Offer</text></div></span>
                    </div>              
                    <div>
                    
                    <Modal visible={this.state.visible} width="700" height="900" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                        <div
                        className={`alert alert-warning ${this.state.errorBlankRequest ? 'alert-shown' : 'alert-hidden'}`}
                        onTransitionEnd={() => this.setState({errorBlankRequest: false})}
                        >
                            <AlertF type="qtracker" text="At least one field is blank!" margin="5px"/>                            
                        </div>
                        <center className="title__popUp" style={{marginBottom: "30px", marginTop: "30px"}}> New Offer</center>
                        <div className="qtrackerRequest__container">
                        <h4 className="project__subtitle">Offer Name</h4>
                        <div>
                        <input type="text" id="name" className="project__input__text" ref="name" style={{marginBottom: "20px", color:'black'}} value={this.state.name} onChange={(e) => this.setState({name: e.target.value})} ></input>
                        <input type="text" placeholder="Code" id="code" className="code__input__text" ref="code" style={{marginBottom: "20px", color:'black'}} value={this.state.code} onChange={(e) => this.setState({code: e.target.value})} ></input>
                        </div>
                        <div className="estihrs__container">
                          <label className="priority__label" for="hours" style={{marginRight: "5px"}}><h5>Estimated support hours:</h5></label>
                          <input type="text" id="hours" className="carta__input" onChange={(e) => this.setState({hours: e.target.value})}></input>
                        </div>
                        <h4 className="project__subtitle">Initial tasks</h4>     
                        <div className="menu__container">
                        {tasks_tree}
                        </div>
                            
                        </div>
                        <button class="btn__submit__project" onClick={() => this.createOffer()} >Submit</button>
                        <button class="btn__cancel__project" onClick={() => this.closeModal()} >Cancel</button>
                    </Modal>
                </div>
            </div>
        );
    }
}