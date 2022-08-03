import NavBar from '../../components/navBar/navBar';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {useNavigate} from "react-router";
import $ from 'jquery';
import './library.css'


const Library = () =>{    

	const history = useNavigate();

	document.body.style.zoom = 0.8

	/* Es para volver al menu principal */
	function back(){
        history("/"+process.env.REACT_APP_PROJECT+"/pitrequests")
    }

	/* Configuracion para hacer los filtros de los menus */
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
			<div>
				<NavBar/>
			</div>
				<div class="container">
				<div class="menu">
					<ul style={{marginLeft:"-1%"}}>
						<li class="todos active"><a href="#" class="btn-menu" data-filter="todos">Todos</a></li>
						<li class="laptop"><a href="#" class="btn-menu" data-filter="laptop">Laptops</a></li>
						<li class="camara"><a href="#" class="btn-menu" data-filter="camara">Camaras</a></li>
						<li class="iphone"><a href="#" class="btn-menu" data-filter="iphone">Iphones</a></li>
						<li class="audifono"><a href="#" class="btn-menu" data-filter="audifono">Audifonos</a></li>	
					</ul>
				</div>

				<div class="galeria">
					
					<div class="title-img">
						<h3>Galeria de la Libreria</h3>
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