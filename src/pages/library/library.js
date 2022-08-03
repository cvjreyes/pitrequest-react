import NavBar from '../../components/navBar/navBar';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {useNavigate} from "react-router";
import $ from 'jquery';
import './library.css'
import PITLogo from "../../assets/images/pitlogo.svg"
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';


const Library = () =>{    

	const history = useNavigate();

	document.body.style.zoom = 0.8
	document.body.style.height = -70%

	/* Es para volver al menu principal */
	function back(){
        history("/"+process.env.REACT_APP_PROJECT+"/pitrequests")
    }

	/* Filtro de la izquierda Componentes 3D*/
	const [checkedComp3d, setCheckedComp3d] = React.useState([true, false]);

	const handleChange1Comp3d = (event) => {
		setCheckedComp3d([event.target.checked, event.target.checked]);
	};

	const handleChange2Comp3d = (event) => {
		setCheckedComp3d([event.target.checked, checkedComp3d[1]]);
	};

	const handleChange3Comp3d = (event) => {
		setCheckedComp3d([checkedComp3d[0], event.target.checked]);
	};


	/* Filtro de la izquierda Marcas*/
	const [checkedMarcas, setCheckedMarcas] = React.useState([true, false]);

	const handleChange1Marcas = (event) => {
		setCheckedMarcas([event.target.checked, event.target.checked]);
	};

	const handleChange2Marcas = (event) => {
		setCheckedMarcas([event.target.checked, checkedMarcas[1]]);
	};

	const handleChange3Marcas = (event) => {
		setCheckedMarcas([checkedMarcas[0], event.target.checked]);
	};

	/* Configuracion para hacer los filtros de los menus de arriba */
	(function(){
		$(document).ready(function(){
			$(".btn-menu").click(function(e){
				e.preventDefault();
				var filtro = $(this).attr("data-filter");
	
				if (filtro == "todos") {
					$(".box-img").show(500);
				} else {
					$(".box-img").not("."+filtro).hide(500);
					$(".box-img").filter("."+filtro).show(500);
				}
			});
	
			$("ul li").click(function(){
				$(this).addClass("active").siblings().removeClass("active");
			});
		});
	}())

    return (
		<div>
			<div style={{zoom:1.125}}>
				<NavBar/>
			</div>
			<div className="container__left__library">
				<div>
					<img src={PITLogo} alt="PITLogo" className="isoTrackerLogo__image2" style={{height:"110px", marginLeft:60}}/>
				</div>
				<div className='container__filters__left'>
					<div>
						<FormControlLabel
							label="Componentes 3D"
							control={
							<Checkbox
								checked={checkedComp3d[0] && checkedComp3d[1]}
								indeterminate={checkedComp3d[0] !== checkedComp3d[1]}
								onChange={handleChange1Comp3d}
							/>
							}
						/>
					</div>
					<div className='sub__checkbox'>
						<Box sx={{ display: 'flex', flexDirection: 'column', ml: 3}}>
							<FormControlLabel
								label="Pharma"
								control={<Checkbox checked={checkedComp3d[0]} onChange={handleChange2Comp3d} />}
							/>
							<FormControlLabel
								label="Ultracongelados"
								control={<Checkbox checked={checkedComp3d[1]} onChange={handleChange3Comp3d} />}
							/>
						</Box>
					</div>
				</div>
				<div >
					<div className='parent__checkbox'>
						<FormControlLabel
							label="Marcas"
							control={
							<Checkbox
								checked={checkedMarcas[0] && checkedMarcas[1]}
								indeterminate={checkedMarcas[0] !== checkedMarcas[1]}
								onChange={handleChange1Marcas}
							/>
							}
						/>
					</div>
					<div className='sub__checkbox'>
						<Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
							<FormControlLabel
								label="Sony"
								control={<Checkbox checked={checkedMarcas[0]} onChange={handleChange2Marcas} />}
							/>
							<FormControlLabel
								label="Philips"
								control={<Checkbox checked={checkedMarcas[1]} onChange={handleChange3Marcas} />}
							/>
						</Box>
					</div>
				</div>
			</div>
			<div class="container">
				<div class="menu">
					<ul style={{marginLeft:"-1%"}}>
						<li class="todos active"><a class="btn-menu" data-filter="todos">Todos</a></li>
						<li class="laptop"><a class="btn-menu" data-filter="laptop">Componentes 2D</a></li>
						<li class="camara"><a class="btn-menu" data-filter="camara">Componentes 3D</a></li>
						{/*<li class="iphone"><a class="btn-menu" data-filter="iphone">Iphones</a></li>
						<li class="audifono"><a class="btn-menu" data-filter="audifono">Audifonos</a></li>*/}	
					</ul>
				</div>

				<div class="galeria">
					
					<div class="title-img">
						<h3>Galeria</h3>
					</div>

					<div class="box-img laptop">
						<img src="https://github.com/CodigoMasters/Filter-Images/blob/master/img/Laptop-I.jpg?raw=true" alt=""></img>
						<button className="button__description">Descripcion</button>
					</div>

					<div class="box-img camara">
						<img src="https://github.com/CodigoMasters/Filter-Images/blob/master/img/Camara-I.jpg?raw=true" alt=""></img>
						<button className="button__description">Descripcion</button>
					</div>

					<div class="box-img iphone">
						<img src="https://github.com/CodigoMasters/Filter-Images/blob/master/img/Iphone-I.jpg?raw=true" alt=""></img>
						<button className="button__description">Descripcion</button>
					</div>

					<div class="box-img audifono">
						<img src="https://github.com/CodigoMasters/Filter-Images/blob/master/img/Audifono-I.jpg?raw=true" alt=""></img>
						<button className="button__description">Descripcion</button>
					</div>

					<div class="box-img laptop">
						<img src="https://github.com/CodigoMasters/Filter-Images/blob/master/img/Laptop-II.jpg?raw=true" alt=""></img>
						<button className="button__description">Descripcion</button>
					</div>
					
					<div class="box-img camara">
						<img src="https://github.com/CodigoMasters/Filter-Images/blob/master/img/Camara-II.jpg?raw=true" alt=""></img>
						<button className="button__description">Descripcion</button>
					</div>

					<div class="box-img iphone">
						<img src="https://github.com/CodigoMasters/Filter-Images/blob/master/img/Iphone-II.jpg?raw=true" alt=""></img>
						<button className="button__description">Descripcion</button>
					</div>

					<div class="box-img audifono">
						<img src="https://github.com/CodigoMasters/Filter-Images/blob/master/img/Audifono-II.jpg?raw=true" alt=""></img>
						<button className="button__description">Descripcion</button>
					</div>

					<div class="box-img audifono">
						<img src="https://github.com/CodigoMasters/Filter-Images/blob/master/img/Audifono-III.jpg?raw=true" alt="Audifono"></img>
						<button className="button__description">Descripcion</button>
					</div>

				</div>
			</div>
		</div>
    )

}

export default Library;