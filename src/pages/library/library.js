import NavBar from '../../components/navBar/navBar';
import React, { useEffect, useState } from 'react';
import './library.css'
import PITLogo from "../../assets/images/pitlogo.svg"

import FiltersLibrary from '../../components/filtersLibrary/filtersLibrary';
import ImagesLibrary from '../../components/imagesLibrary/imagesLibrary';
import CreateComponentPopUp from '../../components/createComponentPopUp/createComponentPopUp';
import AlertF from "../../components/alert/alert"

import { getLibrary } from '../../ApiRequest';

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

const Library = () =>{    

	const [imagesLibrary, setImagesLibrary] = useState(<ImagesLibrary array_filtrado={[]} deleteSuccess={() => setDeleteSuccess(true)}/>)
	const [success, setSuccess] = useState(false)
	const [error, setError] = useState(false)
	const [deleteSuccess, setDeleteSuccess] = useState(false)
	const [updateSuccess, setUpdateSuccess] = useState(false) 
	const [filtersLibrary, setFiltersLibrary] = useState(<FiltersLibrary filtersAllLibrary={filtersAllLibrary.bind(this)}/>)
	const [createElement, setCreateElement] = useState(null)

	document.body.style.zoom = 0.8
    document.body.style.height = "90%"

	function filtersAllLibrary (array_filtrado) {
		setImagesLibrary(<ImagesLibrary array_filtrado={array_filtrado} deleteSuccess={() => setDeleteSuccess(true)} updateSuccess={() => setUpdateSuccess(true)}/> )
	}

	useEffect(async()=>{
         if(success || deleteSuccess || updateSuccess){
			getLibrary()
			.then(response => response.json())
			.then(async json => {
				let library_all = json.library
				let compt_library =[library_all]  
				setImagesLibrary(<ImagesLibrary array_filtrado={library_all} deleteSuccess={() => setDeleteSuccess(true)} updateSuccess={() => setUpdateSuccess(true)}/>)	
			}) 
			
		 } 
	}, [success, deleteSuccess, updateSuccess])

	useEffect(async()=>{

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
				setCreateElement(<CreateComponentPopUp success={() => setSuccess(true)} error={() => setError(true)}/>)
			}
		})
   }, [])

    return (
		<div>
			<div style={{zIndex: "9999", marginTop:"-170px"}}
                className={`alert alert-success ${success ? 'alert-shown' : 'alert-hidden'}`}
                onTransitionEnd={() => setSuccess(false)}
                >
                <AlertF type="success" text="Changes saved successfully!" margin="-100px"/>
            </div>
			<div style={{zIndex: "9999", marginTop:"-170px"}}
                className={`alert alert-success ${updateSuccess ? 'alert-shown' : 'alert-hidden'}`}
                onTransitionEnd={() => setUpdateSuccess(false)}
                >
                <AlertF type="success" text="Component updated successfully!" margin="-100px"/>
            </div>
			<div style={{zIndex: "9999", marginTop:"-170px"}}
                className={`alert alert-success ${deleteSuccess ? 'alert-shown' : 'alert-hidden'}`}
                onTransitionEnd={() => setDeleteSuccess(false)}
                >
                <AlertF type="success" text="Component deleted successfully!" margin="20px"/>
            </div>
			<div style={{zIndex: "9999", marginTop:"-170px"}}
                className={`alert alert-success ${error ? 'alert-shown' : 'alert-hidden'}`}
                onTransitionEnd={() => setError(false)}
                >
                <AlertF type="error" subtext="A problem occurred while creating the component!" />
            </div>
			<div style={{zoom:1.125}}>
				<NavBar/>
			</div>
			<div className="container__left__library">
				<div>
					<img src={PITLogo} alt="PITLogo" className="isoTrackerLogo__image2" style={{height:"110px", marginLeft:60}}/>
				</div>
				{/* Componente filtros izquierda libreria */}
				<h3>Filtros</h3>
				{filtersLibrary}
			</div>
			<div className="container">
				{createElement}
				{imagesLibrary}
			</div>
		</div>
    )

}

export default Library;