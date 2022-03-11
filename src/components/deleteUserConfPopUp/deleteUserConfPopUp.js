import React, { Component } from 'react';
import Modal from 'react-awesome-modal';


export default class DeleteUserConfPopUp extends Component {
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
                    <Modal visible={this.state.visible} width="450" height="200" effect="fadeInUp" onClickAway={() => this.closeModal()}>

                    <div className="popUp__container" >
                            <center className="popUp__title"><h3><strong>Are you sure you want to delete {this.props.username}?</strong></h3></center>
                                
                        </div> 

                        <div className="popUp__buttons__container__manage">
                            <button class="btn btn-sm btn-danger" onClick={() => this.deleteUser()} style={{marginRight:"5px", fontSize:"16px"}}>Delete</button>
                            <button class="btn btn-sm btn-warning" onClick={() => this.closeModal()} style={{marginLeft:"5px", fontSize:"16px"}}>Cancel</button>
                        </div>
                    </Modal>
                </div>
            </section>
        );
    }
}