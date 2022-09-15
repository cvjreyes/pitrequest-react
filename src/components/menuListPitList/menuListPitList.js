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
import QtrackerISPopUp from '../qtrackerISPopUp/qtrackerISPopUp';

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
          <Typography variant="h5" sx={{ fontWeight: 'inherit', flexGrow: 1, fontFamily: "Montserrat, sans-serif", fontSize:"30px" }}>
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
    const [backMenu, setBackMenu] = useState("")

    const history = useNavigate()

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

    function handleSPExpansionJoinsClick(){
      history("/"+process.env.REACT_APP_PROJECT+"/pipingExpansionJoins")
    }

    function handleSPGeneralClick(){
      history("/"+process.env.REACT_APP_PROJECT+"/pipingGeneral")
    }

    function handleSPPSVClick(){
      history("/"+process.env.REACT_APP_PROJECT+"/pipingPSV")
    }

    function handleSPSpecialClick(){
      history("/"+process.env.REACT_APP_PROJECT+"/pipingSpecial")
    }

    function handleSPPSVClick(){
      history("/"+process.env.REACT_APP_PROJECT+"/pipingPSV")
    }

    function handleSPSpecialClick(){
      history("/"+process.env.REACT_APP_PROJECT+"/pipingSpecial")
    }

    function handleLibraryClick(){
      history("/"+process.env.REACT_APP_PROJECT+"/library")
    }
    
    function handleSPKeyParamClick(){
      history("/"+process.env.REACT_APP_PROJECT+"/pipingKeyParam")
    }

    function handleUsersViewClick(){
      history("/"+process.env.REACT_APP_PROJECT+"/pitrequestsview")
      secureStorage.setItem("tab", "Users")
    }

    useEffect(async ()=>{
      setcurrentMenu("main")
    }, [props.goMainMenu])

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
                <span style={{display:"flex"}} onClick={()=> setcurrentMenu("software")}><div style={{width:"260px"}}><text className='mainmenu__item'>Software issues</text></div><img src={Vector} alt="vector" className='vector__image'></img></span>
              </div>
              <div className='mainmenu__item__container'>
                <span style={{display:"flex", width:"260px"}} onClick={()=> handlePitViewClick()}><div style={{width:"260px"}}><text className='mainmenu__item'>Requests Dashboard</text></div></span>
              </div>

              <div className='mainmenu__item__container'>
                <span style={{display:"flex", width:"260px"}} onClick={()=> handleLibraryClick()}><div style={{width:"260px"}}><text className='mainmenu__item'>CAD Library</text></div></span>
              </div>

              <div className='mainmenu__item__container'>
                <span style={{display:"flex", width:"260px"}} onClick={()=> handleUsersViewClick()}><div style={{width:"260px"}}><text className='mainmenu__item'>User Management</text></div></span>
              </div>
              <div className='mainmenu__item__container'>
                <span style={{display:"flex"}} onClick={()=> setcurrentMenu("itplan")}><div style={{width:"260px"}}><text className='mainmenu__item'>IT Plan</text></div><img src={Vector} alt="vector" className='vector__image'></img></span>
              </div></div>)
            }else{
              await setOptions(<div><text className='select__text'>Select your option</text>
              <div className='mainmenu__item__container' style={{marginTop:"40px"}}>
                <span style={{display:"flex"}} onClick={()=> setcurrentMenu("software")}><div style={{width:"260px"}}><text className='mainmenu__item'>Software issues</text></div><img src={Vector} alt="vector" className='vector__image'></img></span>
              </div>
              <div className='mainmenu__item__container'>
                <span style={{display:"flex", width:"260px"}} onClick={()=> handlePitViewClick()}><div style={{width:"260px"}}><text className='mainmenu__item'>Requests Dashboard</text></div></span>
              </div>
              <div className='mainmenu__item__container'>
                <span style={{display:"flex", width:"260px"}} onClick={()=> handleLibraryClick()}><div style={{width:"260px"}}><text className='mainmenu__item'>CAD Library</text></div></span>
              </div></div>)
            }
            /*
              if(json.isAdmin){
                await setOptions(<div><text className='select__text'>Select your option</text>
                <div className='mainmenu__item__container' style={{marginTop:"40px"}}>
                  <span style={{display:"flex"}} onClick={()=> setcurrentMenu("request")}><div style={{width:"260px"}}><text className='mainmenu__item'>Request Item</text></div><img src={Vector} alt="vector" className='vector__image'></img></span>
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
                  <span style={{display:"flex", width:"260px"}} onClick={()=> handleUsersViewClick()}><div style={{width:"260px"}}><text className='mainmenu__item'>User Management</text></div></span>
                </div>
                <div className='mainmenu__item__container'>
                  <span style={{display:"flex"}} onClick={()=> setcurrentMenu("itplan")}><div style={{width:"260px"}}><text className='mainmenu__item'>IT Plan</text></div><img src={Vector} alt="vector" className='vector__image'></img></span>
                </div></div>)
              }else{
                await setOptions(<div><text className='select__text'>Select your option</text>
                <div className='mainmenu__item__container' style={{marginTop:"40px"}}>
                  <span style={{display:"flex"}} onClick={()=> setcurrentMenu("request")}><div style={{width:"260px"}}><text className='mainmenu__item'>Request Item</text></div><img src={Vector} alt="vector" className='vector__image'></img></span>
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
              }*/
          }) 
      }else if(currentMenu === "software"){
        await setOptions(<div>
        <div className='back__item__container'><span style={{display:"flex"}} onClick={()=> setcurrentMenu("main")}><img src={Vector} alt="vector" className='vector__image__reversed'></img><div style={{width:"260px"}}><text className='back__text'>MAIN MENU</text></div></span></div>
                <div className='mainmenu__item__container__soft' style={{marginTop:"30px"}}>
                  <span style={{display:"flex"}} onClick={()=> setcurrentMenu("aveva_eng")}><div style={{width:"480px"}}><text className='mainmenu__item'>Aveva Engineering</text></div><img src={Vector} alt="vector" className='vector__image'></img></span>
                </div>
                <div className='mainmenu__item__container__soft' style={{marginTop:"30px"}}>
                  <span style={{display:"flex"}} onClick={()=> setcurrentMenu("aveva_e3d")}><div style={{width:"480px"}}><text className='mainmenu__item'>Aveva E3D Design</text></div><img src={Vector} alt="vector" className='vector__image'></img></span>
                </div>
                <div className='mainmenu__item__container__soft' style={{marginTop:"30px"}}>
                  <span style={{display:"flex"}} onClick={()=> setcurrentMenu("aveva_diag")}><div style={{width:"480px"}}><text className='mainmenu__item'>Aveva Diagrams</text></div><img src={Vector} alt="vector" className='vector__image'></img></span>
                </div>
                <div className='mainmenu__item__container__soft' style={{marginTop:"30px"}}>
                  <span style={{display:"flex"}} onClick={()=> setcurrentMenu("int_smart_inst")}><div style={{width:"480px"}}><text className='mainmenu__item'>Intergraph Smart Instrumentation</text></div><img src={Vector} alt="vector" className='vector__image'></img></span>
                </div>
                <div className='mainmenu__item__container__soft' style={{marginTop:"30px"}}>
                  <span style={{display:"flex"}} onClick={()=> setcurrentMenu("int_smart_3D")}><div style={{width:"480px"}}><text className='mainmenu__item'>Intergraph Smart 3D</text></div><img src={Vector} alt="vector" className='vector__image'></img></span>
                </div>
                <div className='mainmenu__item__container__soft' style={{marginTop:"30px"}}>
                  <span style={{display:"flex"}} onClick={()=> setcurrentMenu("auto_auto")}><div style={{width:"480px"}}><text className='mainmenu__item'>Autodesk Autocad Plant 3D</text></div><img src={Vector} alt="vector" className='vector__image'></img></span>
                </div>
                <div className='mainmenu__item__container__soft' style={{marginTop:"30px"}}>
                  <span style={{display:"flex"}} onClick={()=> setcurrentMenu("auto_revit")}><div style={{width:"480px"}}><text className='mainmenu__item'>Autodesk Revit</text></div><img src={Vector} alt="vector" className='vector__image'></img></span>
                </div>
                <div className='mainmenu__item__container__soft' style={{marginTop:"30px"}}>
                  <span style={{display:"flex"}} onClick={()=> setcurrentMenu("iso")}><div style={{width:"480px"}}><text className='mainmenu__item'>IsoTracker</text></div><img src={Vector} alt="vector" className='vector__image'></img></span>
                </div></div>)
      
    }else if(currentMenu === "aveva_eng" || currentMenu === "aveva_diag" || currentMenu === "aveva_e3d"){
      await setOptions(<div><div className='back__item__container'><span style={{display:"flex"}} onClick={()=> setcurrentMenu("software")}><img src={Vector} alt="vector" className='vector__image__reversed'></img><div style={{width:"260px"}}><text className='back__text'>SOFTWARE</text></div></span></div>
      <div className='mainmenu__item__container' style={{marginTop:"40px"}}>
        <span style={{display:"flex"}} onClick={()=> setcurrentMenu("request")}><div style={{width:"260px"}}><text className='mainmenu__item'>Request Item</text></div><img src={Vector} alt="vector" className='vector__image'></img></span>
      </div>
      <div className='mainmenu__item__container'>
        <span style={{display:"flex"}} onClick={()=> setcurrentMenu("issues")}><div style={{width:"260px"}}><text className='mainmenu__item'>Issues</text></div><img src={Vector} alt="vector" className='vector__image'></img></span>
      </div>
      <div className='mainmenu__item__container'>
        <span style={{display:"flex"}} onClick={()=> setcurrentMenu("piping")}><div style={{width:"260px"}}><text className='mainmenu__item'>Piping Spec Materials</text></div><img src={Vector} alt="vector" className='vector__image'></img></span>
      </div></div>)
      if(currentMenu === "aveva_eng"){
        setBackMenu("aveva_eng")
      }else if (currentMenu === "aveva_diag"){
        setBackMenu("aveva_diag")
      } else if (currentMenu === "aveva_e3d"){
        setBackMenu("aveva_e3d")
      }
    }else if(currentMenu === "int_smart_inst" || currentMenu === "int_smart_3D"){
      await setOptions(<div><div className='back__item__container'><span style={{display:"flex"}} onClick={()=> setcurrentMenu("software")}><img src={Vector} alt="vector" className='vector__image__reversed'></img><div style={{width:"260px"}}><text className='back__text'>SOFTWARE</text></div></span></div>
      <div className='mainmenu__item__container' style={{marginTop:"40px"}}>
        <span style={{display:"flex"}} onClick={()=> setcurrentMenu("request")}><div style={{width:"260px"}}><text className='mainmenu__item'>Request Item</text></div><img src={Vector} alt="vector" className='vector__image'></img></span>
      </div>
      <div className='mainmenu__item__container'>
        <span style={{display:"flex"}} onClick={()=> setcurrentMenu("issues")}><div style={{width:"260px"}}><text className='mainmenu__item'>Issues</text></div><img src={Vector} alt="vector" className='vector__image'></img></span>
      </div></div>)
      if(currentMenu === "int_smart_inst"){
        setBackMenu("int_smart_inst")
      }else if (currentMenu === "int_smart_3D"){
        setBackMenu("int_smart_3D")
      }    
    }else if(currentMenu === "auto_auto" || currentMenu === "auto_revit"){
      await setOptions(<div><div className='back__item__container'><span style={{display:"flex"}} onClick={()=> setcurrentMenu("software")}><img src={Vector} alt="vector" className='vector__image__reversed'></img><div style={{width:"260px"}}><text className='back__text'>SOFTWARE</text></div></span></div>
      <div className='mainmenu__item__container'>
        <span style={{display:"flex"}} onClick={()=> setcurrentMenu("issues")}><div style={{width:"260px"}}><text className='mainmenu__item'>Issues</text></div><img src={Vector} alt="vector" className='vector__image'></img></span>
      </div>
      <div className='mainmenu__item__container'>
        <span style={{display:"flex"}} onClick={()=> setcurrentMenu("piping")}><div style={{width:"260px"}}><text className='mainmenu__item'>Piping Spec Materials</text></div><img src={Vector} alt="vector" className='vector__image'></img></span>
      </div></div>)
      if(currentMenu === "auto_auto"){
        setBackMenu("auto_auto")
      }else if (currentMenu === "auto_revit"){
        setBackMenu("auto_revit")
      } 
    }else if(currentMenu === "iso"){
      await setOptions(<div><div className='back__item__container'><span style={{display:"flex"}} onClick={()=> setcurrentMenu("software")}><img src={Vector} alt="vector" className='vector__image__reversed'></img><div style={{width:"260px"}}><text className='back__text'>SOFTWARE</text></div></span></div>
      <div className='mainmenu__item__container'>
        <span style={{display:"flex"}} onClick={()=> setcurrentMenu("issues")}><div style={{width:"260px"}}><text className='mainmenu__item'>Issues</text></div><img src={Vector} alt="vector" className='vector__image'></img></span>
      </div></div>)
      if(currentMenu === "iso"){
        setBackMenu("iso")
      }
    }else if(currentMenu === "request"){
        await setOptions(<div className='back__item__container'><span style={{display:"flex"}} onClick={()=> setcurrentMenu(backMenu)}><img src={Vector} alt="vector" className='vector__image__reversed'></img><div style={{width:"260px"}}><text className='back__text'>REQUEST ITEM</text></div></span>

        <QtrackerRRPopUp success={success.bind(this)}/>
        <QtrackerNRIDSPopUp success={success.bind(this)}/>
        <QtrackerISPopUp success={success.bind(this)}/></div>)
      }else if(currentMenu === "issues"){
        await setOptions(<div className='back__item__container'><span style={{display:"flex"}} onClick={()=> setcurrentMenu(backMenu)}><img src={Vector} alt="vector" className='vector__image__reversed'></img><div style={{width:"260px"}}><text className='back__text'>ISSUES</text></div></span>

        <QtrackerNWCPopUp success={success.bind(this)}/>
        <QtrackerNVNPopUp success={success.bind(this)}/>
        <QtrackerNRIPopUp success={success.bind(this)}/></div>)
      }else if(currentMenu === "piping"){
        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/isAdmin/" + secureStorage.getItem("user"), options)
          .then(response => response.json())
          .then(async json => {
          if(json.isAdmin){
            await setOptions(<div className='back__item__container__piping'><span style={{display:"flex"}} onClick={()=> setcurrentMenu(backMenu)}><img src={Vector} alt="vector" className='vector__image__reversed'></img><div style={{width:"300px"}}><text className='back__text'>PIPING SPEC MATERIALS</text></div></span>
              <div className='mainmenu__item__container'>
                <span style={{display:"flex", width:"260px"}} onClick={()=> handleCADpmcClick()}><div style={{width:"260px", marginTop:"5px"}}><text className='mainmenu__item'>CADPMC</text></div></span>
              </div>
              <div className='mainmenu__item__container' style={{marginTop:"30px"}}>
                <span style={{display:"flex", width:"260px"}} onClick={()=> handleSPClick()}><div style={{width:"260px"}}><text className='mainmenu__item'>SPTracker</text></div></span>
              </div>
              <div className='mainmenu__item__container' style={{marginTop:"30px"}}>
                <span style={{display:"flex", width:"260px"}} onClick={()=> setcurrentMenu("instruments")}><div style={{width:"260px"}}><text className='mainmenu__item'>Instruments</text></div><img src={Vector} alt="vector" className='vector__image'></img></span>
              </div>
              <div className='mainmenu__item__container' style={{marginTop:"30px"}}>
                <span style={{display:"flex", width:"260px"}} onClick={()=> handleSPExpansionJoinsClick()}><div style={{width:"260px"}}><text className='mainmenu__item'>Expansion Joins</text></div></span>
              </div>
              <div className='mainmenu__item__container' style={{marginTop:"30px"}}>
                <span style={{display:"flex", width:"260px"}} onClick={()=> handleSPKeyParamClick()}><div style={{width:"260px"}}><text className='mainmenu__item'>Manage Catalogue</text></div></span>
              </div>
            </div>)
          } else {
            await setOptions(<div className='back__item__container__piping'><span style={{display:"flex"}} onClick={()=> setcurrentMenu(backMenu)}><img src={Vector} alt="vector" className='vector__image__reversed'></img><div style={{width:"300px"}}><text className='back__text'>PIPING SPEC MATERIALS</text></div></span>
              <div className='mainmenu__item__container'>
                <span style={{display:"flex", width:"260px"}} onClick={()=> handleCADpmcClick()}><div style={{width:"260px", marginTop:"5px"}}><text className='mainmenu__item'>CADPMC</text></div></span>
              </div>
              <div className='mainmenu__item__container' style={{marginTop:"30px"}}>
                <span style={{display:"flex", width:"260px"}} onClick={()=> handleSPClick()}><div style={{width:"260px"}}><text className='mainmenu__item'>SPTracker</text></div></span>
              </div>
              <div className='mainmenu__item__container' style={{marginTop:"30px"}}>
                <span style={{display:"flex", width:"260px"}} onClick={()=> setcurrentMenu("instruments")}><div style={{width:"260px"}}><text className='mainmenu__item'>Instruments</text></div><img src={Vector} alt="vector" className='vector__image'></img></span>
              </div>
              <div className='mainmenu__item__container' style={{marginTop:"30px"}}>
                <span style={{display:"flex", width:"260px"}} onClick={()=> handleSPExpansionJoinsClick()}><div style={{width:"260px"}}><text className='mainmenu__item'>Expansion Joins</text></div></span>
              </div>
            </div>)
          }
        })
      } else if(currentMenu === "instruments"){
        await setOptions(<div className='back__item__container__piping'><span style={{display:"flex"}} onClick={()=> setcurrentMenu(backMenu)}><img src={Vector} alt="vector" className='vector__image__reversed'></img><div style={{width:"300px"}}><text className='back__text'>PIPING INSTRUMENT</text></div></span>
          <div className='mainmenu__item__container'>
            <span style={{display:"flex", width:"260px"}} onClick={()=> handleSPGeneralClick()}><div style={{width:"260px", marginTop:"5px"}}><text className='mainmenu__item'>General</text></div></span>
          </div>
          <div className='mainmenu__item__container' style={{marginTop:"30px"}}>
            <span style={{display:"flex", width:"260px"}} onClick={()=> handleSPPSVClick()}><div style={{width:"260px"}}><text className='mainmenu__item'>PSV</text></div></span>
          </div>
          <div className='mainmenu__item__container' style={{marginTop:"30px"}}>
            <span style={{display:"flex", width:"260px"}} onClick={()=> handleSPSpecialClick()}><div style={{width:"260px"}}><text className='mainmenu__item'>Special</text></div></span>
          </div>
        </div>)
      }else if(currentMenu === "itplan"){
        await setOptions(<div className='back__item__container'><span style={{display:"flex"}} onClick={()=> setcurrentMenu("main")}><img src={Vector} alt="vector" className='vector__image__reversed'></img><div style={{width:"260px"}}><text className='back__text'>MAIN MENU</text></div></span>

        <div className='mainmenu__item__container'>
          <span style={{display:"flex", width:"260px"}} onClick={()=> handleProjectsViewClick()}><div style={{width:"260px", marginTop:"5px"}}><text className='mainmenu__item'>Tasks</text></div></span>
        </div>
        <div className='mainmenu__item__container' style={{marginTop:"10px"}}>
          <span style={{display:"flex", width:"260px"}} onClick={()=> handleManageProjectsViewClick()}><div style={{width:"260px"}}><text className='mainmenu__item'>Project Manager</text></div></span>
        </div>
        <ProjectPopUp successProject={successProject.bind(this)}/>
        <div className='mainmenu__item__container' style={{marginTop:"10px"}}>
          <span style={{display:"flex", width:"260px"}} onClick={()=> handleManageOffersViewClick()}><div style={{width:"260px"}}><text className='mainmenu__item'>Offer Manager</text></div></span>
        </div>
        <OfferPopUp successProject={successProject.bind(this)}/></div>)
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
      

      <StyledTreeItem nodeId="12" labelText="ITPlan" color="#e3742f" bgColor="#fcefe3" labelIcon={Label}>

              <StyledTreeItem nodeId="19" labelText="Tasks" color="#e3742f" bgColor="#fcefe3" labelIcon={InfoIcon} onClick={()=> handleProjectsViewClick()}/>
      
              <StyledTreeItem nodeId="20" labelText="Projects manager" color="#e3742f" bgColor="#fcefe3" labelIcon={InfoIcon} onClick={()=> handleManageProjectsViewClick()}/>
     
              <ProjectPopUp successProject={successProject.bind(this)}/>

              <StyledTreeItem nodeId="21" labelText="Offers manager" color="#e3742f" bgColor="#fcefe3" labelIcon={InfoIcon} onClick={()=> handleManageOffersViewClick()}/>

              <OfferPopUp successProject={successProject.bind(this)}/>
              
            </StyledTreeItem>
        
    </TreeView>
    */
   <div>
    {options}
   </div>
  );
  
}
