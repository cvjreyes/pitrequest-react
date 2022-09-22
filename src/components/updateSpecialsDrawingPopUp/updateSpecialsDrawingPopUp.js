import React, { Component } from 'react';
import Modal from 'react-awesome-modal';

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

export default class UpdateSpecialsDrawingPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible : false,
            file: null,
            error: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.uploadReport = this.uploadReport.bind(this);
        this.id = props.id;
        
    }
   

    openModal() {      
        this.setState({
            visible : true,
            error: false,
            file: null
        });
    }

    closeModal() {
        document.getElementById("fileToUpload").value = null
        this.setState({
            visible : false,
            file: null,
        });
    }

    async handleChange(event){
        await this.setState({file: event.target.files[0]})
    }

    async uploadReport(){
        const extension = this.state.file.name.split('.').pop();
        const fileName = this.props.description_plan_code + "." + extension
        const file  = new FormData(); 
        file.append('file', this.state.file, fileName);
        
        const body = {
            description_plan_code: this.props.description_plan_code,
            fileName: fileName,
            email: secureStorage.getItem("user")
        }


        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/updateSpecialsDrawingDB", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
            })
            .then(response => response.json())
            .then(async json =>{
                if(json.success){
                    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/updateSpecialsDrawing", {
                        method: 'POST',
                        body: file,
                        })
                        .then(response =>{
                            if (response.status !== 200){
                                this.props.drawingUploadError()
                            }else{
                                this.props.updateDrawingSuccess()
            
                                this.setState({
                                    file: null,
                                    error: false
                                })
                            }
             
                        })
                }else{
                    console.log("error")
                }
            })

        

        this.closeModal()
    }

    render() {
        return (
            <section style={{float:"right"}}>
                <input type="button"  value="UPDATE" class="update__btn btn-sm btn-info"  onClick={() => this.openModal()} />
                <div>
                    <Modal visible={this.state.visible} width="680" height="250" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                        <div className="popUp__container__upload__update" >
                            <center className="popUp__title">Update the drawing for {this.props.description_plan_code}</center>
                                
                        </div>
                        <div className="select__container">

                            <input type="file" accept=".pdf,.png" name="fileToUpload" id="fileToUpload" onChange={this.handleChange}/>
                            <button style={{marginLeft:"10px"}} className="btn__submit__upload__update" onClick={()=>this.uploadReport()}>Submit</button>
                            
                        </div> 

                        
                    </Modal>
                </div>
            </section>
        );
    }
}