import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import AlertF from "../../components/alert/alert"
import { NumericCellType } from 'handsontable/cellTypes';
import Edit from "../../assets/images/edit.png"
import './editComponentPopUp.css'

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

export default class EditComponentPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible : false,
            id: this.props.id,
            name: this.props.component.component_name,
            description: this.props.component.component_description,
            component_type: this.props.component.component_type_id,
            brand: this.props.component.component_brand_id,
            discipline: this.props.component.component_discipline_id,
            project_types: this.props.projects[this.props.id],
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
        console.log(this.props.projects)
        let typesCheckboxes = <div id="projectTypeSelect" style={{display: "flex"}}>
            {this.state.project_types_array.map(type =>( this.state.project_types.toString().includes(type.id) ?
                <div style={{width:"150px"}}><label className='project_type_label'><input type="checkbox" defaultChecked className="project_type_checkbox" onChange={() => this.manageProjectTypes(type.id)}/> {type.project_type}</label></div> : <div style={{width:"150px"}}><label className='project_type_label'><input type="checkbox" className="project_type_checkbox" onChange={() => this.manageProjectTypes(type.id)}/> {type.project_type}</label></div> 
            ))}
        </div>
        
        this.setState({typesCheckboxes: typesCheckboxes})
        await this.setState({
            visible : true,
        });
    }

    async closeModal() {

        await this.setState({
            visible : false,
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
        
        if(this.state.name && this.state.description && this.state.component_type && this.state.brand && this.state.discipline && this.state.project_types.length > 0){
            const body ={
                componentId: this.state.id,
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
            await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/updateComponent", options)
                  .then(response => response.json())
                  .then(async json => {
                      if(json.success){
                        if(this.state.image){
                        const extension = this.state.image.name.split('.').pop();
                        const file  = new FormData(); 
                        file.append('file', this.state.image, this.state.name + "." + extension);
                        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/uploadComponentImage", {
                            method: 'POST',
                            body: file,
                            }).then(response =>{
                                if (response.status === 200){
                                    //this.props.success()
                                }
                            })
                        }
                        if(this.state.rfa){
                            const fileRFA  = new FormData(); 
                            fileRFA.append('file', this.state.rfa, this.state.name + ".rfa");
                            await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/uploadComponentRFA", {
                                method: 'POST',
                                body: fileRFA,
                                }).then(response =>{
                                    if (response.status === 200){
                                        //this.props.success()
                                    }
                                })
                                  
                            }
                        }
                        this.props.updateSuccess()
                    })
                  this.closeModal()
        }else{
            this.setState({blankRequest: true})
        }
        
    }

    render() {       
        return (
            <div style={{marginRight:"5px", marginLeft:"5px", float:"right"}}>
                <button className="btn" style={{height:"40px", width:"40px", position:"absolute", backgroundColor:"#338DF1", color:"white", marginLeft:"36px"}} onClick={() => this.openModal()}><img src={Edit} alt="edit" className='delete__component__img'></img></button>
                <div>
                    <Modal visible={this.state.visible} width="510" height="670" effect="fadeInUp" onClickAway={() => this.closeModal()}>
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
                                <center className="qtracker__popUp__title" style={{marginBottom: "30px"}}><h3>Edit {this.props.component.component_name}</h3></center>
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
                                <input type="text" id="name" className="edit__name__input" value={this.state.name} onChange={(e) => this.setState({name: e.target.value})}></input>                      
                                </td>
                                <td style={{textAlign: "left"}}>
                                <select id="typeSelect" className="edit__project__select" onChange={(e) => this.setState({component_type: e.target.value})}>
                                    {this.state.component_types_array.map(comp =>(comp.id == this.state.component_type ? 
                                        <option selected value={comp.id}>{comp.type}</option> : <option value={comp.id}>{comp.type}</option>
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
                                <select id="disciplineSelect" className="edit__project__select" onChange={(e) => this.setState({discipline: e.target.value})}>
                                    {this.state.component_disciplines_array.map(disc =>( disc.id == this.state.discipline ?
                                        <option selected value={disc.id}>{disc.discipline}</option> : <option value={disc.id}>{disc.discipline}</option>
                                    ))}
                                </select>
                                </td>
                                <td style={{textAlign: "left"}}>
                                <select id="brandSelect" className="edit__project__select" onChange={(e) => this.setState({brand: e.target.value})}>
                                    {this.state.component_brands_array.map(brand =>( brand.id == this.state.brand ?
                                        <option selected value={brand.id}>{brand.brand}</option> : <option value={brand.id}>{brand.brand}</option>
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
                                <textarea id="description" name="description" className="component__description__input__text" rows="3" ref="description" style={{marginBottom:"5px", color:"black"}} value={this.state.description} onChange={(e) => this.setState({description: e.target.value})}/>
                                </td>
                            </tr>
                            {/* Quinta fila: Attach */}
                            <tr>
                                <td style={{textAlign: "left"}}>
                                <label for="attach" className="priority__label" style={{marginBottom:"5px"}}>New image</label>
                                <input type="file" id="image" className="qtrackerPopUp__input__file"  ref="attach" style={{marginBottom: "5px"}}  onChange={(e) => this.setState({image: e.target.files[0]})} ></input>
                                <label for="rfa" className="priority__label" style={{marginBottom:"5px"}}>New RFA</label>
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