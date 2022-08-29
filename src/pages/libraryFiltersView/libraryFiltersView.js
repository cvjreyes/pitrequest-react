import NavBar from '../../components/navBar/navBar';
import React, { useState } from 'react';
import './libraryFiltersView.css'
import LibraryTreeGrid from '../../components/librartTreeGrid/libraryTreeGrid.js';

import AlertF from "../../components/alert/alert"
import { useNavigate } from 'react-router-dom';

import SaveIcon2 from "../../assets/images/SaveIcon2.svg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';


const LibraryFiltersView = () => {

    const [success, setSuccess] = useState(false)
	const [error, setError] = useState(false)

    const history = useNavigate();
	document.body.style.zoom = 0.8
    document.body.style.height = "87%"

    function goToLibrary(){
        history("/"+process.env.REACT_APP_PROJECT+"/library")
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
                <AlertF type="error" subtext="A problem occurred while saving the filters!" />
            </div>
			<div style={{zoom:1.125}}>
				<NavBar/>
			</div>
			<div>
				<div>
                    <LibraryTreeGrid goToLibrary={goToLibrary.bind(this)} error={()=> setError(true)} success={()=> setSuccess(true)}/>
                </div>
			</div>
		</div>
    )

}

export default LibraryFiltersView;