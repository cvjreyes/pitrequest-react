import NavBar from '../../components/navBar/navBar';
import React, { useState, useEffect } from 'react';

import IdleTimer from 'react-idle-timer'
import {useNavigate} from "react-router";
import ProjectsTreeGrid from '../../components/projectsTreeGrid/projectsTreeGrid';
import AlertF from "../../components/alert/alert"

const ProjectManager = () =>{    

    const [navBar, setNavBar] = useState(null);
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)

    const history = useNavigate();

    const CryptoJS = require("crypto-js");
    const SecureStorage = require("secure-web-storage");
    var SECRET_KEY = 'sanud2ha8shd72h';

    const [updateData, setUpdateData] = useState(false)
  
    function back(){
        history("/"+process.env.REACT_APP_PROJECT+"/pitrequests")
    }

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

    document.title= process.env.REACT_APP_APP_NAMEPROJ
    document.body.style.zoom = 0.8
    document.body.style.height = "88%"

    function handleOnIdle(){
 
        secureStorage.clear()
        history("/" + process.env.REACT_APP_PROJECT)
    }

    async function successAlert(){
        setSuccess(true)
    }

    async function errorAlert(){
        setError(true)
    }

    function goToTasks(){
        history("/"+process.env.REACT_APP_PROJECT+"/projectsView")
    }

    return(
        <div>
          {updateData}
            <div
                className={`alert alert-success ${success ? 'alert-shown' : 'alert-hidden'}`}
                onTransitionEnd={() => setSuccess(false)}
                >
                <AlertF type="success" text="Changes saved successfully!" cn="alert__success__mt" margin="-100px"/>
            </div>
            <div
                className={`alert alert-success ${error ? 'alert-shown' : 'alert-hidden'}`}
                onTransitionEnd={() => setError(false)}
                >
                <AlertF type="error" subtext="A problem occurred while saving changes!" cn="alert__error__mt"/>
            </div>
            <IdleTimer
                timeout={1000 * 60 * 15}
                onIdle={handleOnIdle}
                debounce={250}
            />
            <div >
                <div style={{zoom:1.125}}>
                    <NavBar/>
                </div>
                <ProjectsTreeGrid back={back.bind(this)} success={successAlert.bind(this)} error={errorAlert.bind(this)} goToTasks={goToTasks.bind(this)}/>
                

            </div>
        </div>
        
    );
};

export default ProjectManager;