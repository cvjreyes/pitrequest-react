import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import '../qtrackerISSpecPopUp/qtrackerISSpecPopUp.css'


export default class QtrackerNRIDSSpecPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible : false,
            content: null,
        }
    }

    getAttach(fileName){

        const options = {
          method: "GET",
          headers: {
              "Content-Type": "application/pdf"
          }
        }
        fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getAttach/"+fileName, options)
        .then(res => res.blob())
        .then(response => {
          const file = new Blob([response], {
            type: "application/pdf"
          });
          //Build a URL from the file
          const fileURL = URL.createObjectURL(file);
          //Open the URL on new Window
          let w = window.open(fileURL);
    
            w.addEventListener("load", function() {
              setTimeout(()=> w.document.title = fileName
              , 300);
    
    
            });
    
            // create <a> tag dinamically
            var fileLink = document.createElement('a');
            fileLink.href = fileURL;
    
            // it forces the name of the downloaded file
            fileLink.download = fileName;
    
            // triggers the click event
            fileLink.click();
    
    
        })
        .catch(error => {
          console.log(error);
        });
      }

    openModal() {

        this.setState({
            visible : true
        });
    }

    closeModal() {
        this.setState({
            visible : false
        });
    }

    render() {
        return (
            <div style={{marginRight:"5px", marginLeft:"5px", float:"left"}}>
                <button className="btn btn-info" style={{color:"white", backgroundColor: "#17a2b8", fontSize:"16px", padding:"2px 5px 2px 5px"}} onClick={() => this.openModal()}>Details</button>
                <div>
                    <Modal visible={this.state.visible} width="700" height="800" effect="fadeInUp">
                    
                    <table className="table table-hover" style={{marginLeft: "50px", width: "600px", height: "80px", marginTop: "30px"}}>
                        <thead>
                            <tr>
                                <th colSpan={2}>
                                        <button
                                        type="button"
                                        className="btn-close"
                                        data-mdb-dismiss="modal"
                                        aria-label="Close"
                                        onClick={() => this.closeModal()}
                                        style={{float:"right"}}
                                        ></button>
                                    <center className="title__popUp" style={{marginLeft: "20px"}}>{this.props.incidence_number}</center>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr >                   
                                <th >
                                    <center className="th__text">NAME</center>
                                </th>
                                <td >
                                    <center className="td__text">{this.props.name}</center>
                                </td>              
                            </tr>
                        </tbody>
                    </table>            
                                
                    </Modal>
                </div>
            </div>
        );
    }
}