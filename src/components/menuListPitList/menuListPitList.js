import * as React from 'react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';
import {useNavigate} from "react-router";
import QtrackerNWCPopUp from '../qtrackerNWCPopUp/qtrackerNWCPopUp'
import QtrackerNVNPopUp from '../qtrackerNVNPopUp/qtrackerNVNPopUp';
import QtrackerNRIPopUp from '../qtrackerNRIPopUp/qtrackerNRIPopUp';
import QtrackerNRBPopUp from '../qtrackerNRBPopUp/qtrackerNRBPopUp';
import QtrackerRRPopUp from '../qtrackerRRPopUp/qtrackerRRPopUp';
import QtrackerNRIDSPopUp from '../qtrackerNRIDSPopUp/qtrackerNRIDSPopUp';
import SvgIcon from '@mui/material/SvgIcon';
import ProjectPopUp from '../projectPopUp/projectPopUp';
import { fade, makeStyles, withStyles } from '@material-ui/core/styles';
import OfferPopUp from '../OfferPopUp/offerPopUp';
import Vector from "../../assets/images/Vector.png"

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

function PlusSquare(props) {
  return (
    <SvgIcon width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M6.62812 11.2678L2.65125 7.29093L6.62812 3.31406" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M6.62812 16.5703H13.9191C15.1496 16.5703 16.3297 16.0815 17.1998 15.2114C18.0699 14.3413 18.5587 13.1611 18.5587 11.9306V11.9306C18.5587 11.3213 18.4387 10.718 18.2056 10.1551C17.9724 9.59216 17.6307 9.08069 17.1998 8.64985C16.769 8.21902 16.2575 7.87726 15.6946 7.6441C15.1317 7.41093 14.5284 7.29092 13.9191 7.29092H2.65125" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </SvgIcon>
  );
}

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
    marginLeft: 30,
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(2),
    },
  },
}));

const useStyles = makeStyles({
  label: {
    backgroundColor: "green",
    color: "red"
  }
});

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
          <Typography variant="caption" color="inherit">
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

export default function MenuListPITList(props) {

    const [options, setOptions] = useState(null)
    const [currentMenu, setcurrentMenu] = useState("main")

    const history = useNavigate()

    const [itplanMenu, setItplanMenu] = useState(null)

    function handleCADpmcClick(){
        window.open("http://eu012vm0190/UI/Login.aspx", "_blank")
    }

    function handlePitViewClick(){
      history("/"+process.env.REACT_APP_PROJECT+"/pitrequestsview");
    }

    function handleProjectsViewClick(){
      history("/"+process.env.REACT_APP_PROJECT+"/projectsview");
    }

    function success(){
      props.success()
    }

    function successProject(){
      props.successProject()
    }

    function handleManageProjectsViewClick(){
      history("/"+process.env.REACT_APP_PROJECT+"/projectManager")
    }

    function handleManageOffersViewClick(){
      history("/"+process.env.REACT_APP_PROJECT+"/offersManager")
    }

    function handleSPClick(){
      history("/"+process.env.REACT_APP_PROJECT+"/sptracker")
    }

    useEffect(async ()=>{

      if(currentMenu === "main"){
        const options = {
          method: "GET",
          headers: {
              "Content-Type": "application/json"
          }
        }
        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/isAdmin/" + secureStorage.getItem("user"), options)
          .then(response => response.json())
          .then(async json => {
              if(json.isAdmin){
                await setOptions(<div><text className='select__text'>Select your option</text>
                <div className='mainmenu__item__container' style={{marginTop:"40px"}}>
                  <span style={{display:"flex"}} onClick={()=> setcurrentMenu("request")}><div style={{width:"260px"}}><text className='mainmenu__item'>Request item</text></div><img src={Vector} alt="vector" className='vector__image'></img></span>
                </div>
                <div className='mainmenu__item__container'>
                  <span style={{display:"flex"}} onClick={()=> setcurrentMenu("issues")}><div style={{width:"260px"}}><text className='mainmenu__item'>Issues</text></div><img src={Vector} alt="vector" className='vector__image'></img></span>
                </div>
                <div className='mainmenu__item__container'>
                  <span style={{display:"flex"}} onClick={()=> setcurrentMenu("piping")}><div style={{width:"260px"}}><text className='mainmenu__item'>Piping Spec Materials</text></div><img src={Vector} alt="vector" className='vector__image'></img></span>
                </div>
                <div className='mainmenu__item__container'>
                  <span style={{display:"flex", width:"260px"}} onClick={()=> handlePitViewClick()}><div style={{width:"260px"}}><text className='mainmenu__item'>Requests Dashboard</text></div></span>
                </div>
                <div className='mainmenu__item__container'>
                  <span style={{display:"flex"}} onClick={()=> setcurrentMenu("itplan")}><div style={{width:"260px"}}><text className='mainmenu__item'>IT Plan</text></div><img src={Vector} alt="vector" className='vector__image'></img></span>
                </div></div>)
              }else{
                await setOptions(<div><text className='select__text'>Select your option</text>
                <div className='mainmenu__item__container' style={{marginTop:"40px"}}>
                  <span style={{display:"flex"}} onClick={()=> setcurrentMenu("request")}><div style={{width:"260px"}}><text className='mainmenu__item'>Request item</text></div><img src={Vector} alt="vector" className='vector__image'></img></span>
                </div>
                <div className='mainmenu__item__container'>
                  <span style={{display:"flex"}} onClick={()=> setcurrentMenu("issues")}><div style={{width:"260px"}}><text className='mainmenu__item'>Issues</text></div><img src={Vector} alt="vector" className='vector__image'></img></span>
                </div>
                <div className='mainmenu__item__container'>
                  <span style={{display:"flex"}} onClick={()=> setcurrentMenu("piping")}><div style={{width:"260px"}}><text className='mainmenu__item'>Piping Spec Materials</text></div><img src={Vector} alt="vector" className='vector__image'></img></span>
                </div>
                <div className='mainmenu__item__container'>
                  <span style={{display:"flex", width:"260px"}} onClick={()=> handlePitViewClick()}><div style={{width:"260px"}}><text className='mainmenu__item'>Requests Dashboard</text></div></span>
                </div></div>)
              }
          }) 
      }else if(currentMenu === "request"){
        await setOptions(<div className='back__item__container'><span style={{display:"flex"}} onClick={()=> setcurrentMenu("main")}><img src={Vector} alt="vector" className='vector__image__reversed'></img><div style={{width:"260px"}}><text className='back__text'>MAIN MENU</text></div></span>

        <QtrackerRRPopUp success={success.bind(this)}/>
        <QtrackerNRIDSPopUp success={success.bind(this)}/></div>)
      }else if(currentMenu === "issues"){
        await setOptions(<div className='back__item__container'><span style={{display:"flex"}} onClick={()=> setcurrentMenu("main")}><img src={Vector} alt="vector" className='vector__image__reversed'></img><div style={{width:"260px"}}><text className='back__text'>MAIN MENU</text></div></span>

        <QtrackerNWCPopUp success={success.bind(this)}/>
        <QtrackerNVNPopUp success={success.bind(this)}/>
        <QtrackerNRIPopUp success={success.bind(this)}/></div>)
      }else if(currentMenu === "piping"){
        await setOptions(<div className='back__item__container'><span style={{display:"flex"}} onClick={()=> setcurrentMenu("main")}><img src={Vector} alt="vector" className='vector__image__reversed'></img><div style={{width:"260px"}}><text className='back__text'>MAIN MENU</text></div></span>

        <div className='mainmenu__item__container'>
          <span style={{display:"flex", width:"260px"}} onClick={()=> handleCADpmcClick()}><div style={{width:"260px", marginTop:"5px"}}><text className='mainmenu__item'>CADPMC</text></div></span>
        </div>
        <div className='mainmenu__item__container' style={{marginTop:"10px"}}>
          <span style={{display:"flex", width:"260px"}} onClick={()=> handleSPClick()}><div style={{width:"260px"}}><text className='mainmenu__item'>SPTracker</text></div></span>
        </div></div>)
      }else if(currentMenu === "itplan"){
        await setOptions(<div className='back__item__container'><span style={{display:"flex"}} onClick={()=> setcurrentMenu("main")}><img src={Vector} alt="vector" className='vector__image__reversed'></img><div style={{width:"260px"}}><text className='back__text'>MAIN MENU</text></div></span>

        <div className='mainmenu__item__container'>
          <span style={{display:"flex", width:"260px"}} onClick={()=> handleCADpmcClick()}><div style={{width:"260px", marginTop:"5px"}}><text className='mainmenu__item'>CADPMC</text></div></span>
        </div>
        <div className='mainmenu__item__container' style={{marginTop:"10px"}}>
          <span style={{display:"flex", width:"260px"}} onClick={()=> handleSPClick()}><div style={{width:"260px"}}><text className='mainmenu__item'>SPTracker</text></div></span>
        </div></div>)
      }
      
    }, [currentMenu])


  return (
    /*
    <TreeView
      aria-label="customized"
      defaultExpanded={['3']}
      defaultCollapseIcon={<ArrowDropDownIcon/>}
      defaultExpandIcon={<ArrowRightIcon />}
      defaultEndIcon={<div style={{ width: 24 }} />}
      sx={{ height: 800, flexGrow: 1, maxWidth: 720, overflowY: 'auto' }}
    >
      <StyledTreeItem nodeId="1" style={{marginBottom:"5px"}} labelText="Request Item" labelIcon={Label}>
        <QtrackerRRPopUp success={success.bind(this)}/>
        <QtrackerNRIDSPopUp success={success.bind(this)}/>
      </StyledTreeItem>

      <StyledTreeItem nodeId="4" style={{marginBottom:"5px"}} labelText="Issues" labelIcon={Label}>
        <QtrackerNWCPopUp success={success.bind(this)}/>
        <QtrackerNVNPopUp success={success.bind(this)}/>
        <QtrackerNRIPopUp success={success.bind(this)}/>
      </StyledTreeItem>

      <StyledTreeItem nodeId="8" style={{marginBottom:"5px"}} labelText="Piping Spec Materials" labelIcon={Label}>
        <StyledTreeItem nodeId="36" style={{marginBottom:"5px"}} labelText="CADPMC" labelIcon={MailIcon} onClick={()=> handleCADpmcClick()}/>
        <StyledTreeItem nodeId="37" style={{marginBottom:"5px"}} labelText="SPTracker" labelIcon={MailIcon} onClick={()=> handleSPClick()}/>

      </StyledTreeItem>

      
      <StyledTreeItem nodeId="18" labelText="Requests Dashboard" labelIcon={InfoIcon} onClick={()=> handlePitViewClick()} />
      

      {itplanMenu}
        
    </TreeView>
    */
   <div>
    {options}
   </div>
  );
  
}
