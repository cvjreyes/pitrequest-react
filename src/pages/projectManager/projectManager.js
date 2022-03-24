import NavBar from '../../components/navBar/navBar';
import React, { useState , useEffect} from 'react'

import IdleTimer from 'react-idle-timer'
import {useNavigate} from "react-router";

import { useCallback, useMemo, useRef } from 'react';
import { render } from 'react-dom';
import ProjectsTreeGrid from '../../components/projectsTreeGrid/projectsTreeGrid';
const ProjectManager = () =>{

    const [navBar, setNavBar] = useState(null);

    const history = useNavigate();

    const CryptoJS = require("crypto-js");
    const SecureStorage = require("secure-web-storage");
    var SECRET_KEY = 'sanud2ha8shd72h';

    const [updateData, setUpdateData] = useState(false)


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


    useEffect(async ()=>{
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getProjectsTreeData", options)
        .then(response => response.json())
        .then(async json => {
            let tree_nodes = []
            let node = {}
            let current_project, current_task
            for(let i = 0; i < json.rows.length; i++){
                node = {}
                if(json.rows[i].project === current_project){

                }else{
                    current_project = json.rows[i].project
                    node = {id: i, project_name: json.rows[i].project + " (" + json.rows[i].code + ")", task: null, subtask: null, admin:"Select admin", hours: null}
                    if(json.rows[i].task === current_task){

                    }else{
                        current_task = json.rows[i].task
                    }
                }
                if(node){
                    tree_nodes.push(node)
                }
                
            }

            //await setData(tree_nodes)
        })

    }, [])

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
            <div>
                <NavBar/>
                <ProjectsTreeGrid></ProjectsTreeGrid>
            </div>
        </div>
        
    );
};

export default ProjectManager;