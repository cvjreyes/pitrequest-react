import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import './manageRolesPopUp.css'
import AlertF from "../../components/alert/alert"


export default class ManageRolesPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible : false,
            currentRoles: this.props.roles,
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
            prj: false,
            adm: false,
            blankFields: false,
            selected: "@technipenergies.com",
            selectedRolesLeft: null,
            selectedRolesRight: null
        }
        
    }

   
    async openModal() {      

        console.log(this.props.roles)
        let selectedLeft = []

        if(this.props.roles.indexOf("Design") > -1){
            await this.setState({des: true})
            selectedLeft.push(<div className="checkbox">
                <input defaultChecked={this.state.des} type="checkbox" name="DES" value="DES" className="popUp__input__checkbox" onChange={(e) => this.setState({des: e.target.checked})}/>
                <label for="DES" className="popUp__input__checkbox__label">Design</label>          
            </div>)
        }else{
            selectedLeft.push(<div className="checkbox">
                <input type="checkbox" name="DES" value="DES" className="popUp__input__checkbox" onChange={(e) => this.setState({des: e.target.checked})}/>
                <label for="DES" className="popUp__input__checkbox__label">Design</label>          
            </div>)
        }
        /*
        if(this.props.roles.indexOf("Stress") > -1){
            await this.setState({str: true})
            selectedLeft.push(<div className="checkbox">
                <input defaultChecked={this.state.str} type="checkbox" name="STR" value="STR" className="popUp__input__checkbox" onChange={(e) => this.setState({str: e.target.checked})}/>  
                <label for="STR" className="popUp__input__checkbox__label">Stress</label>
            </div>)
        }else{
            selectedLeft.push(<div className="checkbox">
                <input type="checkbox" name="STR" value="STR" className="popUp__input__checkbox" onChange={(e) => this.setState({str: e.target.checked})}/>  
                <label for="STR" className="popUp__input__checkbox__label">Stress</label>
            </div>)
        }

        if(this.props.roles.indexOf("Supports") > -1){
            await this.setState({sup: true})
            selectedLeft.push(<div className="checkbox">
                <input defaultChecked={this.state.sup} type="checkbox" name="SUP" value="SUP" className="popUp__input__checkbox" onChange={(e) => this.setState({sup: e.target.checked})}/>                        
                <label for="SUP" className="popUp__input__checkbox__label">Supports</label>
            </div>)
        }else{
            selectedLeft.push(<div className="checkbox">
                <input type="checkbox" name="SUP" value="SUP" className="popUp__input__checkbox" onChange={(e) => this.setState({sup: e.target.checked})}/>                        
                <label for="SUP" className="popUp__input__checkbox__label">Supports</label>
            </div>)
        }
        */

        if(this.props.roles.indexOf("Materials") > -1){
            await this.setState({mat: true})
            selectedLeft.push(<div className="checkbox">
                <input defaultChecked={this.state.mat} type="checkbox" name="MAT" value="MAT" className="popUp__input__checkbox" onChange={(e) => this.setState({mat: e.target.checked})}/>  
                <label for="MAT" className="popUp__input__checkbox__label">Materials</label>
            </div>)
        }else{
            selectedLeft.push(<div className="checkbox">
                <input type="checkbox" name="MAT" value="MAT" className="popUp__input__checkbox" onChange={(e) => this.setState({mat: e.target.checked})}/>  
                <label for="MAT" className="popUp__input__checkbox__label">Materials</label>
            </div>)
        }
        /*
        if(this.props.roles.indexOf("Issuer") > -1){
            await this.setState({iss: true})
            selectedLeft.push(<div className="checkbox">
                <input defaultChecked={this.state.iss} type="checkbox" name="ISS" value="ISS" className="popUp__input__checkbox" onChange={(e) => this.setState({iss: e.target.checked})}/>  
                <label for="ISS" className="popUp__input__checkbox__label">Issuer</label>
            </div>)
        }else{
            selectedLeft.push(<div className="checkbox">
                <input type="checkbox" name="ISS" value="ISS" className="popUp__input__checkbox" onChange={(e) => this.setState({iss: e.target.checked})}/>  
                <label for="ISS" className="popUp__input__checkbox__label">Issuer</label>
            </div>)
        }

        if(this.props.roles.indexOf("Review") > -1){
            await this.setState({rev: true})
            selectedLeft.push(<div className="checkbox">
                <input  type="checkbox" name="REV" value="REV" className="popUp__input__checkbox" onChange={(e) => this.setState({rev: e.target.checked})} defaultChecked={this.state.rev}/>  
                <label for="REV" className="popUp__input__checkbox__label">Review</label>
            </div>)
        }else{
            selectedLeft.push(<div className="checkbox">
                <input type="checkbox" name="REV" value="REV" className="popUp__input__checkbox" onChange={(e) => this.setState({rev: e.target.checked})}/>  
                <label for="REV" className="popUp__input__checkbox__label">Review</label>
            </div>)
        }

        if(this.props.roles.indexOf("Project") > -1){
            await this.setState({prj: true})
            selectedLeft.push(<div className="checkbox">
                <input  type="checkbox" name="PRJ" value="PRJ" className="popUp__input__checkbox" onChange={(e) => this.setState({prj: e.target.checked})} defaultChecked={this.state.prj}/>  
                <label for="PRJ" className="popUp__input__checkbox__label">Project</label>
            </div>)
        }else{
            selectedLeft.push(<div className="checkbox">
                <input type="checkbox" name="PRJ" value="PRJ" className="popUp__input__checkbox" onChange={(e) => this.setState({prj: e.target.checked})}/>  
                <label for="PRJ" className="popUp__input__checkbox__label">Project</label>
            </div>)
        }
        */
        this.setState({selectedRolesLeft: selectedLeft})

        let selectedRight = []
        /*
        if(this.props.roles.indexOf("DesignLead") > -1){
            await this.setState({lde: true})
            selectedRight.push(<div className="checkbox">
                <input defaultChecked={this.state.lde} type="checkbox" name="role" value="LDE" className="popUp__input__checkbox" onChange={(e) => this.setState({lde: e.target.checked})}/>     
                <label for="LDE" className="popUp__input__checkbox__label">Design Lead</label>
            </div>)
        }else{
            selectedRight.push(<div className="checkbox">
                <input type="checkbox" name="role" value="LDE" className="popUp__input__checkbox" onChange={(e) => this.setState({lde: e.target.checked})}/>     
                <label for="LDE" className="popUp__input__checkbox__label">Design Lead</label>
            </div>)
        }

        if(this.props.roles.indexOf("StressLead") > -1){
            await this.setState({lst: true})
            selectedRight.push( <div className="checkbox">
                <input type="checkbox" name="role" value="LST" className="popUp__input__checkbox" onChange={(e) => this.setState({lst: e.target.checked})} defaultChecked={this.state.lst}/>  
                <label for="LST" className="popUp__input__checkbox__label">Stress Lead</label>        
            </div>)
        }else{
            selectedRight.push( <div className="checkbox">
                <input type="checkbox" name="role" value="LST" className="popUp__input__checkbox" onChange={(e) => this.setState({lst: e.target.checked})}/>  
                <label for="LST" className="popUp__input__checkbox__label">Stress Lead</label>        
            </div>)
        }

        if(this.props.roles.indexOf("SupportsLead") > -1){
            await this.setState({lsp: true})
            selectedRight.push(<div className="checkbox">               
                <input type="checkbox" name="role" value="LSP" className="popUp__input__checkbox" onChange={(e) => this.setState({lsp: e.target.checked})} defaultChecked={this.state.lsp}/>  
                <label for="LSP" className="popUp__input__checkbox__label">Supports Lead</label>
            </div>)
        }else{
            selectedRight.push(<div className="checkbox">               
                <input type="checkbox" name="role" value="LSP" className="popUp__input__checkbox" onChange={(e) => this.setState({lsp: e.target.checked})}/>  
                <label for="LSP" className="popUp__input__checkbox__label">Supports Lead</label>
            </div>)
        }

        if(this.props.roles.indexOf("SpecialityLead") > -1){
            await this.setState({los: true})
            selectedRight.push(<div className="checkbox">
                <input type="checkbox" name="role" value="LOS" className="popUp__input__checkbox" onChange={(e) => this.setState({los: e.target.checked})} defaultChecked={this.state.los}/>  
                <label for="LOS" className="popUp__input__checkbox__label">Speciality Lead</label>
            </div>)
        }else{
            selectedRight.push(<div className="checkbox">
                <input type="checkbox" name="role" value="LOS" className="popUp__input__checkbox" onChange={(e) => this.setState({los: e.target.checked})}/>  
                <label for="LOS" className="popUp__input__checkbox__label">Speciality Lead</label>
            </div>)
        }

        if(this.props.roles.indexOf("Process") > -1){
            await this.setState({pro: true})
            selectedRight.push(<div className="checkbox">
                <input type="checkbox" name="PRO" value="PRO" className="popUp__input__checkbox" onChange={(e) => this.setState({pro: e.target.checked})} defaultChecked={this.state.pro}/>  
                <label for="PRO" className="popUp__input__checkbox__label">Process</label>
            </div>)
        }else{
            selectedRight.push(<div className="checkbox">
                <input type="checkbox" name="PRO" value="PRO" className="popUp__input__checkbox" onChange={(e) => this.setState({pro: e.target.checked})}/>  
                <label for="PRO" className="popUp__input__checkbox__label">Process</label>
            </div>)
        }

        if(this.props.roles.indexOf("Instrument") > -1){
            await this.setState({ins: true})
            selectedRight.push(<div className="checkbox">
                <input type="checkbox" name="INS" value="INS" className="popUp__input__checkbox" onChange={(e) => this.setState({ins: e.target.checked})} defaultChecked={this.state.ins}/>  
                <label for="INS" className="popUp__input__checkbox__label">Instrumentation</label>
            </div>)
        }else{
            selectedRight.push(<div className="checkbox">
                <input type="checkbox" name="INS" value="INS" className="popUp__input__checkbox" onChange={(e) => this.setState({ins: e.target.checked})}/>  
                <label for="INS" className="popUp__input__checkbox__label">Instrumentation</label>
            </div>)
        }
        */
        if(this.props.roles.indexOf("3D Admin") > -1){
            await this.setState({adm: true})
            selectedRight.push(<div className="checkbox">
                <input type="checkbox" name="adm" value="adm" className="popUp__input__checkbox" onChange={(e) => this.setState({adm: e.target.checked})} defaultChecked={this.state.adm}/>  
                <label for="adm" className="popUp__input__checkbox__label">3D Admin</label>
            </div>)
        }else{
            selectedRight.push(<div className="checkbox">
                <input type="checkbox" name="adm" value="adm" className="popUp__input__checkbox" onChange={(e) => this.setState({adm: e.target.checked})}/>  
                <label for="adm" className="popUp__input__checkbox__label">3D Admin</label>
            </div>)
        }

        this.setState({selectedRolesRight: selectedRight})
        this.setState({
            visible : true,
        });
    }

    closeModal() {
        this.setState({
            visible : false,
            currentRoles: this.props.roles,
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
            prj: false,
            adm: false,
            blankFields: false,
            selected: "@technipenergies.com"
        });

    }

    submitRoles(){
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
            roles.push("PRJ")
        }
        
        this.props.submitRoles(this.props.id, roles)
        this.closeModal()

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
                <input type="button"  value="ROLES" className="btn"  style={{padding:"2px 5px 2px 5px", marginRight:"5px", marginLeft:"5px", width:"70px", fontSize:"12px", float:"right", backgroundColor:"#17A2B8", color:"white"}} onClick={() => this.openModal()} />
                <div>
                    <Modal visible={this.state.visible} width="450" height="250" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                    <div
                        className={`alert alert-success ${this.state.blankFields ? 'alert-shown' : 'alert-hidden'}`}
                        onTransitionEnd={() => this.setState({blankFields: false})}
                        >
                        <AlertF type="warning" text="Username or email missing!" popUp={true}/>
                      </div>
                    <div className="popUp__container" >
                            <center className="title__popUp">Manage roles</center>
                                
                        </div>
                        
                        <div className="checkbox__container_manage">
                            <div className="popUp__input__checkbox__group__left">
                                {this.state.selectedRolesLeft}
                            </div>
                            <div className="popUp__input__checkbox__group">
                                {this.state.selectedRolesRight}
                            </div>
                            
                        </div>
                        <div className="popUp__buttons__container__manage" style={{marginTop:"30px"}}>
                            <button class="btn__submit" onClick={() => this.submitRoles()}>Submit</button>
                            <button class="btn__cancel" onClick={() => this.closeModal()}>Cancel</button>
                        </div>
                    </Modal>
                </div>
            </section>
        );
    }
}