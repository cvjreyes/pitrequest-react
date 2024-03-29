import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import AlertF from "../../components/alert/alert"
import Edit from "../../assets/images/edit.png"
import './editComponentPopUp.css'

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
            component_types_array: [],
            component_brands_array: [],
            component_disciplines_array: [],
            image: null,
            rfa: null,
            blankRequest: false,
            typesCheckboxes: null
        }
    }

    async componentDidMount(){
        console.log(this.state.component_type)
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }

        // Coge las familias
        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getComponentTypes", options)
        .then(response => response.json())
        .then(async json => {
            let component_types = []
            for(let i = 0; i < json.component_types.length; i++){
                component_types.push({id: json.component_types[i].id, type: json.component_types[i].type})
            }
            await this.setState({component_types_array: component_types})

            // Coge las marcas
            await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getComponentBrands", options)
            .then(response => response.json())
            .then(async json => {
                let component_brands = []
                for(let i = 0; i < json.component_brands.length; i++){
                    component_brands.push({id: json.component_brands[i].id, brand: json.component_brands[i].brand})
                }
                await this.setState({component_brands_array: component_brands})

                // Coge las disciplinas
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
        
        await this.setState({
            visible : true,
        });
    }

    async closeModal() {

        await this.setState({
            visible : false,
        });
    }

    // Recoge los datos datos del elemento de la libreria y los hace editables
    async request(){
        
        if(this.state.name && this.state.description && this.state.component_type && this.state.brand && this.state.discipline){
            const body ={
                componentId: this.state.id,
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
                            fileRFA.append('file', this.state.rfa, this.props.component.component_code + "." + this.state.rfa.name.split('.').pop());
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
                    <Modal visible={this.state.visible} width="510" height="650" effect="fadeInUp" onClickAway={() => this.closeModal()}>
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
                                    <th colSpan={2}>
                                        <center className="qtracker__popUp__title" style={{marginBottom: "30px"}}><h3>Edit {this.props.component.component_name}</h3></center>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Primer fila: Name and family */}
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
                                        <select id="typeSelect" className="create__project__select" onChange={(e) => this.setState({component_type: e.target.value})}>
                                            {this.state.component_types_array.map(comp =>(comp.id == this.state.component_type ?
                                                <option selected value={comp.id}>{comp.type}</option> : <option value={comp.id}>{comp.type}</option>
                                             ))}
                                        </select>
                                    </td>
                                </tr>
                                {/* Segunda fila: Disciplina y brand */}
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
                                
                                {/* Tercera fila: Description */}
                                <tr>
                                    <td colSpan={2} style={{textAlign: "left"}}>
                                        <label className="priority__label" for="description">Description</label>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={2}>
                                        <textarea id="description" name="description" className="component__description__input__text" ref="description" style={{marginBottom:"5px", color:"black"}} value={this.state.description} onChange={(e) => this.setState({description: e.target.value})}/>
                                    </td>
                                </tr>
                                {/* Cuarta fila: Attach */}
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