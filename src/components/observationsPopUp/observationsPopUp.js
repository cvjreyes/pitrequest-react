import React, { Component } from 'react';
import { useState } from 'react';
import Modal from 'react-awesome-modal';
import "./observationsPopUp.css"

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

export default class ObservationsPopUp extends Component { //PopUp que muestra las observaciones de una incidencia y permite cambiarlas
    constructor(props) {
        super(props);
        this.state = {
            visible : false,
            observations: this.props.observations,
            obsFull: false,
            updateData: this.props.updateData
        }
        this.id = props.id;
    }

    async openModal() {  
        
        this.setState({
            visible : true,
            observations: this.props.observations
        });

    }

    closeModal() {
        this.setState({
            visible : false,
            observations: ""
        });
    }

    updateObservations(){
        this.props.updateObservations(this.props.incidence_number, this.state.observations)
        this.closeModal()
    }

    handleChange = async(e) =>{
        await this.setState({observations: e.target.value})
    }

    componentDidMount(){
        if(this.state.observations === null){
            this.setState({obsFull: false })
        }else {
            this.setState({obsFull: true })
        }
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps !== this.props){
            if(this.state.observations === null){
                this.setState({obsFull: false })
            }else {
                this.setState({obsFull: true })
            }
        }
    }

    render() {

        return (
            <section>
                <button value="observations" className={`btn__observation__details ${this.state.obsFull ? 'obs__full' : 'obs__empty'}`} onClick={() => this.openModal()}>Edit</button>                
                <div>
                    <Modal visible={this.state.visible} width="650" height="500" effect="fadeInUp" >
                        <div style={{marginTop:"2%"}} className="popUp__container" >
                            <button
                                type="button"
                                className="btn-close"
                                data-mdb-dismiss="modal"
                                aria-label="Close"
                                onClick={() => this.closeModal()}
                                style={{float: "right", marginRight:"-180px"}}
                                ></button>
                            <center style={{marginLeft:"180px", float: "left"}} className="title__popUp">Observations</center>          
                        </div>
                        <div className="selector__container__obs">
                        
                            <textarea className='textarea__observations__edit' value={this.state.observations} onChange={this.handleChange} id="textarea" >

                            </textarea>
                                
                            <button className="btn__assign__obs" onClick={()=>this.updateObservations()}>Update</button>
                        </div>
                    </Modal>
                </div>
            </section>
            
        );
    }
}