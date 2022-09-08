import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import './createComponentPopUp.css';
import AlertF from "../../components/alert/alert"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

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
            component_types_array: [],
            component_brands_array: [],
            component_disciplines_array: [],
            image: null,
            rfa: null,
            blankRequest: false,
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

                    
                }) 
            }) 
        }) 
    
    }

    async openModal() {

        document.getElementById("typeSelect").value = null
        document.getElementById("brandSelect").value = null
        document.getElementById("disciplineSelect").value = null
        
        await this.setState({
            visible : true,
            name: null,
            description: null,
            type: null,
            brand: null,
            discipline: null,
        });
    }

    async closeModal() {
        document.getElementById("name").value = null
        document.getElementById("description").value = null
        document.getElementById("typeSelect").value = null
        document.getElementById("brandSelect").value = null
        document.getElementById("disciplineSelect").value = null
        document.getElementById("image").value = null
        document.getElementById("rfa").value = null

        await this.setState({
            visible : false,
            name: null,
            description: null,
            type: null,
            brand: null,
            discipline: null,
        });
    }

    async request(){ 
        if(this.state.name && this.state.description && this.state.component_type && this.state.brand && this.state.discipline && this.state.image && this.state.rfa){
            const body ={
                componentName : this.state.name,
                componentDescription: this.state.description,
                componentTypeId: this.state.component_type,
                componentBrandId: this.state.brand,
                componentDisciplineId: this.state.discipline,
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
                                }
                            })
                        const fileRFA  = new FormData(); 
                        fileRFA.append('file', this.state.rfa, json.filename + "." + this.state.rfa.name.split('.').pop());
                        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/uploadComponentRFA", {
                            method: 'POST',
                            body: fileRFA,
                            }).then(response =>{
                                if (response.status === 200){
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
                <button className="new__library__button" onClick={() => this.openModal()}><FontAwesomeIcon className='icon__book' icon={faPlus} />New item</button>
                <div>
                    <Modal visible={this.state.visible} width="550" height="650" effect="fadeInUp" onClickAway={() => this.closeModal()}>
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
                            {/* Primer fila: Name and Family */}
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
                            
                            {/* Tercera fila: Description */}
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
                            {/* Cuarta fila: Attach */}
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
                        {/* Quinta fila: los dos botones */}
                        <br/>
                        <button class="btn__submit" onClick={() => this.request()} >Submit</button>
                        <button class="btn__cancel" onClick={() => this.closeModal()} >Cancel</button>
                        </div>
                    </Modal>
                </div>
            </div>
        );
    }
}