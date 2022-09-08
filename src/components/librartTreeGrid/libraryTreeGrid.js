import React, { Component } from 'react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './libraryTreeGrid.css'
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';
import { getComponentDisciplines, getComponentsBrands, getComponentsTypes } from '../../ApiRequest';

import SaveIcon2 from "../../assets/images/SaveIcon2.svg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';

class LibraryTreeGrid extends Component{

    constructor(props) {
        super(props);
        this.state = {
            visible : false,
            component_types: [],
            component_brands: [],
            component_disciplines: [],
        }
    }

    async componentDidMount(){
        getComponentsTypes()
        .then(response => response.json())
        .then(async json => {
			let types = json.component_types
			let compt_types = []

            for(let i = 0; i < types.length; i++){
                compt_types.push({type: types[i].type, id: types[i].id})

			}
			await this.setState({component_types: compt_types})
        })  

        getComponentDisciplines()
        .then(response => response.json())
        .then(async json => {
			let disciplines = json.component_disciplines
			let compt_disciplines = []

            for(let i = 0; i < disciplines.length; i++){
                compt_disciplines.push({discipline: disciplines[i].discipline, code: disciplines[i].code, id: disciplines[i].id})

			}
			await this.setState({component_disciplines: disciplines})
        })  

        getComponentsBrands()
        .then(response => response.json())
        .then(async json => {
			let brands = json.component_brands
			let compt_brands = []

            for(let i = 0; i < brands.length; i++){
                compt_brands.push({brand: brands[i].brand, id: brands[i].id})

			}
			await this.setState({component_brands: compt_brands})
        })  

    }

    async addRowFamilies(){
        this.setState({component_types: [...this.state.component_types, {type: "", id: ""}]})
    }

    async addRowDisciplines(){
        this.setState({component_disciplines: [...this.state.component_disciplines, {discipline: "", id: ""}]})
    }

    async addRowBrands(){
        this.setState({component_brands: [...this.state.component_brands, {brand: "", id: ""}]}) 
    }

    async goToLibrary(){
        this.props.goToLibrary()
    }

    async saveChanges(){
        const body ={
            component_types: this.state.component_types,
            component_brands: this.state.component_brands,
            component_disciplines: this.state.component_disciplines,
          }
          const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }
          await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/updateFilters", options)
              .then(response => response.json())
              .then(async json => {
                  if(json.success){
                    this.props.success()
                  }else{
                    this.props.error()
                  }
              })
    }
    
    
    render() {

        let settingsFamilies = {
            licenseKey: 'non-commercial-and-evaluation',
            colWidths: 300,
        }
    
        let settingsBrands = {
            licenseKey: 'non-commercial-and-evaluation',
            colWidths: 300,
        className:'excel'
        }   
    
        let settingsDisciplines= {
            licenseKey: 'non-commercial-and-evaluation',
            colWidths: 300,
        className:'excel'
        }

        return (
            <div>
                <div style={{marginTop: "140px"}}>
                    <button className="projects__button__save" onClick={()=>this.saveChanges()} style={{width:"175px", marginLeft:"-1570px"}}><img src={SaveIcon2} alt="hold" className="navBar__icon__save" style={{marginRight:"-20px"}}></img><p className="projects__button__text">Save</p></button>
                    <button className="library__button" onClick={()=>this.props.goToLibrary()} style={{width:"175px", marginLeft:"20px"}}><FontAwesomeIcon className='icon__book' icon={faBook} />Library</button>
                </div>
                <div>
                    <div id="hot-app" className="excel__container__familias">
                        <HotTable
                            data={this.state.component_types}
                            colHeaders = {["<b>Families</b>"]}
                            rowHeaders={false}
                            width="322"
                            height="400"
                            className="custom__table__familias"
                            rowHeights="38"
                            settings={settingsFamilies} 
                            manualColumnResize={true}
                            manualRowResize={true}
                            columns= {[{data: "type"}]}
                            filters={false}
                        />
                    </div>
                    
                    <div id="hot-app" className="excel__container__marcas">
                        <HotTable
                            data={this.state.component_brands}
                            colHeaders = {["<b>Brands</b>"]}
                            rowHeaders={false}
                            width="322"
                            height="400"
                            className="custom__table__marcas"
                            rowHeights="38"
                            settings={settingsBrands} 
                            manualColumnResize={true}
                            manualRowResize={true}
                            columns= { [{data: "brand"}]}
                            filters={false}
                        />
                    </div>

                    <div id="hot-app" className="excel__container__disciplinas">
                        <HotTable
                            data={this.state.component_disciplines}
                            colHeaders = {["<b>Disciplines</b>", "<b>Code</b>"]}
                            rowHeaders={false}
                            width="622"
                            height="400"
                            className="custom__table__disciplinas"
                            rowHeights="38"
                            settings={settingsDisciplines} 
                            manualColumnResize={true}
                            manualRowResize={true}
                            columns= { [{data: "discipline"}, {data: "code"}]}
                            filters={false}
                        />
                    </div>
                </div>

                <div className='button__add__library'>
                    
                    <div style={{display: "flex", float:"center", marginLeft:"-415%"}} >
                        <div>
                            <button className="projects__add__button" type="button" onClick={()=> this.addRowFamilies()} style={{width:"70px"}}><p className="projects__add__button__text">+ Add</p></button>
                        </div>
                    </div>

                    <div style={{display: "flex", float:"center", marginLeft: "130%"}} >
                        <div>
                            <button className="projects__add__button" type="button" onClick={()=> this.addRowBrands()} style={{width:"70px"}}><p className="projects__add__button__text">+ Add</p></button>
                        </div>
                    </div>

                    <div style={{display: "flex", float:"center", marginLeft: "175%"}} >
                        <div>
<<<<<<< HEAD
                            <button className="projects__add__button" type="button" onClick={()=> this.addRowTipoP()} style={{width:"70px"}}><p className="projects__add__button__text">+ Add</p></button>
=======
                            <button className="projects__add__button" type="button" onClick={()=> this.addRowDisciplines()} style={{width:"70px"}}><p className="projects__add__button__text">+ Add</p></button>
>>>>>>> master
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default LibraryTreeGrid;