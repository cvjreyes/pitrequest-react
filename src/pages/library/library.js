import NavBar from '../../components/navBar/navBar';
import React, { useState } from 'react';
import './library.css'
import PITLogo from "../../assets/images/pitlogo.svg"

import FiltersLibrary from '../../components/filtersLibrary/filtersLibrary';
import ImagesLibrary from '../../components/imagesLibrary/imagesLibrary';


const Library = () =>{    

	const [filtersLibrary, setFiltersLibrary] = useState(<FiltersLibrary filtersAllLibrary={filtersAllLibrary.bind(this)}/>)
	const [imagesLibrary, setImagesLibrary] = useState(<ImagesLibrary array_filtrado={[]} />)

	document.body.style.zoom = 0.8
    document.body.style.height = "90%"

	function filtersAllLibrary (array_filtrado) {
		setImagesLibrary(<ImagesLibrary array_filtrado={array_filtrado} /> )
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