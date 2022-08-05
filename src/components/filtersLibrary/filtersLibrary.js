import React, { useState, useEffect } from 'react';
import './filtersLibrary.css'
import Checkbox from '@mui/material/Checkbox';

const FiltersLibrary = (props) =>{

    /* Rellenar arrays filtros */
	const [families, setFamilies] = useState([])
	const [marcas, setMarcas] = useState([])
	const [tipoP, setTipoP] = useState([])
	const [disciplina, setDisciplina] = useState([])
    const [isChecked, setIsChecked] = useState(false);


	/* Familias */
	useEffect(async()=>{
		const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getComponentTypes", options)
        .then(response => response.json())
        .then(async json => {
			let types = json.component_types
			let compt_types = []
            for(let i = 0; i < types.length; i++){
                let label = types[i].type
				compt_types.push(
                    <div className='container__checkbox'>
                        <Checkbox/> <p className="text__checkbox__library">{label}</p>
                    </div>
                )
			}
			await setFamilies(compt_types)
        })   
	}, [])

    /* Marcas */
	useEffect(async()=>{
		const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getComponentBrands", options)
        .then(response => response.json())
        .then(async json => {
			let brands = json.component_brands
			let compt_brand = []
            for(let i = 0; i < brands.length; i++){
                let label = brands[i].brand
				compt_brand.push(
                    <div className='container__checkbox'>
                        <Checkbox/> <p className="text__checkbox__library">{label}</p>
                    </div>
                )
			}
			await setMarcas(compt_brand)
        })   
	}, [])

    /* Tipos de proyecto */
	useEffect(async()=>{
		const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getProjectTypes", options)
        .then(response => response.json())
        .then(async json => {
			let project_types = json.project_types
			let compt_project = []
            for(let i = 0; i < project_types.length; i++){
                let label = project_types[i].project_type
				compt_project.push(
                    <div className='container__checkbox'>
                        <Checkbox/> <p className="text__checkbox__library">{label}</p>
                    </div>
                )
			}
			await setTipoP(compt_project)
        })   
	}, [])

    /* Disciplinas */
	useEffect(async()=>{
		const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getComponentDisciplines", options)
        .then(response => response.json())
        .then(async json => {
			let disciplinas = json.component_disciplines
			let compt_disc = []
            for(let i = 0; i < disciplinas.length; i++){
                let label = disciplinas[i].discipline + " (" + disciplinas[i].code + ")"
				compt_disc.push(
                    <div className='container__checkbox'>
                        <Checkbox/> <p className="text__checkbox__library">{label}</p>
                    </div>
                )
			}
			await setDisciplina(compt_disc)
        })   
	}, [])
    
    return(
        <div>
            <div className='container__filters__left'>

                {/* Filtros Buscador */}
                <div>
                    
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