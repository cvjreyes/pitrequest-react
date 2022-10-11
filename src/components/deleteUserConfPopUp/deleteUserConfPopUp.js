import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import './deleteUserConfPopUp.css'


export default class DeleteUserConfPopUp extends Component { //Pop up para eliminar un user
    constructor(props) {
        super(props);
        this.state = {
            visible : false,
        }
        
    }

   
    async openModal() {      
        
        this.setState({
            visible : true,
        });
    }

    closeModal() {
        this.setState({
            visible : false,
        });
    }

    deleteUser(){
        this.props.deleteUser(this.props.id)
        this.closeModal()
    }


    render() {
        return (
            <section >
                <input type="button"  value="DELETE" className="btn"  style={{padding:"2px 5px 2px 5px", marginRight:"5px", marginLeft:"5px", width:"70px", fontSize:"12px", float:"right", backgroundColor:"#DC143C", color:"white"}} onClick={() => this.openModal()} />
                <div>
                    <Modal visible={this.state.visible} width="450" height="250" effect="fadeInUp" onClickAway={() => this.closeModal()}>

                    <div className="popUp__container" >
                            <center className="title__popUp__role">Are you sure you want to delete {this.props.username}?</center>
                                
                        </div> 

                        <div className="popUp__buttons__container__manage">
                            <button class="btn__delete" onClick={() => this.deleteUser()} >Delete</button>
                            <button class="btn__cancel" onClick={() => this.closeModal()} >Cancel</button>
                        </div>
                    </Modal>
                </div>
            </section>
        );
    }
}