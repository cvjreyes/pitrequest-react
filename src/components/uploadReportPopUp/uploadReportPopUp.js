import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import './uploadReportPopUp.css'
import readXlsxFile from 'read-excel-file'
import { readString } from 'react-papaparse'

export default class UploadReportPopUp extends Component {
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

    handleChange(event){
        this.setState({file: event.target.files[0]})
    }

    uploadReport(event){
        event.preventDefault()
        this.props.setUploading(true)

        if(this.state.file.name.substring(this.state.file.name.length-4, this.state.file.name.length) === "xlsx"){
            readXlsxFile(this.state.file).then(async(rows) => {
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(rows)
                }
                await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/uploadReport", options)
                .then(response => response.json())
                
            })
        }else{
            let reader = new FileReader();
            reader.onload = async() =>{
                const csv = reader.result
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(readString(csv).data)
                }
                await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/uploadReport", options)
                .then(response => response.json())

            }
            reader.readAsText(this.state.file)
        }
        this.closeModal()
        this.props.setUploading(false)
    }

    render() {
        return (
            <section style={{marginTop:"10px",float:"left"}}>
                <input type="button"  value="Upload dpipes" style={{marginLeft:"10px", height:"150px", width:"150px"}} className="btn btn-bg btn-info"  onClick={() => this.openModal()} />
                <div>
                    <Modal visible={this.state.visible} width="650" height="180" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                        <div className="popUp__container" >
                            <center className="popUp__title"><h1>Upload your report</h1></center>
                                
                        </div>
                        <div className="select__container">
                            <form onSubmit={this.uploadReport}>
                                <input type="file" name="fileToUpload" id="fileToUpload" onChange={this.handleChange}/>
                                <input type="submit" style={{marginLeft:"10px"}} className="btn btn-sm btn-success" value="Upload"/>
                            </form>
                        </div> 

                        
                    </Modal>
                </div>
            </section>
        );
    }
}