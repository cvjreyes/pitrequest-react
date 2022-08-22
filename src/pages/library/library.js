import NavBar from '../../components/navBar/navBar';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {useNavigate} from "react-router";
import './library.css'
import PITLogo from "../../assets/images/pitlogo.svg"

import FiltersLibrary from '../../components/filtersLibrary/filtersLibrary';
import ImagesLibrary from '../../components/imagesLibrary/imagesLibrary';


const Library = () =>{    

	const [filtersLibrary, setFiltersLibrary] = useState(<FiltersLibrary filterSearcher={filterSearcher.bind(this)}/>)
	const [imagesLibrary, setImagesLibrary] = useState(<ImagesLibrary array_filtrado_buscador={[]} />)
	const history = useNavigate();

	document.body.style.zoom = 0.8
    document.body.style.height = "90%"

	/* Es para volver al menu principal */
	function back(){
        history("/"+process.env.REACT_APP_PROJECT+"/pitrequests")
    }	

	function filterSearcher (array_filtrado_buscador) {
		setImagesLibrary(<ImagesLibrary array_filtrado_buscador={array_filtrado_buscador}/> )


	}

    return (
		<div>
			<div style={{zoom:1.125}}>
				<NavBar/>
			</div>
			<div className="container__left__library">
				<div>
					<img src={PITLogo} alt="PITLogo" className="isoTrackerLogo__image2" style={{height:"110px", marginLeft:60}}/>
				</div>
				{/* Componente filtros izquierda libreria */}
				{filtersLibrary}
			</div>
			<div className="container">
				{imagesLibrary}
			</div>
		</div>
    )

}

export default Library;