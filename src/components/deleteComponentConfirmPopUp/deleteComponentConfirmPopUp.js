import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import Trash from "../../assets/images/Trash.png"
import './deleteComponentConfirmPopUp.css'

export default class DeleteComponentConfirmPopUp extends Component {
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

    deleteComponent(){
        this.props.deleteComponent(this.props.id)
        this.closeModal()
    }


    render() {
        return (
            <section >
                <button className="btn"  style={{height:"40px", width:"40px", position:"absolute", backgroundColor:"#DC143C", color:"white"}} onClick={() => this.openModal()}><img src={Trash} alt="trash" className='delete__component__img'></img></button>
                    
                    {/* Pop up de cuando eliminas el elemento de la libreria */}
                    <Modal visible={this.state.visible} width="450" height="150" effect="fadeInUp" onClickAway={() => this.closeModal()}>

                        <div className="delete__comp__popUp__container" >
                            <center className="delete__comp__title__popUp">Delete {this.props.component}?</center>   
                        </div> 

                        <div className="popUp__buttons__container__manage">
                            <button class="btn__delete" onClick={() => this.deleteComponent()} >Delete</button>
                            <button class="btn__cancel" onClick={() => this.closeModal()} >Cancel</button>
                        </div>

                    </Modal>
                
            </section>
        );
    }
}