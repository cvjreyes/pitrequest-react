import React, { useState, useEffect, ChangeEvent } from 'react';
import './filtersLibrary.css';
import { getComponentDisciplines, getComponentsBrands, getComponentsTypes, getProjectTypes, getLibrary, getGroupProjects } from '../../ApiRequest';
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FormControlLabel, FormGroup, Checkbox, Box } from '@mui/material';
import { CoPresentOutlined } from '@mui/icons-material';

const FiltersLibrary = (props) =>{

    /* Rellenar arrays filtros */
	const [families, setFamilies] = useState([])
	const [marcas, setMarcas] = useState([])
	const [tipoP, setTipoP] = useState([])
	const [disciplina, setDisciplina] = useState([])

    /* Todos los filtros en un array */
    const [filterKeys, setFilterKeys] = useState([])

    /* Datos almacenados donde recoger datos para los filtros */
    const [allLibrary, setAllLibrary] = useState([])
    const [groupProject, setGroupProject] = useState([])
    const [oneGroupProject, setOneGroupProject] = useState({})
    
    /* Configuracion busqueda */
    const [busqueda, setBusqueda] = useState("")
    const [newSearchLibrary, setNewSearchLibrary] = useState([])

    /* Configuracion checkbox */
    const [newCheckboxLibraryDisciplinas, setNewCheckboxLibraryDisciplinas] = useState([])
    const [newCheckboxLibraryMarcas, setNewCheckboxLibraryMarcas] = useState([])
    const [newCheckboxLibraryFamilias, setNewCheckboxLibraryFamilias] = useState([])
    const [newCheckboxLibraryTipoP, setNewCheckboxLibraryTipoP] = useState([])
    const [allCheckbox, setAllCheckbox] = useState([])
    const [allFilter, setAllFilter] = useState([])
    
    /* Todos los datos de las imagenes */
    // Recoger path de la imagenes
    useEffect(async()=>{
        
        getLibrary()
        .then(response => response.json())
        .then(async json => {
            let library_all = json.library
            let compt_library =[library_all]  
            setAllLibrary(compt_library)
        })   
	}, [])

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

	/* Familias */
	useEffect(async()=>{

        getComponentsTypes()
        .then(response => response.json())
        .then(async json => {
			let types = json.component_types
			let compt_types = []

            console.log("Familias");
            console.log(newCheckboxLibraryFamilias);

            for(let i = 0; i < types.length; i++){
                let label = types[i].type

                // Si el filtro ya esta en el array no lo vuelve a incluir
                if(!filterKeys.includes(label)){
                    filterKeys.push(label)
                }

				compt_types.push(
                    <div key={i} className='container__checkbox'>
                        <FormControlLabel
                            label={label}
                            control={
                                <Checkbox 
                                    value={label} 
                                    checked={newCheckboxLibraryFamilias.includes(label)}
                                    onChange={handleChangeCheckboxFamilias} 
                                    />                            
                            } 
                        />
                    </div>
                )
			}
			await setFamilies(compt_types)
        })   
	}, [newCheckboxLibraryFamilias, allCheckbox, newSearchLibrary])

    /* Marcas */
	useEffect(async()=>{
        
        getComponentsBrands()
        .then(response => response.json())
        .then(async json => {
            let brands = json.component_brands
			let compt_brand = []
            
            console.log("Marcas");
            console.log(newCheckboxLibraryMarcas);

            for(let i = 0; i < brands.length; i++){
                let label = brands[i].brand
                
                // Si el filtro ya esta en el array no lo vuelve a incluir
                if(!filterKeys.includes(label)){
                    filterKeys.push(label)
                }
                
				compt_brand.push(
                    <div key={i} className='container__checkbox'>
                        <FormControlLabel
                            label={label}
                            control={
                                <Checkbox 
                                    value={label} 
                                    checked={newCheckboxLibraryMarcas.includes(label)}
                                    onChange={handleChangeCheckboxMarcas}
                                    />                            
                            }
                        />
                    </div>
                )
			}
			await setMarcas(compt_brand)
        })   
	}, [newCheckboxLibraryMarcas, allCheckbox, newSearchLibrary])
    
    /* Tipos de proyecto */
	useEffect(async()=>{
        
        getProjectTypes()
        .then(response => response.json())
        .then(async json => {
            let project_types = json.project_types
			let compt_project = []

            console.log("Tipo P");
            console.log(newCheckboxLibraryTipoP);
            
            for(let i = 0; i < project_types.length; i++){
                let label = project_types[i].project_type

                // Si el filtro ya esta en el array no lo vuelve a incluir                
                if(!filterKeys.includes(label)){
                    filterKeys.push(label)
                }

				compt_project.push(
                    <div key={i} className='container__checkbox'>
                        <FormControlLabel
                            label={label}
                            control={
                                <Checkbox 
                                    value={label} 
                                    checked={newCheckboxLibraryTipoP.includes(label)}
                                    onChange={handleChangeCheckboxTipoP}
                                    />                            
                            }
                        />
                    </div>
                )
			}
			await setTipoP(compt_project)
        })   
	}, [newCheckboxLibraryTipoP, allCheckbox, newSearchLibrary])

    /* Disciplinas */
	useEffect(async()=>{

        getComponentDisciplines()
        .then(response => response.json())
        .then(async json => {
			let disciplinas = json.component_disciplines
			let compt_disc = []

            console.log("Disciplinas");
            console.log(newCheckboxLibraryDisciplinas);

            for(let i = 0; i < disciplinas.length; i++){
                let label = disciplinas[i].discipline + " (" + disciplinas[i].code + ")"
                let label2 = disciplinas[i].discipline

                // Si el filtro ya esta en el array no lo vuelve a incluir
                if(!filterKeys.includes(label2)){
                    filterKeys.push(label2)
                }


				compt_disc.push(
                    <div key={i} className='container__checkbox'>
                        <FormControlLabel
                            label={label}
                            control={
                                <Checkbox 
                                    value={label2} 
                                    checked={newCheckboxLibraryDisciplinas.includes(label2)}
                                    onChange={handleChangeCheckboxDisciplinas}
                                    />                            
                            }
                        />
                    </div>
                )
			}
			await setDisciplina(compt_disc)
        })   
	}, [newCheckboxLibraryDisciplinas, allCheckbox, newSearchLibrary])

    /* Funcion para los filtros checkbox Familias*/
    const handleChangeCheckboxFamilias = event => {
        const index = newCheckboxLibraryFamilias.indexOf(event.target.value)
        if (index === -1){
            setNewCheckboxLibraryFamilias([...newCheckboxLibraryFamilias, event.target.value])
        } else {
            setNewCheckboxLibraryFamilias(newCheckboxLibraryFamilias.filter((newCheckboxLibraryFamilias) => newCheckboxLibraryFamilias !== event.target.value))
        }
    }


    /* Funcion para los filtros checkbox Marcas*/
    const handleChangeCheckboxMarcas = event => {
        const index = newCheckboxLibraryMarcas.indexOf(event.target.value)

        if (index === -1){
            setNewCheckboxLibraryMarcas([...newCheckboxLibraryMarcas, event.target.value])
        } else {
            setNewCheckboxLibraryMarcas(newCheckboxLibraryMarcas.filter((newCheckboxLibraryMarcas) => newCheckboxLibraryMarcas !== event.target.value))
        }
    }

    /* Funcion para los filtros checkbox Tipo Proyectos*/
    const handleChangeCheckboxTipoP = event => {
        const index = newCheckboxLibraryTipoP.indexOf(event.target.value)

        if (index === -1){
            setNewCheckboxLibraryTipoP([...newCheckboxLibraryTipoP, event.target.value])
        } else {
            setNewCheckboxLibraryTipoP(newCheckboxLibraryTipoP.filter((newCheckboxLibraryTipoP) => newCheckboxLibraryTipoP !== event.target.value))
        }
    }

    /* Funcion para los filtros checkbox Disciplinas*/
    const handleChangeCheckboxDisciplinas = event => {
        const index = newCheckboxLibraryDisciplinas.indexOf(event.target.value)

        if (index === -1){
            setNewCheckboxLibraryDisciplinas([...newCheckboxLibraryDisciplinas, event.target.value])
        } else {
            setNewCheckboxLibraryDisciplinas(newCheckboxLibraryDisciplinas.filter((newCheckboxLibraryDisciplinas) => newCheckboxLibraryDisciplinas !== event.target.value))
        }
    }

    // /* Metodos para filtro busqueda */
    const handleChangeSearch = e => {
        setBusqueda(e.target.value);
        console.log("Busqueda: " + e.target.value);
    }

    /* Todos los filtros aplicados */
    useEffect(() => {
        
        let array_filtros = []

        if(groupProject.length === 0) {
            array_filtros = allLibrary
        }else{
            if(!newCheckboxLibraryDisciplinas && !newCheckboxLibraryFamilias && !newCheckboxLibraryMarcas && !newCheckboxLibraryTipoP){
                array_filtros = allLibrary
            }else{
                allLibrary.filter((elementoAllLibrary) => {
                    for (let index = 0; index < elementoAllLibrary.length; index++) {
                        if(((newCheckboxLibraryMarcas.toString().includes(elementoAllLibrary[index].component_brand.toString()) && newCheckboxLibraryMarcas.length === 1) || newCheckboxLibraryMarcas.length === 0) 
                        && ((newCheckboxLibraryDisciplinas.toString().includes(elementoAllLibrary[index].component_discipline.toString()) && newCheckboxLibraryDisciplinas.length === 1 ) || newCheckboxLibraryDisciplinas.length === 0)
                        && ((newCheckboxLibraryFamilias.toString().includes(elementoAllLibrary[index].component_type.toString()) && newCheckboxLibraryFamilias.length === 1 ) || newCheckboxLibraryFamilias.length === 0)
                        && (elementoAllLibrary[index].component_name.toString().toLowerCase().includes(busqueda.toLowerCase()) || busqueda === "")
                        ){
                            //(!groupProject[index] || groupProject[index].split(',').sort().toString().includes(newCheckboxLibraryTipoP.sort().toString()) || newCheckboxLibraryTipoP.length === 0)
                            if(!groupProject[index]){
                                array_filtros.push(elementoAllLibrary[index])
                            }else{
                                let meets = true
                                for(let i = 0; i < newCheckboxLibraryTipoP.length; i++){
                                    if(!groupProject[index].includes(newCheckboxLibraryTipoP[i].toString())){
                                        meets = false
                                    }
                                }
                                if(meets){
                                    array_filtros.push(elementoAllLibrary[index]);
                                }
                            }                            
                        }
                    }
                })
            }
        }

        console.log("Filtros array filters: " + array_filtros);
        setAllFilter(array_filtros)
        props.filtersAllLibrary(array_filtros)

    }, [allLibrary, groupProject, newCheckboxLibraryDisciplinas, newCheckboxLibraryFamilias, newCheckboxLibraryMarcas, newCheckboxLibraryTipoP, busqueda])

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
                    <button style={{marginLeft: "1%"}}className="btn btn-outline-danger" onClick={() => setBusqueda(() => "")}>
                        <FontAwesomeIcon icon={faEraser}/>
                    </button>
                </div>

                {/* Filtros Familias */}
                <div>
                    <div className='parent__checkbox'>
                        <h4>Familias</h4>
                    </div>
                </div>
                <div className='sub__checkbox'>
                    <Box>
                        <Box>
                            <FormGroup>
                                {families}
                            </FormGroup>
                        </Box>
                    </Box>
                </div>


                {/* Filtros Marcas */}
                <div>
                    <div className='parent__checkbox'>
                        <h4>Marca</h4>
                    </div>
                </div>
                <div className='sub__checkbox'>
                    <Box>
                        <Box>
                            <FormGroup>
                                {marcas}
                            </FormGroup>
                        </Box>
                    </Box>
                </div>

                {/* Filtros Tipos de proyecto */}
                <div>
                    <div className='parent__checkbox'>
                        <h4>Tipo de proyecto</h4>
                    </div>
                </div>
                <div className='sub__checkbox'>
                    <Box>

                        <Box>
                            <FormGroup>
                                {tipoP}
                            </FormGroup>
                        </Box>
                    </Box>
                </div>

                {/* Filtros Disciplinas */}
                <div>
                    <div className='parent__checkbox'>
                        <h4>Disciplina</h4>
                    </div>
                </div>
                <div className='sub__checkbox'>
                    <Box>

                    <Box>  
                        <FormGroup>
                            {disciplina}
                        </FormGroup>
                    </Box>
                    </Box>
                </div>

			</div>
        </div>
    );
};

export default FiltersLibrary;