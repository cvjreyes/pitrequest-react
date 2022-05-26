import React, { useState} from 'react'
import './changePassword.css';
import TechnipLogo from "../../assets/images/technip.png"
import IsoTrackerLogo from "../../assets/images/IsoTracker.svg"
import FullTrackerLogo from "../../assets/images/pitlogo.svg"
import Eye from "../../assets/images/eye.png"
import GreenCircle from "../../assets/images/green_circle.png"
import BlueCircle from "../../assets/images/blue_circle.png"
import {useNavigate} from "react-router";
import AlertF from "../../components/alert/alert"


//Página de home con el menú para ir a las aplicaciones de isotracker

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

const ChangePasswordPage = () =>{
    document.title= process.env.REACT_APP_APP_NAMEPROJ
    document.body.style.zoom = 0.8

    const [password, setPassword] = useState(null);
    const [newPassword, setNewPassword] = useState(null);
    const [confPassword, setConfPassword] = useState(null);
    
    const [passwordShown1, setPasswordShown1] = useState(false);
    const [passwordShown2, setPasswordShown2] = useState(false); 
    const [passwordShown3, setPasswordShown3] = useState(false);

    const [blankError, setBlankError] = useState(false);
    const [wrongPassError, setWrongPassError] = useState(false);
    const [notCoincideError, setNotCoincideError] = useState(false);
    const [successful, setSuccessful] = useState(false);
    const history = useNavigate();

    const handelChangePassword = async() =>{
        setWrongPassError(false)
        setBlankError(false)
        setConfPassword(false)
        const body = {
            email: secureStorage.getItem('user'),
            password: password
        }
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }
        if(password === null || newPassword === null || confPassword === null || password === "" || newPassword === "" || confPassword === ""){
            setBlankError(true)
        }else{
            await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/api/user/getPassword", options)
            .then(response => response.json())
            .then(async json =>{
                if(json.password === "incorrect"){
                    setWrongPassError(true)
                }else{
                    if(newPassword === confPassword){
                        const body = {
                            email: secureStorage.getItem('user'),
                            newPassword: newPassword
                        }
                        const options = {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(body)
                        }
                        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/user/changePassword", options)
                        .then(async response => {
                            await setSuccessful(true)
                            await localStorage.clear();
                            setTimeout(()=> {history("/"+process.env.REACT_APP_PROJECT+"/")}, 2000)
                        })
                        .catch(err=> console.log(err))
                    }else{
                        setNotCoincideError(true)
                    }
                }
            })
        }

    }

    const togglePassword1 = () => {
        setPasswordShown1(!passwordShown1);
    };

    const togglePassword2 = () => {
        setPasswordShown2(!passwordShown2);
    };

    const togglePassword3 = () => {
        setPasswordShown3(!passwordShown3);
    };

    const cancel = async() =>{
        history("/"+process.env.REACT_APP_PROJECT+"/pitrequests")
    }


    let logo = null

    if(process.env.REACT_APP_PROGRESS === "0"){
        logo = IsoTrackerLogo
    }else{
        logo = FullTrackerLogo
    }

    return(
        <body>
            <div
            className={`alert alert-success ${blankError ? 'alert-shown' : 'alert-hidden'}`}
            onTransitionEnd={() => setBlankError(false)}
            >
                <AlertF type="error" subtext="At least one field is blank!" change={true}/>
            </div>
            <div
            className={`alert alert-success ${wrongPassError ? 'alert-shown' : 'alert-hidden'}`}
            onTransitionEnd={() => setWrongPassError(false)}
            >
                <AlertF type="error" subtext="The current password is not correct!" change={true}/>
            </div>
            <div
            className={`alert alert-success ${notCoincideError ? 'alert-shown' : 'alert-hidden'}`}
            onTransitionEnd={() => setNotCoincideError(false)}
            >
                <AlertF type="error" subtext="The passwords don't match!" change={true}/>
            </div>
            <div
            className={`alert alert-success ${successful ? 'alert-shown' : 'alert-hidden'}`}
            onTransitionEnd={() => setSuccessful(false)}
            >
                <AlertF type="success" change={true} text="Password changed successfully!"/>
            </div>

            
            
        <div className="background">
            <img src={TechnipLogo} alt="technipLogo" className="technipLogo__image"/>
            <img src={GreenCircle} alt="greenCircle" className="greenCircle__image"/>
            <img src={BlueCircle} alt="blueCircle" className="blueCircle__image"/>
            
            <div className="login__form">
                <img src={logo} alt="isoTrackerLogo" className="isoTrackerLogo__image"/>
                <text className="welcome__text" style={{width:"250px"}}>Change password</text>
                <text className="enter__text" style={{marginLeft:"-20px"}}>Please, enter your current password, current password confirmation and new password.</text>
                <text className="email__label" style={{width:"120px"}}>Current password</text>
                <div>
                    <input className="current__password__input" type={passwordShown1 ? "text" : "password"} onChange={(e) => setPassword(e.target.value)}/>
                    <img onClick={togglePassword1} src={Eye} alt="eye" className="current__password__eye__image"></img>
                </div>
                <text className="password__label" style={{width:"220px"}}>New password</text>
                <div>
                    <input className="conf__password__input" type={passwordShown2 ? "text" : "password"} onChange={(e) => setConfPassword(e.target.value)}/>
                    <img onClick={togglePassword2} src={Eye} alt="eye" className="conf__password__eye__image"></img>
                </div>
                <text className="new__password__label" style={{width:"160px"}}>Confirm new password</text>
                <div>
                    <input className="new__password__input" type={passwordShown3 ? "text" : "password"} onChange={(e) => setNewPassword(e.target.value)}/>
                    <img onClick={togglePassword3} src={Eye} alt="eye" className="new__password__eye__image"></img>
                </div>
                <div className="login__buttons" style={{top:"420px"}}>
                    <button className="login__button" onClick={handelChangePassword}>Save</button>
                    <button className="cancel__button" onClick={cancel}>Cancel</button>
            </div>
            </div>
            
        </div>
        </body>
    );
};

export default ChangePasswordPage;