import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import "./observationsViewPopUp.css"

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

export default class ObservationsViewPopUp extends Component { //PopUp que muestra las observaciones de una incidencia
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
                <button value="observations" className={`btn__observation__details ${this.state.obsFull ? 'obs__full' : 'obs__empty'}`} onClick={() => this.openModal()}>View</button>                
                <div>
                    <Modal visible={this.state.visible} width="650" height="500" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                        <div className="popUp__container" >
                            <center style={{marginRight:"-250px"}} className="title__popUp">Observations</center>          
                        </div>
                        <div className="selector__container__obs__view">
                        
                            <textarea readOnly className='textarea__observations' value={this.state.observations} id="textarea" >

                            </textarea>                                
                        </div>
                    </Modal>
                </div>
            </section>
            
        );
    }
}