import React, {useState, useEffect} from 'react';
import './imagesLibrary.css'
import ReactPaginate from 'react-paginate';
import Modal from 'react-modal';
import { getLibrary } from '../../ApiRequest';
import DeleteComponentConfirmPopUp from '../deleteComponentConfirmPopUp/deleteComponentConfirmPopUp';
import EditComponentPopUp from '../editComponentPopUp/editComponentPopUp';


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


const ImagesLibrary = (props) => {

    // Toda la informacion de las imagenes
    const [imgSrc, setImgSrc] = useState("");
    const [modalIsOpen, setIsOpen] = useState(false);
    const [oneLibrary, setOneLibrary] = useState({})

    // Array Grupo de proyectos
    const [componentUpdated, setComponentUpdated] = useState(false)
    
    //Botones para admin
    const [isAdmin, setIsAdmin] = useState(true)

    // Paginacion
    const [maxPages, setMaxPages] = useState()

    // Los usestate para poder printar el filtro de busqueda
    const [currentPage, setCurrentPage] = useState(0)

    //url imagen
    const urlImage = "http://" + process.env.REACT_APP_SERVER + ":" + process.env.REACT_APP_NODE_PORT + "/"

    const customStyles = {
        content: {
          top: '52%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          border: '1px solid black',
          width: '22%'
        },
    };

    /* Si es admin se muestran los botones */
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
                setIsAdmin(true)
            }
		})
        

	}, [oneLibrary, props])

    

    // Recoger path de todas las imagenes
    useEffect(async()=>{
        await getLibrary()
        .then(response => response.json())
        .then(async json => {
            let library_all = json.library
            let compt_library = []

            if(props.array_filtrado.length>0){
                /* Bucle donde se printa las imagenes con los filtros */
                setMaxPages(Math.ceil(props.array_filtrado.length/12))
                for(let i = currentPage*12; i < props.array_filtrado.length && i < currentPage*12 + 12; i++){
                    let srcName = props.array_filtrado[i].image_path
                    compt_library.push(
                        <div key={i} className="box-img">
                            <img onClick={() => openModal(props.array_filtrado[i])} src={urlImage + srcName} width="100" height="200" alt=""/>
                            <h6>{props.array_filtrado[i].component_name}</h6>
                        </div>
                    )
                }
            }
            await setImgSrc(compt_library)
        })   
	}, [props, currentPage, componentUpdated])

    /* Configuracion de los modales */
    function openModal(valueLibrary) 
    {
        setOneLibrary(valueLibrary)
        setIsOpen(true);
    }

    async function deleteComponent(id){
        const body ={
            id: id
          }
          const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }
          await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/deleteComponent", options)
              .then(response => response.json())
              .then(async json => {
                if(json.success){
                    setIsOpen(false);
                    props.deleteSuccess()
                }
              })
    }
    
    function closeModal() {
        setIsOpen(false);
    }

    //Pagination seleccionado
    const handlePageClick = async (data) => {
        await setCurrentPage(data.selected)
    }

    function updateSuccess() {
        props.updateSuccess()
        setComponentUpdated(!componentUpdated)
        closeModal()
    }

    function downloadRFA(name, filename){

        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/pdf"
            }
        }

        fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getComponentRFA/"+name, options)
        .then(res => res.blob())
        .then(response => {
          const file = new Blob([response], {
            type: "application/file"
          });
          //Build a URL from the file
          const fileURL = URL.createObjectURL(file);
            // create <a> tag dinamically
            var fileLink = document.createElement('a');
            fileLink.href = fileURL;
    
            // it forces the name of the downloaded file
            fileLink.download = filename + "." + oneLibrary.rfa_path.split('.').pop();
    
            // triggers the click event
            fileLink.click();
    
    
        })
        .catch(error => {
          console.log(error);
        });
    }

    return (
        // Parte derecha de la pagina
        <div className="galeria">
            <div className="title-img">
                <h2>CAD Library</h2>
            </div>

            {/* Container donde se muestran todos los elementos */}
            {imgSrc}            

            {/* Modal de cuando pulsas un elemento y ves toda su informacion */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                ariaHideApp={false}
                style={customStyles}
                contentLabel="Modal Library"
            >
                <div>
                    <div className="card" style={{width: "30rem"}}>
                        {/* Boton que te lleva a otro componente con un modal donde puedes editar el elemento */}
                        {isAdmin ? <EditComponentPopUp component={oneLibrary} id={oneLibrary.id} updateSuccess={updateSuccess.bind(this)}/> : null}
                        {/* Boton de que muestra un pop up para eliminar el elemento */}
                        {isAdmin ? <DeleteComponentConfirmPopUp component={oneLibrary.component_name} id={oneLibrary.id} deleteComponent={deleteComponent.bind(this)}/> : null}

                        <img src={urlImage + oneLibrary.image_path} height="440" width="100" className="card-img-top" alt="..."/>
                        <div className="card-body" style={{	borderBottom: "1px solid black"}}>
                            <h3 className="modal__titulo">Details</h3>
                            <p className="modal__description"><i>{oneLibrary.component_description}</i></p>
                        </div>
                        {/* Mostrando los datos del json */}
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item modal__li"><b>Name: </b>{oneLibrary.component_name}</li>
                            <li className="list-group-item modal__li"><b>Family: </b>{oneLibrary.component_type}</li>
                            <li className="list-group-item modal__li"><b>Brand: </b>{oneLibrary.component_brand}</li>
                            <li className="list-group-item modal__li"><b>Discipline: </b>{oneLibrary.component_discipline}</li>
                            <li className="list-group-item modal__li"><b>Code: </b>{oneLibrary.component_code}</li>
                        </ul>
                        <button className="download__rfa__btn" onClick={() => downloadRFA(oneLibrary.component_code, oneLibrary.component_name)}>Download</button>
                    </div>
                </div>
            </Modal>
            
            {/* Paginacion arriba al lado del titulo */}
            <div className='container__pagination'>
                <ReactPaginate
                    breakLabel="***"
                    nextLabel={'Next'}
                    previousLabel={'Previous'}
                    pageCount={maxPages}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={2}
                    onPageChange={handlePageClick}
                    containerClassName={'pagination'}
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