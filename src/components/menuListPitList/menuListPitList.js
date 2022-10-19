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
import QtrackerCitrixPopUp from '../qtrackerCitrixPopUp/qtrackerCitrixPopUp';
import QtrackerModelingPopUp from '../qtrackerModelingPopUp/qtrackerModelingPopUp';
import QtrackerDrawingPopUp from '../qtrackerDrawingPopUp/qtrackerDrawingPopUp';
import QtrackerDrawingIsoPopUp from '../qtrackerDrawingIsoPopUp/qtrackerDrawingIsoPopUp';
import QtrackerDrawingOrtoPopUp from '../qtrackerDrawingOrtoPopUp/qtrackerDrawingOrtoPopUp';
import QtrackerNRIPopUp from '../qtrackerNRIPopUp/qtrackerNRIPopUp';
import QtrackerRRPopUp from '../qtrackerRRPopUp/qtrackerRRPopUp';
import QtrackerPermissionsPopUp from '../qtrackerPermissionsPopUp/qtrackerPermissionsPopUp';
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
          <Typography variant="h5" sx={{ fontWeight: 'inherit', flexGrow: 1, fontFamily: "Montserrat, sans-serif", fontSize:"10px" }}>
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
    const [currentMenu, setcurrentMenu] = useState("main") // Hook que te lleva al menu correspondiente
    const [backMenu, setBackMenu] = useState("") // Hook que te lleva al menu que estabas antes guardando su nombre antes de ir al siguiente menu
    const [inSmart3d, setInSmart3d] = useState(false) // Hook que si pulsas el software de smart3D te muestra mas opciones en el menu si da true

    const history = useNavigate()

    // Boton que te lleva a esta pagina en una ventana nueva en blanco
    function handleCADpmcClick(){
        window.open("http://eu012vm0190/UI/Login.aspx", "_blank")
    }

    // Boton que te lleva a la pagina de Request Dashboards
    function handlePitViewClick(){
      history("/"+process.env.REACT_APP_PROJECT+"/pitrequestsview");
    }

    // Boton que te lleva a la pagina donde visualizas los proyectos, pulsando IT Plan => Tasks
    function handleProjectsViewClick(){
      history("/"+process.env.REACT_APP_PROJECT+"/projectsview");
    }

    function success(){
      props.success()
    }

    // Pop up que muestra la Create Project y Create Offer
    function successProject(){
      props.successProject()
    }

    // Boton que te lleva a la pagina de Project Manager, pulsando IT Plan => Project Manager
    function handleManageProjectsViewClick(){
      history("/"+process.env.REACT_APP_PROJECT+"/projectManager")
    }

    // Boton que te lleva a la pagina de Offer Manager, pulsando IT Plan => Offer Manager
    function handleManageOffersViewClick(){
      history("/"+process.env.REACT_APP_PROJECT+"/offersManager")
    }

    // Boton que te lleva a la pagina de SPTracker, pulsando Software Issues => Software con la opcion piping => Piping Spec Materials => SPTracker
    function handleSPClick(){
      history("/"+process.env.REACT_APP_PROJECT+"/sptracker")
    }

    // Boton que te lleva a la pagina de Expansion Joins, pulsando Software Issues => Software con la opcion piping => Piping Spec Materials => Expansion Joins
    function handleSPExpansionJoinsClick(){
      history("/"+process.env.REACT_APP_PROJECT+"/pipingExpansionJoins")
    }

    // Boton que te lleva a la pagina de Piping General, pulsando Software Issues => Software con la opcion piping => Piping Spec Materials => Instruments => General
    function handleSPGeneralClick(){
      history("/"+process.env.REACT_APP_PROJECT+"/pipingGeneral")
    }

    // Boton que te lleva a la pagina de Piping PSV, pulsando Software Issues => Software con la opcion piping => Piping Spec Materials => Instruments => PSV
    function handleSPPSVClick(){
      history("/"+process.env.REACT_APP_PROJECT+"/pipingPSV")
    }

    // Boton que te lleva a la pagina de Piping Special, pulsando Software Issues => Software con la opcion piping => Piping Spec Materials => Instruments => Special
    function handleSPSpecialClick(){
      history("/"+process.env.REACT_APP_PROJECT+"/pipingSpecial")
    }

    // Boton que te lleva a la pagina de CAD Library
    function handleLibraryClick(){
      history("/"+process.env.REACT_APP_PROJECT+"/library")
    }
    
    // Boton que te lleva a la pagina de Manage Catalogue, pulsando Software Issues => Software con la opcion piping => Piping Spec Materials => Manage Catalogue
    function handleSPKeyParamClick(){
      history("/"+process.env.REACT_APP_PROJECT+"/pipingKeyParam")
    }

    // Boton que te lleva a la pagina de User Management
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
            // Si eres admin Muestra ( Software Issues, Request Dashboard, CAD Library, User Management, IT Plan)
            if(json.isAdmin){
              await setOptions(<div><p className='select__text'>Select your option</p>
              <div className='mainmenu__item__container' style={{marginTop:"40px"}}>
                <span style={{display:"flex"}} onClick={()=> setcurrentMenu("software")}><div style={{width:"260px"}}><p className='mainmenu__item'>Software issues</p></div><img src={Vector} alt="vector" className='vector__image'></img></span>
              </div>
              <div className='mainmenu__item__container'>
                <span style={{display:"flex", width:"260px"}} onClick={()=> handlePitViewClick()}><div style={{width:"260px"}}><p className='mainmenu__item'>Requests Dashboard</p></div></span>
              </div>

              <div className='mainmenu__item__container'>
                <span style={{display:"flex", width:"260px"}} onClick={()=> handleLibraryClick()}><div style={{width:"260px"}}><p className='mainmenu__item'>CAD Library</p></div></span>
              </div>

              <div className='mainmenu__item__container'>
                <span style={{display:"flex", width:"260px"}} onClick={()=> handleUsersViewClick()}><div style={{width:"260px"}}><p className='mainmenu__item'>User Management</p></div></span>
              </div>
              <div className='mainmenu__item__container'>
                <span style={{display:"flex"}} onClick={()=> setcurrentMenu("itplan")}><div style={{width:"260px"}}><p className='mainmenu__item'>IT Plan</p></div><img src={Vector} alt="vector" className='vector__image'></img></span>
              </div></div>)
            // Si no es admin se muestra ( Software Issues, Requests Dashboards, CAD Library )
            }else{
              await setOptions(<div><p className='select__text'>Select your option</p>
              <div className='mainmenu__item__container' style={{marginTop:"40px"}}>
                <span style={{display:"flex"}} onClick={()=> setcurrentMenu("software")}><div style={{width:"260px"}}><p className='mainmenu__item'>Software issues</p></div><img src={Vector} alt="vector" className='vector__image'></img></span>
              </div>
              <div className='mainmenu__item__container'>
                <span style={{display:"flex", width:"260px"}} onClick={()=> handlePitViewClick()}><div style={{width:"260px"}}><p className='mainmenu__item'>Requests Dashboard</p></div></span>
              </div>
              <div className='mainmenu__item__container'>
                <span style={{display:"flex", width:"260px"}} onClick={()=> handleLibraryClick()}><div style={{width:"260px"}}><p className='mainmenu__item'>CAD Library</p></div></span>
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
      // Si selecciona Software Issues se muestra todos los softwares registrados en la empresa
      }else if(currentMenu === "software"){
        await setOptions(<div>
        <div className='back__item__container'><span style={{display:"flex"}} onClick={()=> setcurrentMenu("main")}><img src={Vector} alt="vector" className='vector__image__reversed'></img><div style={{width:"260px"}}><p className='back__text'>MAIN MENU</p></div></span></div>
                <div className='mainmenu__item__container__soft' style={{marginTop:"10px"}}>
                  <span style={{display:"flex"}} onClick={()=> setcurrentMenu("aveva_eng")}><div style={{width:"480px"}}><p className='mainmenu__item'>Aveva Engineering</p></div><img src={Vector} alt="vector" className='vector__image'></img></span>
                </div>
                <div className='mainmenu__item__container__soft' style={{marginTop:"10px"}}>
                  <span style={{display:"flex"}} onClick={()=> setcurrentMenu("aveva_e3d")}><div style={{width:"480px"}}><p className='mainmenu__item'>Aveva E3D Design</p></div><img src={Vector} alt="vector" className='vector__image'></img></span>
                </div>
                <div className='mainmenu__item__container__soft' style={{marginTop:"10px"}}>
                  <span style={{display:"flex"}} onClick={()=> setcurrentMenu("aveva_diag")}><div style={{width:"480px"}}><p className='mainmenu__item'>Aveva Diagrams</p></div><img src={Vector} alt="vector" className='vector__image'></img></span>
                </div>
                <div className='mainmenu__item__container__soft' style={{marginTop:"10px"}}>
                  <span style={{display:"flex"}} onClick={()=> setcurrentMenu("int_smart_inst")}><div style={{width:"480px"}}><p className='mainmenu__item'>Intergraph Smart Instrumentation</p></div><img src={Vector} alt="vector" className='vector__image'></img></span>
                </div>
                <div className='mainmenu__item__container__soft' style={{marginTop:"10px"}}>
                  <span style={{display:"flex"}} onClick={()=> setcurrentMenu("int_smart_3D")}><div style={{width:"480px"}}><p className='mainmenu__item'>Intergraph Smart 3D</p></div><img src={Vector} alt="vector" className='vector__image'></img></span>
                </div>
                <div className='mainmenu__item__container__soft' style={{marginTop:"10px"}}>
                  <span style={{display:"flex"}} onClick={()=> setcurrentMenu("auto_auto")}><div style={{width:"480px"}}><p className='mainmenu__item'>Autodesk Autocad Plant 3D</p></div><img src={Vector} alt="vector" className='vector__image'></img></span>
                </div>
                <div className='mainmenu__item__container__soft' style={{marginTop:"10px"}}>
                  <span style={{display:"flex"}} onClick={()=> setcurrentMenu("auto_revit")}><div style={{width:"480px"}}><p className='mainmenu__item'>Autodesk Revit</p></div><img src={Vector} alt="vector" className='vector__image'></img></span>
                </div>
                <div className='mainmenu__item__container__soft' style={{marginTop:"10px"}}>
                  <span style={{display:"flex"}} onClick={()=> setcurrentMenu("iso")}><div style={{width:"480px"}}><p className='mainmenu__item'>IsoTracker</p></div><img src={Vector} alt="vector" className='vector__image'></img></span>
                </div></div>)
    // Si selecciona estos tres softwares su submenu mostrara ( Request Item, Issues, Piping Spec Materials)
    }else if(currentMenu === "aveva_eng" || currentMenu === "aveva_diag" || currentMenu === "aveva_e3d"){
      await setOptions(<div><div className='back__item__container'><span style={{display:"flex"}} onClick={()=> setcurrentMenu("software")}><img src={Vector} alt="vector" className='vector__image__reversed'></img><div style={{width:"260px"}}><p className='back__text'>SOFTWARE</p></div></span></div>
      <div className='mainmenu__item__container' style={{marginTop:"40px"}}>
        <span style={{display:"flex"}} onClick={()=> setcurrentMenu("request")}><div style={{width:"260px"}}><p className='mainmenu__item'>Request Item</p></div><img src={Vector} alt="vector" className='vector__image'></img></span>
      </div>
      <div className='mainmenu__item__container'>
        <span style={{display:"flex"}} onClick={()=> setcurrentMenu("issues")}><div style={{width:"260px"}}><p className='mainmenu__item'>Issues</p></div><img src={Vector} alt="vector" className='vector__image'></img></span>
      </div>
      <div className='mainmenu__item__container'>
        <span style={{display:"flex"}} onClick={()=> setcurrentMenu("piping")}><div style={{width:"260px"}}><p className='mainmenu__item'>Piping Spec Materials</p></div><img src={Vector} alt="vector" className='vector__image'></img></span>
      </div></div>)
      // Boleana que si es falso no muestra datos extras en el submenu de Request Item y Issues
      if(currentMenu === "aveva_eng"){
        setInSmart3d(false)
        setBackMenu("aveva_eng")
      }else if (currentMenu === "aveva_diag"){
        setInSmart3d(false)
        setBackMenu("aveva_diag")
      } else if (currentMenu === "aveva_e3d"){
        setInSmart3d(false)
        setBackMenu("aveva_e3d")
      }
    // Si seleccionas estos software se mostrara ( Request Item, Issues )
    }else if(currentMenu === "int_smart_inst" || currentMenu === "int_smart_3D"){
      await setOptions(<div><div className='back__item__container'><span style={{display:"flex"}} onClick={()=> setcurrentMenu("software")}><img src={Vector} alt="vector" className='vector__image__reversed'></img><div style={{width:"260px"}}><p className='back__text'>SOFTWARE</p></div></span></div>
      <div className='mainmenu__item__container' style={{marginTop:"40px"}}>
        <span style={{display:"flex"}} onClick={()=> setcurrentMenu("request")}><div style={{width:"260px"}}><p className='mainmenu__item'>Request Item</p></div><img src={Vector} alt="vector" className='vector__image'></img></span>
      </div>
      <div className='mainmenu__item__container'>
        <span style={{display:"flex"}} onClick={()=> setcurrentMenu("issues")}><div style={{width:"260px"}}><p className='mainmenu__item'>Issues</p></div><img src={Vector} alt="vector" className='vector__image'></img></span>
      </div></div>)
      if(currentMenu === "int_smart_inst"){
        setInSmart3d(false)
        setBackMenu("int_smart_inst")
      }else if (currentMenu === "int_smart_3D"){
        console.log("In smart: " + inSmart3d);
        setInSmart3d(true)
        console.log("After In smart: " + inSmart3d);
        setBackMenu("int_smart_3D")
      }    
    // Si seleccionas estos software se mostrara ( Issues, Piping Spec Materials )
    }else if(currentMenu === "auto_auto" || currentMenu === "auto_revit"){
      await setOptions(<div><div className='back__item__container'><span style={{display:"flex"}} onClick={()=> setcurrentMenu("software")}><img src={Vector} alt="vector" className='vector__image__reversed'></img><div style={{width:"260px"}}><p className='back__text'>SOFTWARE</p></div></span></div>
      <div className='mainmenu__item__container'>
        <span style={{display:"flex"}} onClick={()=> setcurrentMenu("issues")}><div style={{width:"260px"}}><p className='mainmenu__item'>Issues</p></div><img src={Vector} alt="vector" className='vector__image'></img></span>
      </div>
      <div className='mainmenu__item__container'>
        <span style={{display:"flex"}} onClick={()=> setcurrentMenu("piping")}><div style={{width:"260px"}}><p className='mainmenu__item'>Piping Spec Materials</p></div><img src={Vector} alt="vector" className='vector__image'></img></span>
      </div></div>)
      if(currentMenu === "auto_auto"){
        setInSmart3d(false)
        setBackMenu("auto_auto")
      }else if (currentMenu === "auto_revit"){
        setInSmart3d(false)
        setBackMenu("auto_revit")
      } 
    // Si seleccionas estos software se mostrara ( Issues )
    }else if(currentMenu === "iso"){
      await setOptions(<div><div className='back__item__container'><span style={{display:"flex"}} onClick={()=> setcurrentMenu("software")}><img src={Vector} alt="vector" className='vector__image__reversed'></img><div style={{width:"260px"}}><p className='back__text'>SOFTWARE</p></div></span></div>
      <div className='mainmenu__item__container'>
        <span style={{display:"flex"}} onClick={()=> setcurrentMenu("issues")}><div style={{width:"260px"}}><p className='mainmenu__item'>Issues</p></div><img src={Vector} alt="vector" className='vector__image'></img></span>
      </div></div>)
      if(currentMenu === "iso"){
        setInSmart3d(false)
        setBackMenu("iso")
      }
    // Si seleccionas pulsas el boton request aparecera un submenu que mostrara estos componentes
    }else if(currentMenu === "request"){
        // Si el software es smart3D se muestran mas componentes
        if(inSmart3d===true){
          await setOptions(<div className='back__item__container'><span style={{display:"flex"}} onClick={()=> setcurrentMenu(backMenu) && setInSmart3d(false)}><img src={Vector} alt="vector" className='vector__image__reversed'></img><div style={{width:"260px"}}><p className='back__text'>REQUEST ITEM</p></div></span>
          <QtrackerRRPopUp success={success.bind(this)} margin={true}/>
          <QtrackerNRIDSPopUp success={success.bind(this)}/>
          <QtrackerISPopUp success={success.bind(this)}/>
          <QtrackerDrawingPopUp success={success.bind(this)}/>
          <QtrackerNVNPopUp success={success.bind(this)}/>
          <QtrackerPermissionsPopUp success={success.bind(this)}/></div>)
        // Si no esta en el software smart3D se muestran menos campos
        } else if (inSmart3d===false) {
          await setOptions(<div className='back__item__container'><span style={{display:"flex"}} onClick={()=> setcurrentMenu(backMenu)}><img src={Vector} alt="vector" className='vector__image__reversed'></img><div style={{width:"260px"}}><p className='back__text'>REQUEST ITEM</p></div></span>
          <QtrackerRRPopUp success={success.bind(this)} margin={true}/>
          <QtrackerNRIDSPopUp success={success.bind(this)}/>
          <QtrackerISPopUp success={success.bind(this)}/></div>)
        }
      // Si seleccionas pulsas el boton issues aparecera un submenu que mostrara estos componentes
      }else if(currentMenu === "issues"){
        // Si el software es smart3D se muestran mas componentes
        if(inSmart3d===true){
          await setOptions(<div className='back__item__container'><span style={{display:"flex"}} onClick={()=> setcurrentMenu(backMenu) && setInSmart3d(false)}><img src={Vector} alt="vector" className='vector__image__reversed'></img><div style={{width:"260px"}}><p className='back__text'>ISSUES</p ></div></span>
          <QtrackerNWCPopUp success={success.bind(this)}/>
          <QtrackerNVNPopUp success={success.bind(this)}/>
          <QtrackerNRIPopUp success={success.bind(this)}/>
          <QtrackerModelingPopUp success={success.bind(this)}/>
          <QtrackerDrawingIsoPopUp success={success.bind(this)}/>
          <QtrackerDrawingOrtoPopUp success={success.bind(this)}/>
          <QtrackerRRPopUp success={success.bind(this)} margin={false}/>
          <QtrackerCitrixPopUp success={success.bind(this)}/></div>)
        // Si no esta en el software smart3D se muestran menos campos
        }else if(inSmart3d===false){
          await setOptions(<div className='back__item__container'><span style={{display:"flex"}} onClick={()=> setcurrentMenu(backMenu)}><img src={Vector} alt="vector" className='vector__image__reversed'></img><div style={{width:"260px"}}><p className='back__text'>ISSUES</p ></div></span>
          <QtrackerNWCPopUp success={success.bind(this)}/>
          <QtrackerNVNPopUp success={success.bind(this)}/>
          <QtrackerNRIPopUp success={success.bind(this)}/></div>)
        }
      // Boton que te lleva al submenu de Piping Spec Materials
      }else if(currentMenu === "piping"){
        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/isAdmin/" + secureStorage.getItem("user"), options)
          .then(response => response.json())
          .then(async json => {
          // Si es administrador se muestran todos esto campos en el submenu
          if(json.isAdmin){
            await setOptions(<div className='back__item__container__piping'><span style={{display:"flex"}} onClick={()=> setcurrentMenu(backMenu)}><img src={Vector} alt="vector" className='vector__image__reversed'></img><div style={{width:"300px"}}><p className='back__text'>PIPING SPEC MATERIALS</p ></div></span>
              <div className='mainmenu__item__container'>
                <span style={{display:"flex", width:"260px"}} onClick={()=> handleCADpmcClick()}><div style={{width:"260px", marginTop:"5px"}}><p className='mainmenu__item'>CADPMC</p ></div></span>
              </div>
              <div className='mainmenu__item__container' style={{marginTop:"10px"}}>
                <span style={{display:"flex", width:"260px"}} onClick={()=> handleSPClick()}><div style={{width:"260px"}}><p className='mainmenu__item'>SPTracker</p ></div></span>
              </div>
              <div className='mainmenu__item__container' style={{marginTop:"10px"}}>
                <span style={{display:"flex", width:"260px"}} onClick={()=> setcurrentMenu("instruments")}><div style={{width:"260px"}}><p className='mainmenu__item'>Instruments</p ></div><img src={Vector} alt="vector" className='vector__image'></img></span>
              </div>
              <div className='mainmenu__item__container' style={{marginTop:"10px"}}>
                <span style={{display:"flex", width:"260px"}} onClick={()=> handleSPExpansionJoinsClick()}><div style={{width:"260px"}}><p className='mainmenu__item'>Expansion Joins</p ></div></span>
              </div>
              <div className='mainmenu__item__container' style={{marginTop:"10px"}}>
                <span style={{display:"flex", width:"260px"}} onClick={()=> handleSPKeyParamClick()}><div style={{width:"260px"}}><p className='mainmenu__item'>Manage Catalogue</p ></div></span>
              </div>
            </div>)
          // Si no es admin se mostrara estos campos en el submenu
          } else {
            await setOptions(<div className='back__item__container__piping'><span style={{display:"flex"}} onClick={()=> setcurrentMenu(backMenu)}><img src={Vector} alt="vector" className='vector__image__reversed'></img><div style={{width:"300px"}}><p className='back__text'>PIPING SPEC MATERIALS</p ></div></span>
              <div className='mainmenu__item__container'>
                <span style={{display:"flex", width:"260px"}} onClick={()=> handleCADpmcClick()}><div style={{width:"260px", marginTop:"5px"}}><p className='mainmenu__item'>CADPMC</p ></div></span>
              </div>
              <div className='mainmenu__item__container' style={{marginTop:"10px"}}>
                <span style={{display:"flex", width:"260px"}} onClick={()=> handleSPClick()}><div style={{width:"260px"}}><p className='mainmenu__item'>SPTracker</p ></div></span>
              </div>
              <div className='mainmenu__item__container' style={{marginTop:"10px"}}>
                <span style={{display:"flex", width:"260px"}} onClick={()=> setcurrentMenu("instruments")}><div style={{width:"260px"}}><p className='mainmenu__item'>Instruments</p ></div><img src={Vector} alt="vector" className='vector__image'></img></span>
              </div>
              <div className='mainmenu__item__container' style={{marginTop:"10px"}}>
                <span style={{display:"flex", width:"260px"}} onClick={()=> handleSPExpansionJoinsClick()}><div style={{width:"260px"}}><p className='mainmenu__item'>Expansion Joins</p ></div></span>
              </div>
            </div>)
          }
        })
      // Si pulsa Instruments se mostrara ( General, PSV, Special )
      } else if(currentMenu === "instruments"){
        await setOptions(<div className='back__item__container__piping'><span style={{display:"flex"}} onClick={()=> setcurrentMenu(backMenu)}><img src={Vector} alt="vector" className='vector__image__reversed'></img><div style={{width:"300px"}}><p className='back__text'>PIPING INSTRUMENT</p ></div></span>
          <div className='mainmenu__item__container'>
            <span style={{display:"flex", width:"260px"}} onClick={()=> handleSPGeneralClick()}><div style={{width:"260px", marginTop:"5px"}}><p className='mainmenu__item'>General</p ></div></span>
          </div>
          <div className='mainmenu__item__container' style={{marginTop:"10px"}}>
            <span style={{display:"flex", width:"260px"}} onClick={()=> handleSPPSVClick()}><div style={{width:"260px"}}><p className='mainmenu__item'>PSV</p ></div></span>
          </div>
          <div className='mainmenu__item__container' style={{marginTop:"10px"}}>
            <span style={{display:"flex", width:"260px"}} onClick={()=> handleSPSpecialClick()}><div style={{width:"260px"}}><p className='mainmenu__item'>Special</p ></div></span>
          </div>
        </div>)
      // Si pulsa IT Plan se mostraran ( Tasks, Project Manager, Create Project(PopUp), Offer Manager, Create Offer(PopUp) )
      }else if(currentMenu === "itplan"){
        await setOptions(<div className='back__item__container'><span style={{display:"flex"}} onClick={()=> setcurrentMenu("main")}><img src={Vector} alt="vector" className='vector__image__reversed'></img><div style={{width:"260px"}}><p className='back__text'>MAIN MENU</p></div></span>

        <div className='mainmenu__item__container'>
          <span style={{display:"flex", width:"260px"}} onClick={()=> handleProjectsViewClick()}><div style={{width:"260px", marginTop:"5px"}}><p className='mainmenu__item'>Tasks</p></div></span>
        </div>
        <div className='mainmenu__item__container' style={{marginTop:"10px"}}>
          <span style={{display:"flex", width:"260px"}} onClick={()=> handleManageProjectsViewClick()}><div style={{width:"260px"}}><p className='mainmenu__item'>Project Manager</p></div></span>
        </div>
        <ProjectPopUp successProject={successProject.bind(this)}/>
        <div className='mainmenu__item__container' style={{marginTop:"10px"}}>
          <span style={{display:"flex", width:"260px"}} onClick={()=> handleManageOffersViewClick()}><div style={{width:"260px"}}><p className='mainmenu__item'>Offer Manager</p></div></span>
        </div>
        <OfferPopUp successProject={successProject.bind(this)}/></div>)
      }
      
    }, [currentMenu, inSmart3d])


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
