import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import '../uploadReportPopUp/uploadReportPopUp.css'

export default class UploadDrawingPopUp extends Component {
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
        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/uploadDrawing", {
            method: 'POST',
            body: file,
            })
            .then(response =>{
                if (response.status !== 200){
                }else{
                    const body = {
                        description_plan_code: this.props.description_plan_code,
                        filename: fileName
                      }
                  
                      const options = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(body)
                    }
                    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/uploadDrawingDB", options)
                    .then(response => response.json())
                    .then(json=>{
                        if(json.success){
                            this.props.updateDataMethod()
                            this.props.uploadDrawingSuccess()
                        }else{
                            this.props.drawingUploadError()
                        }
                    }) 
                    this.setState({
                        file: null,
                        error: false
                    })
                }
 
            })

        this.closeModal()
    }

    render() {
        return (
            <section>
                <input type="button"  value="UPLOAD" class="update__btn btn-sm btn-info"  onClick={() => this.openModal()} />
                <div>
                    <Modal visible={this.state.visible} width="650" height="180" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                        <div className="popUp__container" >
                            <center className="popUp__title"><h2>Upload your drawing for {this.props.description_plan_code}</h2></center>
                                
                        </div>
                        <div className="select__container">

                            <input type="file" accept=".pdf,.png" name="fileToUpload" id="fileToUpload" onChange={this.handleChange}/>
                            <button style={{marginLeft:"10px"}} className="btn btn-sm btn-success" onClick={()=>this.uploadReport()}>Submit</button>
                            
                        </div> 

                        
                    </Modal>
                </div>
            </section>
        );
    }
}