import React, { useState, useEffect } from 'react';
import './filtersLibrary.css';
import Checkbox from '@mui/material/Checkbox';
import { getComponentDisciplines, getComponentsBrands, getComponentsTypes, getProjectTypes, getLibrary } from '../../ApiRequest';
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import ImagesLibrary from '../imagesLibrary/imagesLibrary';

const FiltersLibrary = (props, setState) =>{

    /* Rellenar arrays filtros */
	const [families, setFamilies] = useState([])
	const [marcas, setMarcas] = useState([])
	const [tipoP, setTipoP] = useState([])
	const [disciplina, setDisciplina] = useState([])

    /* Todos los filtros en un array */
    const [filterKeys, setFilterKeys] = useState([])

    /* Datos almacenados donde recoger datos para los filtros */
    const [allLibrary, setAllLibrary] = useState([])
    const [newLibrary, setNewLibrary] = useState([])
    const [handleCheck, setHandleCheck] = useState({});
    const [sinResultadosBuscador, setSinResultadosBuscador] = useState(true)

    /* Configuracion busqueda */
    const [busqueda, setBusqueda] = useState("")
    const [newSearchLibrary, setNewSearchLibrary] = useState([])

	/* Familias */
	useEffect(async()=>{

        getComponentsTypes()
        .then(response => response.json())
        .then(async json => {
			let types = json.component_types
			let compt_types = []
            for(let i = 0; i < types.length; i++){
                let label = types[i].type

                // Si el filtro ya esta en el array no lo vuelve a incluir
                if(!filterKeys.includes(label)){
                    filterKeys.push(label)
                }

				compt_types.push(
                    <div key={i} className='container__checkbox'>
                        <Checkbox onClick={() => handleChange([label])}/> <p className="text__checkbox__library">{label}</p>
                    </div>
                )
			}
			await setFamilies(compt_types)
        })   
	}, [])

    /* Marcas */
	useEffect(async()=>{

        getComponentsBrands()
        .then(response => response.json())
        .then(async json => {
			let brands = json.component_brands
			let compt_brand = []
            for(let i = 0; i < brands.length; i++){
                let label = brands[i].brand
                
                // Si el filtro ya esta en el array no lo vuelve a incluir
                if(!filterKeys.includes(label)){
                    filterKeys.push(label)
                }
                
				compt_brand.push(
                    <div key={i} className='container__checkbox'>
                        <Checkbox onClick={() => handleChange([label])}/> <p className="text__checkbox__library">{label}</p>
                    </div>
                )
			}
			await setMarcas(compt_brand)
        })   
	}, [])

    /* Tipos de proyecto */
	useEffect(async()=>{

        getProjectTypes()
        .then(response => response.json())
        .then(async json => {
			let project_types = json.project_types
			let compt_project = []

            for(let i = 0; i < project_types.length; i++){
                let label = project_types[i].project_type

                // Si el filtro ya esta en el array no lo vuelve a incluir                
                if(!filterKeys.includes(label)){
                    filterKeys.push(label)
                }

				compt_project.push(
                    <div key={i} className='container__checkbox'>
                        <Checkbox onClick={() => handleChange([label])}/> <p className="text__checkbox__library">{label}</p>
                    </div>
                )
			}
			await setTipoP(compt_project)
        })   
	}, [])

    /* Disciplinas */
	useEffect(async()=>{

        getComponentDisciplines()
        .then(response => response.json())
        .then(async json => {
			let disciplinas = json.component_disciplines
			let compt_disc = []
            
            for(let i = 0; i < disciplinas.length; i++){
                let label = disciplinas[i].discipline + " (" + disciplinas[i].code + ")"
                let label2 = disciplinas[i].discipline

                // Si el filtro ya esta en el array no lo vuelve a incluir
                if(!filterKeys.includes(label2)){
                    filterKeys.push(label2)
                }

				compt_disc.push(
                    <div key={i} className='container__checkbox'>
                        <Checkbox onClick={() => handleChange([label])} /> <p className="text__checkbox__library">{label}</p>
                    </div>
                )
			}
			await setDisciplina(compt_disc)
        })   
	}, [])
 
    /* Todos los datos de las imagenes */
    // Recoger path de la imagenes
    useEffect(async()=>{
        
        getLibrary()
        .then(response => response.json())
        .then(async json => {
            let library_all = json.library
            let compt_library =[library_all]                     
            
            await setAllLibrary(compt_library)
        })   
	}, [])

    /* Funcion para los filtros */
    const handleChange =  (e) => {
        console.log('====================================');
        console.log("Handle Check antes");
        console.log(handleCheck);
        console.log('====================================');
        setHandleCheck({...handleCheck, [e.target.id]: e.target.checked})
        console.log('====================================');
        console.log("Handle Check despues");
        console.log(handleCheck);
        console.log('====================================');

    }

   useEffect(() => {
        function filterbyName (value) {

            // console.log('====================================');
            // console.log("AllLibrary");
            // console.log(allLibrary);
            // console.log('====================================');

            if(handleCheck !== undefined) {
                
                // console.log('====================================');
                // console.log("filtersKeys");
                // console.log(filterKeys);
                // console.log('====================================');

                return filterKeys.every(function(key) {
                    return !handleCheck[key] || value[key];
                });
            } else {
                return value
            }
        }
    
        setNewLibrary(
            allLibrary.filter(filterbyName)
        )
   }, [handleCheck, allLibrary])

    /* Metodos para filtro busqueda */
    const handleChangeSearch=e=>{
        setBusqueda(e.target.value);
        filtrar(e.target.value)
        console.log("Busqueda: " + e.target.value);
    }

    const filtrar=(terminoBusqueda)=>{
        let array_filtro = []
        
        allLibrary.filter((elemento)=>{

            // console.log('====================================');
            // console.log("Booleana en total");
            // console.log(elemento);
            // console.log('====================================');

            for (let index = 0; index < elemento.length; index++) {
                if(elemento[index].component_brand.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
                || elemento[index].component_discipline.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
                || elemento[index].component_type.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
                || elemento[index].component_code.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
                || elemento[index].project_type.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
                || elemento[index].component_name.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
                ){
                    // console.log('====================================');
                    // console.log("Marcas en total");
                    // console.log(elemento[index]);
                    // console.log('====================================');
                    array_filtro.push(elemento[index]);
                }
                
            }
            return array_filtro;
        });

        // console.log('====================================');
        // console.log("Resultados de la Busqueda");
        // console.log(array_filtro);
        // console.log('====================================');
        setNewSearchLibrary(array_filtro);
        // console.log('====================================');
        // console.log("newSearchLibrary");
        // console.log(newSearchLibrary);
        // console.log('====================================');
    }

    function arrayBuscador(arrayFiltrado, sinResultados) {

        if(newSearchLibrary!=null){
            console.log("entra if");
            arrayFiltrado = newSearchLibrary;
            sinResultados = false
        } else {
            console.log("entra else");
            sinResultados = true
        }

        // console.log('====================================');
        // console.log("Boton new Search Library");
        // console.log(arrayFiltrado);
        // console.log('====================================');
        // console.log('====================================');
        // console.log("Boton sin resultados buscador");
        // console.log(sinResultados);
        // console.log('====================================');

        return arrayFiltrado, sinResultados;
    }

    return(
        <div>
            <div className='container__filters__left'>

                {/* Filtros Buscador */}
                <div className='container__search'>
                    <input 
                    className='form-control input__search'
                    value={busqueda}
                    placeholder="Search"
                    onChange={handleChangeSearch}
                    />
                    <button className="btn btn-success" onClick={() => arrayBuscador(newSearchLibrary, sinResultadosBuscador)}>
                        <FontAwesomeIcon icon={faSearch}/>
                    </button>
                </div>

                {/* Filtros Familias */}
                <div>
                    <div className='parent__checkbox'>
                        <h4>Familias</h4>
                    </div>
                </div>
                <div className='sub__checkbox'>
                    {families}
                </div>

                {/* Filtros Marcas */}
                <div>
                    <div className='parent__checkbox'>
                        <h4>Marca</h4>
                    </div>
                </div>
                <div className='sub__checkbox'>
                    {marcas}
                </div>

                {/* Filtros Tipos de proyecto */}
                <div>
                    <div className='parent__checkbox'>
                        <h4>Tipo de proyecto</h4>
                    </div>
                </div>
                <div className='sub__checkbox'>
                    {tipoP}
                </div>

                {/* Filtros Disciplinas */}
                <div>
                    <div className='parent__checkbox'>
                        <h4>Disciplina</h4>
                    </div>
                </div>
                <div className='sub__checkbox'>
                    {disciplina}
                </div>

			</div>
        </div>
    );
};

export default FiltersLibrary;