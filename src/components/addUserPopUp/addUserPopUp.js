import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import './addUserPopUp.css'
import AlertF from "../../components/alert/alert"


export default class AddUserPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible : false,
            id : props.id,
            username : "",
            email : "",
            des : false,
            lde : false,
            str: false,
            lst : false,
            sup : false,
            lsp: false,
            mat : false,
            iss : false,
            los: false,
            pro : false,
            ins : false,
            rev: false,
            adm: false,
            blankFields: false,
            selected: "@technipenergies.com"
        }
        
    }
   

    openModal() {      
        this.setState({
            visible : true,
        });
    }

    closeModal() {
        this.setState({
            visible : false,
            email : "",
            username : "",
            des : false,
            lde : false,
            str: false,
            lst : false,
            sup : false,
            lsp: false,
            mat : false,
            iss : false,
            los: false,
            pro : false,
            ins : false,
            rev: false,
            adm: false,
            prj: false,
            blankFields: false,
            selected: "@technipenergies.com"
        });

    }

    addUser(){
        let username = this.state.email.replace("-", " ")
        username = username.replace(".", " ")
        let splitStr = username.toLowerCase().split(' ');
        for(let i = 0; i < splitStr.length; i++){
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)
        }
        username = splitStr.join(' ')
        const email = this.state.email + this.state.selected
        if(username === "" || username === null){
            this.setState({
                blankFields: true
            })
        }else{
            let roles = []

            if(this.state.des){
                roles.push("des")
            }if(this.state.lde){
                roles.push("lde")
            }if(this.state.str){
                roles.push("str")
            }if(this.state.sup){
                roles.push("sup")
            }if(this.state.lsp){
                roles.push("lsp")
            }if(this.state.lst){
                roles.push("lst")
            }if(this.state.mat){
                roles.push("mat")
            }if(this.state.iss){
                roles.push("iss")
            }if(this.state.los){
                roles.push("los")
            }if(this.state.pro){
                roles.push("pro")
            }if(this.state.ins){
                roles.push("ins")
            }if(this.state.rev){
                roles.push("rev")
            }if(this.state.adm){
                roles.push("E3D")
            }if(this.state.prj){
                roles.push("prj")
            }
            
            this.props.addUser(username, email, roles)
            this.closeModal()
        }   

    }

    handleChangeUsername(event){
        this.setState({username: event.target.value});
    }

    onChange(event){
        this.setState({selected: event.target.value});
    }

    render() {
        return (
            <section >
                <input type="button"  value="Add user" className="action__btn" onClick={() => this.openModal()} />
                <div>
                    <Modal visible={this.state.visible} width="650" height="380" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                    <div
                        className={`alert alert-success ${this.state.blankFields ? 'alert-shown' : 'alert-hidden'}`}
                        onTransitionEnd={() => this.setState({blankFields: false})}
                        >
                        <AlertF type="warning" text="Username or email missing!" popUp={true}/>
                      </div>

                    <div className="popUp__container" >
                            <center className="popUp__title"><h3>Add a new user</h3></center>
                                
                        </div>
                        <div className="popUp__input">
                            <h4 style={{fontWeight:"bold"}}>Email</h4>
                            
                        </div>
                        
                        <div className="popUp__input">
                            <input type="text" placeholder="Email" id="email"className="popUp__input__text" value={this.state.email} onChange={(e) => this.setState({email: e.target.value})} ></input>
                            <select className="popUp_input_select" name="select" onChange={(e) => this.setState({selected: e.target.value})} value={this.state.selected}>
                                <option value="@technipenergies.com" selected>@technipenergies.com</option>
                                <option value="@external.technipenergies.com">@external.technipenergies.com</option>
                                <option value="@tipiel.com.co">@tipiel.com.co</option>
                            </select>
                        </div>
                        <div className="popUp__input">
                            <h4 style={{fontWeight:"bold"}}>Roles</h4>
                            
                        </div>
                        <div className="checkbox__container">
                            <div className="popUp__input__checkbox__group">
                                <div className="checkbox">
                                    <input type="checkbox" name="DES" value="DES" className="popUp__input__checkbox" onChange={(e) => this.setState({des: e.target.checked})} checked={this.state.des}/>
                                    <label for="DES" className="popUp__input__checkbox__label">Design</label>          
                                </div>    
                                <div className="checkbox">
                                    <input type="checkbox" name="MAT" value="MAT" className="popUp__input__checkbox" onChange={(e) => this.setState({mat: e.target.checked})} checked={this.state.mat}/>  
                                    <label for="MAT" className="popUp__input__checkbox__label">Materials</label>
                                </div>
                                <div className="checkbox">
                                    <input type="checkbox" name="3D" value="3D" className="popUp__input__checkbox" onChange={(e) => this.setState({adm: e.target.checked})} checked={this.state.adm}/>  
                                    <label for="3D" className="popUp__input__checkbox__label">3DAdmin</label>
                                </div>
                            </div>
                        </div> 
                        {/*
                        <div className="checkbox__container">
                            <div className="popUp__input__checkbox__group">
                                <div className="checkbox">
                                    <input type="checkbox" name="DES" value="DES" className="popUp__input__checkbox" onChange={(e) => this.setState({des: e.target.checked})} checked={this.state.des}/>
                                    <label for="DES" className="popUp__input__checkbox__label">Design</label>          
                                </div>               
                                <div className="checkbox">
                                    <input type="checkbox" name="STR" value="STR" className="popUp__input__checkbox" onChange={(e) => this.setState({str: e.target.checked})} checked={this.state.str}/>  
                                    <label for="STR" className="popUp__input__checkbox__label">Stress</label>
                                </div>
                                <div className="checkbox">
                                    <input type="checkbox" name="SUP" value="SUP" className="popUp__input__checkbox" onChange={(e) => this.setState({sup: e.target.checked})} checked={this.state.sup}/>                        
                                    <label for="SUP" className="popUp__input__checkbox__label">Supports</label>
                                </div>
                                <div className="checkbox">
                                    <input type="checkbox" name="MAT" value="MAT" className="popUp__input__checkbox" onChange={(e) => this.setState({mat: e.target.checked})} checked={this.state.mat}/>  
                                    <label for="MAT" className="popUp__input__checkbox__label">Materials</label>
                                </div>
                                <div className="checkbox">
                                    <input type="checkbox" name="ISS" value="ISS" className="popUp__input__checkbox" onChange={(e) => this.setState({iss: e.target.checked})} checked={this.state.iss}/>  
                                    <label for="ISS" className="popUp__input__checkbox__label">Issuer</label>
                                </div>
                                
                                <div className="checkbox">
                                    <input type="checkbox" name="REV" value="REV" className="popUp__input__checkbox" onChange={(e) => this.setState({rev: e.target.checked})} checked={this.state.rev}/>  
                                    <label for="REV" className="popUp__input__checkbox__label">Review</label>
                                </div>
                                <div className="checkbox">
                                    <input type="checkbox" name="PRJ" value="PRJ" className="popUp__input__checkbox" onChange={(e) => this.setState({prj: e.target.checked})} checked={this.state.prj}/>  
                                    <label for="PRJ" className="popUp__input__checkbox__label">Project</label>
                                </div>
                                
                            </div>
                            <div className="popUp__input__checkbox__group">
                                <div className="checkbox">
                                    <input type="checkbox" name="role" value="LDE" className="popUp__input__checkbox" onChange={(e) => this.setState({lde: e.target.checked})} checked={this.state.lde}/>     
                                    <label for="LDE" className="popUp__input__checkbox__label">Design Lead</label>
                                </div>
                                <div className="checkbox">
                                    <input type="checkbox" name="role" value="LST" className="popUp__input__checkbox" onChange={(e) => this.setState({lst: e.target.checked})} checked={this.state.lst}/>  
                                    <label for="LST" className="popUp__input__checkbox__label">Stress Lead</label>        
                                </div>
                                <div className="checkbox">               
                                    <input type="checkbox" name="role" value="LSP" className="popUp__input__checkbox" onChange={(e) => this.setState({lsp: e.target.checked})} checked={this.state.lsp}/>  
                                    <label for="LSP" className="popUp__input__checkbox__label">Supports Lead</label>
                                </div>
                                <div className="checkbox">
                                    <input type="checkbox" name="role" value="LOS" className="popUp__input__checkbox" onChange={(e) => this.setState({los: e.target.checked})} checked={this.state.los}/>  
                                    <label for="LOS" className="popUp__input__checkbox__label">Speciality Lead</label>
                                </div>
                                <div className="checkbox">
                                    <input type="checkbox" name="PRO" value="PRO" className="popUp__input__checkbox" onChange={(e) => this.setState({pro: e.target.checked})} checked={this.state.pro}/>  
                                    <label for="PRO" className="popUp__input__checkbox__label">Process</label>
                                </div>
                                <div className="checkbox">
                                    <input type="checkbox" name="INS" value="INS" className="popUp__input__checkbox" onChange={(e) => this.setState({ins: e.target.checked})} checked={this.state.ins}/>  
                                    <label for="INS" className="popUp__input__checkbox__label">Instrumentation</label>
                                </div>
                                <div className="checkbox">
                                    <input type="checkbox" name="3D" value="3D" className="popUp__input__checkbox" onChange={(e) => this.setState({adm: e.target.checked})} checked={this.state.adm}/>  
                                    <label for="3D" className="popUp__input__checkbox__label">3DAdmin</label>
                                </div>
                            </div>
                            
                        </div>
                        */}
                        <div className="popUp__buttons__container__users">
                            <button class="btn btn-sm btn-success" onClick={() => this.addUser()} style={{marginRight:"5px", fontSize:"16px"}}>Add user</button>
                            <button class="btn btn-sm btn-danger" onClick={() => this.closeModal()} style={{marginLeft:"5px", fontSize:"16px"}}>Cancel</button>
                        </div>
                    </Modal>
                </div>
            </section>
        );
    }
}