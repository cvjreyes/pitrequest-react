import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import './createComponentPopUp.css';
import AlertF from "../../components/alert/alert"
import { NumericCellType } from 'handsontable/cellTypes';

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

export default class CreateComponentPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible : false,
            name: null,
            description: null,
            component_type: null,
            brand: null,
            discipline: null,
            project_types: [],
            component_types_array: [],
            component_brands_array: [],
            component_disciplines_array: [],
            project_types_array: [],
            image: null,
            rfa: null,
            blankRequest: false,
            typesCheckboxes: null
        }
    }

    async componentDidMount(){
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getComponentTypes", options)
        .then(response => response.json())
        .then(async json => {
            let components = []
            for(let i = 0; i < json.component_types.length; i++){
                components.push({id: json.component_types[i].id, type: json.component_types[i].type})
            }
            await this.setState({component_types_array: components})

            await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getComponentBrands", options)
            .then(response => response.json())
            .then(async json => {
                let component_brands = []
                for(let i = 0; i < json.component_brands.length; i++){
                    component_brands.push({id: json.component_brands[i].id, brand: json.component_brands[i].brand})
                }
                await this.setState({component_brands_array: component_brands})

                await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getComponentDisciplines", options)
                .then(response => response.json())
                .then(async json => {
                    let component_disciplines = []
                    for(let i = 0; i < json.component_disciplines.length; i++){
                        component_disciplines.push({id: json.component_disciplines[i].id, discipline: json.component_disciplines[i].discipline})
                    }

                    await this.setState({component_disciplines_array: component_disciplines})

                    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getProjectTypes", options)
                    .then(response => response.json())
                    .then(async json => {
                        let project_types = []
                        for(let i = 0; i < json.project_types.length; i++){
                            project_types.push({id: json.project_types[i].id, project_type: json.project_types[i].project_type})
                        }
                        await this.setState({project_types_array: project_types})
                    }) 
                }) 
            }) 
        }) 
    
    }

    async openModal() {
        let typesCheckboxes = <div id="projectTypeSelect" style={{display: "flex"}}>
            {this.state.project_types_array.map(type =>(
                <div style={{width:"150px"}}><label className='project_type_label'><input type="checkbox" className="project_type_checkbox" onChange={() => this.manageProjectTypes(type.id)}/> {type.project_type}</label></div>
            ))}
        </div>

        document.getElementById("typeSelect").value = null
        document.getElementById("brandSelect").value = null
        document.getElementById("disciplineSelect").value = null
        
        this.setState({typesCheckboxes: typesCheckboxes})
        await this.setState({
            visible : true,
            name: null,
            description: null,
            type: null,
            brand: null,
            discipline: null,
            project_types: []
        });
    }

    async closeModal() {
        document.getElementById("name").value = null
        document.getElementById("description").value = null
        document.getElementById("typeSelect").value = null
        document.getElementById("brandSelect").value = null
        document.getElementById("disciplineSelect").value = null
        document.getElementById("projectTypeSelect").value = null
        document.getElementById("image").value = null
        document.getElementById("rfa").value = null

        await this.setState({
            visible : false,
            name: null,
            description: null,
            type: null,
            brand: null,
            discipline: null,
            project_types: [],
            typesCheckboxes: null
        });
    }

    async manageProjectTypes(type){
        const index = this.state.project_types.indexOf(type)
        if (index === -1){
            this.setState({project_types: [...this.state.project_types, type]})
        } else {
            this.setState({project_types: this.state.project_types.filter((project_types) => project_types !==type)})
        }
    }

    async request(){
        
        if(this.state.name && this.state.description && this.state.component_type && this.state.brand && this.state.discipline && this.state.project_types.length > 0 && this.state.image && this.state.rfa){
            const body ={
                componentName : this.state.name,
                componentDescription: this.state.description,
                componentTypeId: this.state.component_type,
                componentBrandId: this.state.brand,
                componentDisciplineId: this.state.discipline,
                project_types: this.state.project_types,
              }
              const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            }
              await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/createComponent", options)
                  .then(response => response.json())
                  .then(async json => {
                      if(json.success){
                        const extension = this.state.image.name.split('.').pop();
                        const file  = new FormData(); 
                        file.append('file', this.state.image, json.filename + "." + extension);
                        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/uploadComponentImage", {
                            method: 'POST',
                            body: file,
                            }).then(response =>{
                                if (response.status === 200){
                                    //this.props.success()
                                }
                            })
                        const fileRFA  = new FormData(); 
                        fileRFA.append('file', this.state.rfa, json.filename + ".rfa");
                        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/uploadComponentRFA", {
                            method: 'POST',
                            body: fileRFA,
                            }).then(response =>{
                                if (response.status === 200){
                                    //this.props.success()
                                }
                            })
                        this.props.success()   
                      }else{
                          this.props.error()
                      }
                  })
                  this.closeModal()
        }else{
            this.setState({blankRequest: true})
        }
        
    }

    

    render() {       
        
        return (
            <div style={{marginRight:"5px", marginLeft:"5px", float:"right"}}>
                <button className="create__component__btn" onClick={() => this.openModal()}>New item</button>
                <div>
                    <Modal visible={this.state.visible} width="550" height="670" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                    <div style={{marginTop: "40px"}}
                    className={`alert alert-success ${this.state.blankRequest ? 'alert-shown' : 'alert-error-hidden'}`}
                    onTransitionEnd={() => this.setState({blankRequest: false})}
                    >
                        <AlertF type="warning" text="All fileds need to be filled!" margin="0px" popUp="true"/>
                    </div>
                    <div className="qtrackerRequest__container">
                        <table>
                        <thead>
                            <tr>
                            <th colSpan={3}>
                                <center className="qtracker__popUp__title" style={{marginBottom: "30px"}}><h3>New Item</h3></center>
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Primer fila: Project - Carta - Priority */}
                            <tr>
                                <td style={{textAlign: "left"}}>
                                <label className="priority__label" for="typeSelect" >Name</label>                            
                                </td>
                                <td style={{textAlign: "left"}}>
                                <label className="priority__label" for="name">Type</label>                            
                                </td>
                            </tr>
                            <tr>
                                <td style={{textAlign: "left"}}>
                                <input type="text" id="name" className="name__input" onChange={(e) => this.setState({name: e.target.value})}></input>                      
                                </td>
                                <td style={{textAlign: "left"}}>
                                <select id="typeSelect" className="create__project__select" onChange={(e) => this.setState({component_type: e.target.value})}>
                                    {this.state.component_types_array.map(comp =>(
                                        <option value={comp.id}>{comp.type}</option>
                                    ))}
                                </select>
                                </td>
                            </tr>
                            {/* Segunda fila: Pipe */}
                            <tr>
                                <td style={{textAlign: "left"}}>
                                <label className="priority__label" for="disciplineSelect" >Discipline</label>                            
                                </td>
                                <td style={{textAlign: "left"}}>
                                <label className="priority__label" for="brandSelect">Brand</label>                            
                                </td>
                            </tr>
                            <tr>
                            <td style={{textAlign: "left"}}>
                                <select id="disciplineSelect" className="create__project__select" onChange={(e) => this.setState({discipline: e.target.value})}>
                                    {this.state.component_disciplines_array.map(disc =>(
                                        <option value={disc.id}>{disc.discipline}</option>
                                    ))}
                                </select>
                                </td>
                                <td style={{textAlign: "left"}}>
                                <select id="brandSelect" className="create__project__select" onChange={(e) => this.setState({brand: e.target.value})}>
                                    {this.state.component_brands_array.map(brand =>(
                                        <option value={brand.id}>{brand.brand}</option>
                                    ))}
                                </select>
                                </td>
                            </tr>
                            {/*Tercera fila*/}
                            <tr>
                                <td style={{textAlign: "left"}}>
                                <label className="priority__label" for="disciplineSelect" >Project type</label>                            
                                </td>
                            </tr>
                            <tr>
                            <td style={{textAlign: "left"}}>
                                {this.state.typesCheckboxes}
                                </td>
                            </tr>
                            {/* Cuarta fila: Description */}
                            <tr>
                                <td style={{textAlign: "left"}}>
                                <label className="priority__label" for="description">Description</label>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                <textarea id="description" name="description" className="component__description__input__text" rows="3" ref="description" style={{marginBottom:"5px", color:"black"}} onChange={(e) => this.setState({description: e.target.value})}/>
                                </td>
                            </tr>
                            {/* Quinta fila: Attach */}
                            <tr>
                                <td style={{textAlign: "left"}}>
                                <label for="attach" className="priority__label" style={{marginBottom:"5px"}}>Image</label>
                                <input type="file" id="image" className="qtrackerPopUp__input__file"  ref="attach" style={{marginBottom: "5px"}}  onChange={(e) => this.setState({image: e.target.files[0]})} ></input>
                                <label for="rfa" className="priority__label" style={{marginBottom:"5px"}}>RFA</label>
                                <input type="file" id="rfa" className="qtrackerPopUp__input__file"  ref="rfa" style={{marginBottom: "10px"}}  onChange={(e) => this.setState({rfa: e.target.files[0]})} ></input>
                                </td>
                            </tr>

                        </tbody>
                        </table>
                        {/* Sexta fila: los dos botones */}
                        <button class="btn__submit" onClick={() => this.request()} >Submit</button>
                        <button class="btn__cancel" onClick={() => this.closeModal()} >Cancel</button>
                        </div>
                    </Modal>
                </div>
            </div>
        );
    }
}