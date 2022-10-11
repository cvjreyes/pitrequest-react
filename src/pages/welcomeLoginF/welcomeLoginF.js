import React from "react";
import './welcomeLoginF.css'
import TechnipLogo from "../../assets/images/technip.png"
import IsoTrackerLogo from "../../assets/images/IsoTracker.svg"
import PITLogo from "../../assets/images/pitlogo.svg"
import { useState } from "react";
import Eye from "../../assets/images/eye.png"
import GreenCircle from "../../assets/images/green_circle.png"
import BlueCircle from "../../assets/images/blue_circle.png"
import {useNavigate} from "react-router";
import RequestAccessPopUp from "../../components/requestAccessPopUp/requestAccessPopUp";
import AlertF from "../../components/alert/alert"

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

//Página de welcome que actua como portada

const WelcomeLoginF = () =>{
    document.body.style.zoom = 0.9
    document.title= process.env.REACT_APP_APP_NAMEPROJ

    const [passwordShown, setPasswordShown] = useState(false);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false)
    const history = useNavigate();

    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

    const body = {
        email: email,
        password: password
    }

    const handleLogin = () => { //Metodo de login
        
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }
        //Post del login
        fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/login", options)
            .then(response => response.json())
            .then(json => {
                //Guardamos los datos del user en el local storage
                localStorage.setItem('token', json.token);
                secureStorage.setItem('user', json.user);
                secureStorage.setItem('roles', "None");
                history("/"+process.env.REACT_APP_PROJECT+"/pitrequests");
                window.location.reload(false);
            })
        
            .catch(error => {
                setError(true);
            })               
        
    }

    const downloadGuideES = () =>{
        const options = {
            method: "GET",
        }
        fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/downloadGuideES", options)
            .then(res => res.blob())
            .then(async response => {
                const file = new Blob([response], {
                    type: "video/mp4"
                });
                //Build a URL from the file
                const fileURL = URL.createObjectURL(file);
        
                    var fileLink = document.createElement('a');
                    fileLink.href = fileURL;
        
                    // it forces the name of the downloaded file
                    fileLink.download = "PITRequest_gui_ES.mp4";
        
                    // triggers the click event
                    fileLink.click();
            })
        
            .catch(error => {
                setError(true);
            })               
        
    }

    const downloadGuideEN = () =>{
        const options = {
            method: "GET",
        }
        fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/downloadGuideEN", options)
            .then(res => res.blob())
            .then(async response => {
                const file = new Blob([response], {
                    type: "video/mp4"
                });
                //Build a URL from the file
                const fileURL = URL.createObjectURL(file);
        
                    var fileLink = document.createElement('a');
                    fileLink.href = fileURL;
        
                    // it forces the name of the downloaded file
                    fileLink.download = "PITRequest_gui_EN.mp4";
        
                    // triggers the click event
                    fileLink.click();
            })
        
            .catch(error => {
                setError(true);
            })            
    }

    const submitRequest = async(email, project, otherproject) =>{ //Request de un usuario para entrar a la aplicacion
        let body ={
            email: email, 
            project:project,
            otherproject: otherproject
        }
        let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }
        //Post del request
        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/submitUserRequest", options)
        .then(response => response.json())
        .then(async json => {
            if(json.success){
                setSuccess(true)
            }
        })
    }
    
    let logo = null

    if(process.env.REACT_APP_PROGRESS === "0"){
        logo = IsoTrackerLogo
    }else{
        logo = PITLogo
    } 

    return(
        <body>
            <div style={{zIndex: 99999}}
            className={`alert alert-success ${success? 'alert-shown' : 'alert-hidden'}`}
            onTransitionEnd={() => setSuccess(false)}
            >
                <AlertF type="qtracker"/>
            </div>
        <div className="background">
            <img src={TechnipLogo} alt="technipLogo" className="technipLogo__image"/>
            <img src={GreenCircle} alt="greenCircle" className="greenCircle__image"/>
            <img src={BlueCircle} alt="blueCircle" className="blueCircle__image"/>
            
            <div className="login__form">
                <img src={logo} alt="isoTrackerLogo" className="isoTrackerLogo__image"/>
                <text className="welcome__text">Welcome</text>
                <text className="enter__text">Please, enter your e-mail account and password.</text>
                <text className="email__label">E-mail</text>
                <input type="text" className="email__input" onChange={(e) => setEmail(e.target.value)} onKeyPress={event => {
                        if (event.key === 'Enter') {
                        handleLogin()
                        }
                    }}></input>
                <text className="password__label">Password</text>
                <div>
                    <input className="password__input" type={passwordShown ? "text" : "password"} onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={event => {
                        if (event.key === 'Enter') {
                        handleLogin()
                        }
                    }}/>
                    <img onClick={togglePassword} src={Eye} alt="eye" className="eye__image"></img>
                </div>
                <div className="login__buttons">
                    <button className="login__button" onClick={handleLogin}>Log In</button>
                    {error && <p className="error__message" style={{color: "red", position:"absolute"}}>Email or password incorrect. Try again.</p>} 
                    <RequestAccessPopUp submitRequest={submitRequest.bind(this)}/>
                    <button className="guide__button" onClick={downloadGuideES}>Ver Tutorial (ES)</button>
                    <button className="guide__button" style={{marginLeft: "7px"}} onClick={downloadGuideEN}>Watch Tutorial (EN)</button>
            </div>
            </div>
            
        </div>
        </body>
    );
};

export default WelcomeLoginF;