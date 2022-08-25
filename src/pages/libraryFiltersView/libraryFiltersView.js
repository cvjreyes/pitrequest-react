import NavBar from '../../components/navBar/navBar';
import React, { useState } from 'react';
import './libraryFiltersView.css'

import AlertF from "../../components/alert/alert"

const LibraryFiltersView = () => {

    const [success, setSuccess] = useState(false)
	const [error, setError] = useState(false)

	document.body.style.zoom = 0.8
    // document.body.style.height = "90%"

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
				
			</div>
		</div>
    )

}

export default LibraryFiltersView;