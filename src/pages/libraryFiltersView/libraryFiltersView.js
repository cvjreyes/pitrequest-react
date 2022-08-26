import NavBar from '../../components/navBar/navBar';
import React, { useState } from 'react';
import './libraryFiltersView.css'

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
                <AlertF type="error" subtext="A problem occurred while creating the component!" />
            </div>
			<div style={{zoom:1.125}}>
				<NavBar/>
			</div>
			<div>
                <div style={{marginTop: "140px"}}>
                    <button className="projects__button__save" onClick={()=>this.saveChanges()} style={{width:"175px", marginLeft:"-1570px"}}><img src={SaveIcon2} alt="hold" className="navBar__icon__save" style={{marginRight:"-20px"}}></img><p className="projects__button__text">Save</p></button>
                    <button className="library__button" onClick={()=>goToLibrary()} style={{width:"175px", marginLeft:"20px"}}><FontAwesomeIcon className='icon__book' icon={faBook} />Library</button>
                </div>
				
			</div>
		</div>
    )

}

export default LibraryFiltersView;