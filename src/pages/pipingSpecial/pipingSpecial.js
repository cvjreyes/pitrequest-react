import "./pipingSpecial.css"
import React, { useState , useEffect} from 'react'
import NavBar from '../../components/navBar/navBar'
import CSPTrackerLogo from "../../assets/images/csptracker.svg"
import RoleDropDown from '../../components/roleDropDown/roleDropDown'

import IdleTimer from 'react-idle-timer'
import {useNavigate} from "react-router";

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

const PipingSpecial = () => {

    const history = useNavigate();

    document.body.style.zoom = 0.8
    document.body.style.height = "90%"

    function backMenuGo(){
        history("/"+process.env.REACT_APP_PROJECT+"/pitrequests")
    }

    return (
        <div>
			<div style={{zoom:1.125}}>
				<NavBar/>
			</div>
			<div className="container__left__library">
				<div>
					<img src={CSPTrackerLogo} alt="CSPTracker" className="isoTrackerLogo__image2" onClick={() => backMenuGo()} style={{height:"110px", marginLeft:60, cursor:"pointer"}}/>
				</div>

			</div>
			<div className="container">

			</div>
		</div>
    )
}

export default PipingSpecial;