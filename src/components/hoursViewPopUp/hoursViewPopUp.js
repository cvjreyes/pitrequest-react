import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import "./hoursViewPopUp.css"

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

export default class HoursViewPopUp extends Component { //PopUp que muestra las observaciones de una incidencia
    constructor(props) {
        super(props);
        this.state = {
            visible : false,
            hours: this.props.hours,
            hoursFull: false,
            updateData: this.props.updateData
        }
        this.id = props.id;
    }

    async openModal() {  
        
        this.setState({
            visible : true,
            hours: this.props.hours
        });

    }

    closeModal() {
        this.setState({
            visible : false,
            hours: ""
        });
    }

    componentDidMount(){
        if(this.state.hours === null){
            this.setState({hoursFull: false })
        }else {
            this.setState({hoursFull: true })
        }
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps !== this.props){
            if(this.state.hours === null){
                this.setState({hoursFull: false })
            }else {
                this.setState({hoursFull: true })
            }
        }
    }

    render() {

        let horasMostradas = 0

        if(this.state.hours !== null) {
            horasMostradas = this.state.hours
        }
        return (
            <section>
                <button value="hours" className={`btn__hours__details ${this.state.hoursFull ? 'hours__full' : 'hours__empty'}`} onClick={() => this.openModal()}>View</button>                
                <div>
                    <Modal visible={this.state.visible} width="400" height="150" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                        <div className="popUp__container" >
                            <center  className="title__popUp">Hours</center>          
                        </div>
                        <div className="selector__container__hours__view">
                        
                            <textarea readOnly className='textarea__hours' value={"The total hours to complete: " + horasMostradas} id="textarea" >

                            </textarea>                                
                        </div>
                    </Modal>
                </div>
            </section>
            
        );
    }
}