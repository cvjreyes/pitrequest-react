import NavBar from '../../components/navBar/navBar';
import {useNavigate} from "react-router";
import React, { useEffect, useState } from 'react';
import './library.css'
import PITLogo from "../../assets/images/pitlogo.svg"

import FiltersLibrary from '../../components/filtersLibrary/filtersLibrary';
import ImagesLibrary from '../../components/imagesLibrary/imagesLibrary';
import CreateComponentPopUp from '../../components/createComponentPopUp/createComponentPopUp';
import AlertF from "../../components/alert/alert"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

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

const Library = () =>{  //Ventana principal de la libreria de componentes

	const [updateGroups, setUpdateGroups] = useState(false)
	const [imagesLibrary, setImagesLibrary] = useState(<ImagesLibrary array_filtrado={[]} deleteSuccess={() => setDeleteSuccess(true)}/>)
	const [success, setSuccess] = useState(false)
	const [error, setError] = useState(false)
	const history = useNavigate();

	const [deleteSuccess, setDeleteSuccess] = useState(false)
	const [updateSuccess, setUpdateSuccess] = useState(false) 
	const [filtersLibrary, setFiltersLibrary] = useState(<FiltersLibrary filtersAllLibrary={filtersAllLibrary.bind(this)}/>)
	const [createElement, setCreateElement] = useState(null)
	const [libraryFiltersButton, setLibraryFiltersButton] = useState(null)

	document.body.style.zoom = 0.8
    document.body.style.height = "90%"

	function filtersAllLibrary (array_filtrado) { //Aplicar los filtros a la libreria
		setImagesLibrary(<ImagesLibrary array_filtrado={array_filtrado} deleteSuccess={() => setDeleteSuccess(true)} updateSuccess={() => setUpdateSuccess(true)}/> )
	}

	function libraryFiltersViewGo(){ //Ir a la ventana de edicion de filtros
        history("/"+process.env.REACT_APP_PROJECT+"/libraryFiltersView")
    }

	useEffect(async()=>{ //Cada vez que que hay un cambio
         if(success || deleteSuccess || updateSuccess){ 
			//Actualizamos la vista
			getLibrary()
			.then(response => response.json())
			.then(async json => {
				let library_all = json.library  
				setImagesLibrary(<ImagesLibrary array_filtrado={library_all} updateGroups={!updateGroups} deleteSuccess={() => setDeleteSuccess(true)} updateSuccess={() => setUpdateSuccess(true)}/>)	
				setUpdateGroups(!updateGroups)
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

		//Comprobamos si el usuario logeado es admin
		await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/isAdmin/" + secureStorage.getItem("user"), options)
          .then(response => response.json())
          .then(async json => {
            if(json.isAdmin){ //Si es admin damos la opcion de crear componentes y filtros
				setCreateElement(<CreateComponentPopUp success={() => setSuccess(true)} error={() => setError(true)}/>)
				setLibraryFiltersButton(<button className="library__button" onClick={()=>libraryFiltersViewGo()} style={{width:"205px", marginLeft:"80px", marginTop:"10px", marginBottom:"10px"}}><FontAwesomeIcon className='icon__book' icon={faPenToSquare} />Edit Filters</button>)
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
				{libraryFiltersButton}
				{createElement}
				{filtersLibrary}
			</div>
			<div className="container">
				{imagesLibrary}
			</div>
		</div>
    )

}

export default Library;