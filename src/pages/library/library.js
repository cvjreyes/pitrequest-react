import NavBar from '../../components/navBar/navBar';
import React, { useState } from 'react';
import './library.css'
import PITLogo from "../../assets/images/pitlogo.svg"

import FiltersLibrary from '../../components/filtersLibrary/filtersLibrary';
import ImagesLibrary from '../../components/imagesLibrary/imagesLibrary';
import CreateComponentPopUp from '../../components/createComponentPopUp/createComponentPopUp';
import AlertF from "../../components/alert/alert"


const Library = () =>{    

	const [filtersLibrary, setFiltersLibrary] = useState(<FiltersLibrary filtersAllLibrary={filtersAllLibrary.bind(this)}/>)
	const [imagesLibrary, setImagesLibrary] = useState(<ImagesLibrary array_filtrado={[]} />)
	const [success, setSuccess] = useState(false)
	const [error, setError] = useState(false)

	document.body.style.zoom = 0.8
    document.body.style.height = "90%"

	function filtersAllLibrary (array_filtrado) {
		setImagesLibrary(<ImagesLibrary array_filtrado={array_filtrado} /> )
	}

	function filterCheckbox (array_filtrado_checkbox) {
		setImagesLibrary(<ImagesLibrary array_filtrado_checkbox={array_filtrado_checkbox}/>)
	}

    return (
		<div>
			<div style={{zIndex: "9999", marginTop:"-150px"}}
                className={`alert alert-success ${success ? 'alert-shown' : 'alert-hidden'}`}
                onTransitionEnd={() => setSuccess(false)}
                >
                <AlertF type="success" text="Changes saved successfully!" margin="-100px"/>
            </div>
			<div style={{zIndex: "9999", marginTop:"-150px"}}
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
				<CreateComponentPopUp success={() => setSuccess(true)} error={() => setError(true)}/>
				{imagesLibrary}
			</div>
		</div>
    )

}

export default Library;