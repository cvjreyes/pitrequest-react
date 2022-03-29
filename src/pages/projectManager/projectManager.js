import NavBar from '../../components/navBar/navBar';
import React, { useState, useEffect } from 'react';

import IdleTimer from 'react-idle-timer'
import {useNavigate} from "react-router";
import ProjectsTreeGrid from '../../components/projectsTreeGrid/projectsTreeGrid';

const ProjectManager = () =>{    

    const [navBar, setNavBar] = useState(null);

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

    function handleOnIdle(){
 
        secureStorage.clear()
        history("/" + process.env.REACT_APP_PROJECT)
    }

    return(
        <div>
          {updateData}
            <IdleTimer
                timeout={1000 * 60 * 15}
                onIdle={handleOnIdle}
                debounce={250}
            />
            <div >
                <NavBar/>
                <ProjectsTreeGrid back={back.bind(this)}/>
                

            </div>
        </div>
        
    );
};

export default ProjectManager;