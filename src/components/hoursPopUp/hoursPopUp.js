import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import "./hoursPopUp.css"

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

export default class HoursPopUp extends Component { //PopUp que muestra las horas de una incidencia y permite cambiarlas
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
        console.log("Open Modal: " + this.props.hours);
        console.log("Open Modal state: " + this.state.hours);

    }

    closeModal() {
        this.setState({
            visible : false,
            hours: 0
        });
    }

    updateHours(){
        if(this.state.hours === null || this.state.hours === ""){
            this.props.updateHours(this.props.incidence_number, 0)
        } else {
            this.props.updateHours(this.props.incidence_number, this.state.hours)
        }
        this.closeModal()
    }

    handleChange = async(e) =>{
        await this.setState({hours: e.target.value})
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

        return (
            <section>
                <button value="hours" className={`btn__hours__details ${this.state.hoursFull ? 'hours__full' : 'hours__empty'}`} onClick={() => this.openModal()}>Edit</button>                
                <div>
                    <Modal visible={this.state.visible} width="300" height="200" effect="fadeInUp" >
                        <div style={{marginTop:"2%"}} className="popUp__container__hours" >
                            <button
                                type="button"
                                className="btn-close"
                                data-mdb-dismiss="modal"
                                aria-label="Close"
                                onClick={() => this.closeModal()}
                                style={{float: "right", marginRight:"-15px"}}
                                ></button>
                            <label style={{textAlign: "center"}} className="title__popUp__hours">Hours</label>          
                        </div>
                        <div className="selector__container__hours">
                            <label className='label__hours'>Cambiar hora: </label>
                            <input className='input__hours__edit' value={this.state.hours} onChange={this.handleChange} id="text" />
                            <label style={{marginLeft: "1%"}} className='label__hours'>Horas</label>
                        </div>
                        <button className="btn__assign__hours" onClick={()=>this.updateHours()}>Update</button>
                    </Modal>
                </div>
            </section>
            
        );
    }
}