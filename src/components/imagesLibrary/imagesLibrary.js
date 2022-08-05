import React, {useState, useEffect, Component} from 'react';
import './imagesLibrary.css'
import ReactPaginate from 'react-paginate';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

const ImagesLibrary = () => {

    // Toda la informacion de las imagenes
    const [imgSrc, setImgSrc] = useState("");
    const [currentPage, setCurrentPage] = useState(1)
    const [arrayData, setArrayData] = useState([])
    const [itemOffset, setItemOffset] = useState(0);
    const [allLibrary, setAllLibrary] = useState([])
    const [modalIsOpen, setIsOpen] = useState(false);
    
    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
    };

    // Recoger path de la imagenes
    useEffect(async()=>{
		const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getLibrary", options)
        .then(response => response.json())
        .then(async json => {
            let library_all = json.library
            let compt_library =[]
            let app_server = process.env.REACT_APP_SERVER
            let env_server = process.env.REACT_APP_NODE_PORT
            let dos_puntos = ":"
            let inicioSrc = "http://"
            let one_library_info = []
            let one_library_info2 = []
            

            for(let i = 0; i < library_all.length; i++){
                let srcName = library_all[i].image_path

                /*setAllLibrary( ...allLibrary, [{
                    id: library_all[i].id,
                    project_type: library_all[i].project_type,
                    component_type: library_all[i].component_type,
                    component_brand: library_all[i].component_brand,
                    component_discipline: library_all[i].component_discipline,
                    component_code: library_all[i].component_code,
                    component_name: library_all[i].component_name,
                    component_description: library_all[i].component_description,
                }])*/

                let one_library_id = library_all[i].id
                let one_library_project_type = library_all[i].project_type
                let one_library_component_type = library_all[i].component_type
                let one_library_component_brand = library_all[i].component_brand
                let one_library_component_discipline = library_all[i].component_discipline
                let one_library_component_code = library_all[i].component_code
                let one_library_component_name = library_all[i].component_name
                let one_library_component_description = library_all[i].component_description

                //one_library_info = ["id: " + {one_library_id} + ", project_type: " + {one_library_project_type} + ", component_type: " + {one_library_component_type} + ", component_brand: " + {one_library_component_brand} + " component_discipline: " + {one_library_component_discipline} + ", component_code: " + {one_library_component_code} + ", component_name: " + {one_library_component_name} + ", component_description: " + {one_library_component_description}]
				one_library_info2 = JSON.stringify({library_all})
                compt_library.push(
                    <div class="box-img">
                        <img key={i} onClick={openModal} src={inicioSrc + app_server + dos_puntos + env_server + srcName} width="100" height="200" alt=""/>
                        <h6>{library_all[i].component_name}</h6>
                        {/*<button  className="button__description">Descripcion</button>*/}
                    </div>
                )
			}
            await setAllLibrary(one_library_info2)
            await setImgSrc(compt_library)
            await setArrayData(compt_library)
        })   
	}, [])

    /* Configuracion de los modales */
    function openModal() {
        setIsOpen(true);
    }

    let subtitle;

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#f00';
    }
    
    function closeModal() {
        setIsOpen(false);
    }

    //Pagination
    const handlePageClick = async (data) => {
        console.log("click");
        console.log(data.selected);
        let currentP = data.selected + 1

        setImgSrc(arrayData)
    }

    console.log('====================================');
    console.log();
    console.log('====================================');

    return (
        <div class="galeria">
					
            <div class="title-img">
                <h2>Galeria</h2>
            </div>

            {imgSrc}
            
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <div>
                    <h3> Details </h3>
                    <p>
                        {allLibrary}
                    </p>
                    {/*<ul>{
                        allLibrary.map(pObj =>(
                            <li key={pObj.id}>Project Type: {pObj.project_type}</li>,
                            <li key={pObj.id+1}>Component Type: {pObj.component_type}</li>,
                            <li key={pObj.id}>Component Brand: {pObj.component_brand}</li>,
                            <li key={pObj.id}>Component Code: {pObj.component_code}</li>,
                            <li key={pObj.id}>Component Descripcion: {pObj.component_description}</li>,
                            <li key={pObj.id}>Component Disciplina: {pObj.component_discipline}</li>,
                            <li key={pObj.id}>Component Name: {pObj.component_name}</li>
                        ))
                    }</ul>*/}

                </div>
            </Modal>
            
            <div className='container__pagination'>
                <ReactPaginate
                    breakLabel="***"
                    nextLabel={'Next'}
                    previousLabel={'Previous'}
                    pageCount={25}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={2}
                    onPageChange={handlePageClick}
                    containerClassName={'pagination '}
                    pageClassName={'page-item'}
                    pageLinkClassName={'page-link'}
                    previousClassName={'page-item'}
                    previousLinkClassName={'page-link'}
                    nextClassName={'page-item'}
                    nextLinkClassName={'page-link'}
                    breakClassName={'page-item'}
                    breakLinkClassName={'page-link'}
                    activeClassName={'active'}
                />
            </div>

        </div>
    )
}

export default ImagesLibrary;