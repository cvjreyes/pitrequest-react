import React, {useState, useEffect} from 'react';
import './imagesLibrary.css'
import ReactPaginate from 'react-paginate';
import Modal from 'react-modal';
import { getGroupProjects, getLibrary } from '../../ApiRequest';
import FiltersLibrary from '../filtersLibrary/filtersLibrary';

const ImagesLibrary = (state) => {

    // Toda la informacion de las imagenes
    const [imgSrc, setImgSrc] = useState("");
    const [modalIsOpen, setIsOpen] = useState(false);
    const [oneLibrary, setOneLibrary] = useState({})

    // Array Grupo de proyectos
    const [groupProject, setGroupProject] = useState([])
    const [oneGroupProject, setOneGroupProject] = useState({})
    
    // Paginacion
    const [arrayData, setArrayData] = useState([])

    // Los usestate para poder printar el filtro de busqueda
    const [filteredLibraryEmpty, setFilteredLibraryEmpty] = useState(true)
    const [filteredLibrary, setFilteredLibrary] = useState([])
    let array_buscador = <FiltersLibrary arrayBuscador = {filteredLibrary && filteredLibraryEmpty} />
    
    
    //url imagen
    const urlImage = "http://" + process.env.REACT_APP_SERVER + ":" + process.env.REACT_APP_NODE_PORT + "/"
    
    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          border: '1px solid black',
          width: '22%'
        },
    };

    /* Grupos de projectos */
	useEffect(async()=>{

        getGroupProjects()
        .then(response => response.json())
        .then(async json => {
			let group = json.group_projects
			let compt_group_project = []
            for(let i = 0; i < group.length; i++){
                let label = group[i].grupo_projectos

                compt_group_project.push(label)
			}
			await setGroupProject(compt_group_project)
           
        })   
	}, [])

    // Recoger path de todas las imagenes
    useEffect(async()=>{
        
        getLibrary()
        .then(response => response.json())
        .then(async json => {
            let library_all = json.library
            let compt_library =[]

            // console.log('====================================');
            // console.log("Filtered Array");
            // console.log(filteredLibrary);
            // console.log('====================================');

            // console.log('====================================');
            // console.log("Filtered booleana");
            // console.log(filteredLibraryEmpty);
            // console.log('====================================');

            /* Bucle donde se printa las imagenes */
            for(let i = 0; i < library_all.length; i++){
                let srcName = library_all[i].image_path
                compt_library.push(
                    <div key={i} className="box-img">
                        <img onClick={() => openModal(library_all[i])} src={urlImage + srcName} width="100" height="200" alt=""/>
                        <h6>{library_all[i].component_name}</h6>
                        {/*<h6><b>Tipos de proyecto:</b><br/>{groupProject[i]}</h6>*/}
                    </div>
                )
			}
            await setImgSrc(compt_library)
        })   
	}, [groupProject])

    /* Configuracion de los modales */
    function openModal(valueLibrary) {
        setOneLibrary(valueLibrary)
        setOneGroupProject(groupProject[valueLibrary.id-1])
        setIsOpen(true);
        
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

    return (
        <div className="galeria">
            <div className="title-img">
                <h2>Galeria</h2>
            </div>
            
            {imgSrc}            

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                ariaHideApp={false}
                style={customStyles}
                contentLabel="Modal Library"
            >
                <div>
                    <div className="card" style={{width: "30rem"}}>
                    <img src={urlImage + oneLibrary.image_path} height="400" width="100" className="card-img-top" alt="..."/>
                        <div className="card-body" style={{	borderBottom: "1px solid black"}}>
                            <h3 className="modal__titulo">Details</h3>
                            <p className="modal__description"><i>{oneLibrary.component_description}</i></p>
                        </div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item modal__li"><b>Nombre: </b>{oneLibrary.component_name}</li>
                            <li className="list-group-item modal__li"><b>Familia: </b>{oneLibrary.component_type}</li>
                            <li className="list-group-item modal__li"><b>Marca: </b>{oneLibrary.component_brand}</li>
                            <li className="list-group-item modal__li"><b>Tipo de proyecto: </b>{oneGroupProject}</li>
                            <li className="list-group-item modal__li"><b>Disciplina: </b>{oneLibrary.component_discipline}</li>
                            <li className="list-group-item modal__li"><b>Codigo: </b>{oneLibrary.component_code}</li>
                        </ul>
                    </div>
                </div>
            </Modal>
            
            <div className='container__pagination'>
                <ReactPaginate
                    breakLabel="***"
                    nextLabel={'Next'}
                    previousLabel={'Previous'}
                    pageCount={25}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={1}
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