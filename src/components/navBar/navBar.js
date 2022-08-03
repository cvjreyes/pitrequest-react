//Cabecera de IsoTracker con diferentes desplegables y botones

import React, { useEffect ,useRef, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import './navBar.css';
import {useNavigate} from "react-router";

import BackIcon from "../../assets/images/back.svg"

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


const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    label: {
      },
      label2: {
      },
  }));


const NavBar = (props) =>{
    const classes = useStyles();
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const history = useNavigate();
    const [username, setUsername] = React.useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const ref = useRef()
    const [hoverbutton, setHoverbutton] = React.useState(null);
    const [marginMenu, setMarginMenu] = React.useState();

    const handleClickUser = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUser = () => {
        setAnchorElUser(null);
    };

    const handleLogOut = () => {
        localStorage.clear();
        history("/"+process.env.REACT_APP_PROJECT+"/");
    };

    const handleChangePassword = () =>{
        setAnchorElUser(null);
        history("/"+process.env.REACT_APP_PROJECT+"/changepassword");
    }

    function back(){
        history("/"+process.env.REACT_APP_PROJECT+"/pitrequests")
    }


    useEffect(() => {
        const checkIfClickedOutside = e => {
          // If the menu is open and the clicked target is not within the menu,
          // then close the menu
          if (isMenuOpen && ref.current && !ref.current.contains(e.target)) {
              
            setIsMenuOpen(false)
          }
        }

        if(window.location.href.includes("/projectManager") || window.location.href.includes("/offersManager") || window.location.href.includes("/library")){
            setHoverbutton (<button className="projects__button__back" onClick={()=>back()} style={{width:"175px", marginLeft:"115px", marginRight:"-300px"}}><img src={BackIcon} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="projects__button__text">Back to menu</p></button>)
        } else {
            setHoverbutton (null)
        }

        if(window.location.href.includes("/projectManager") || window.location.href.includes("/offersManager") || window.location.href.includes("/pitrequestsview") || window.location.href.includes("/library")) {
            setMarginMenu('translateX(+280%)')
        } else {
            setMarginMenu('translateX(+120%)')
        }

        const bodyUsername = {
            email: secureStorage.getItem("user")
          }
        const optionsUsername = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyUsername)
        }
        fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/api/findByEmail", optionsUsername)
        .then(response => response.json())
        .then(json => {
            setUsername(json.name);
        })

    
        document.addEventListener("mousedown", checkIfClickedOutside)
    
        return () => {
          // Cleanup the event listener
          document.removeEventListener("mousedown", checkIfClickedOutside)
        }
      }, [isMenuOpen])
    
      let margin = 1950 - (username.length*6)
      margin = margin + "px"
    
    return(
        <div ref={ref}>
        <div className={classes.root}>
            <div>
            <AppBar position="fixed" className="navBar__container" style={{height:"62px", borderBottomColor: "rgb(211, 224, 233)", borderLeftColor: "rgb(211, 224, 233)", bordeRightColor: "rgb(211, 224, 233)", borderTopColor: "rgb(211, 224, 233)", backgroundColor: "#383838"}}>
            
                <Toolbar>
                    
                    {
                        hoverbutton
                    }
                    
                    <button className="btn__dropdown" style={{marginLeft:margin, marginTop:"10px"}} onClick={handleClickUser}>
                    <i className="dropdown__text">{username}&nbsp;🠗</i>
                    </button>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorElUser}
                        getContentAnchorEl={null}
                        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                        transformOrigin={{ vertical: "top", horizontal: "center" }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUser}
                        PaperProps={{
                            style: {
                                left: '50%',
                                transform: marginMenu,
                            }
                        }}
                    >
                    <MenuItem style={{ fontSize:"13.33px"}} onClick={handleChangePassword}>Change password</MenuItem>
                    <MenuItem style={{ fontSize:"13.33px"}} onClick={handleLogOut}><b>Logout</b></MenuItem>
                    </Menu>
                </Toolbar>

            </AppBar>
            </div>
        </div>
        </div>
    );
};

export default NavBar;