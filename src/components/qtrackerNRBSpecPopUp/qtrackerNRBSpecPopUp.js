import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import '../qtrackerISSpecPopUp/qtrackerISSpecPopUp.css'

export default class QtrackerNRBSpecPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible : false,
            content: null,
            attachComponent: null,
            descriptionComponent: null,
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

        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/pdf"
            }
          }
          fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/existsAttach/"+this.props.incidence_number, options)
          .then(response => response.json())
          .then(json =>{
            if(json.filename){
                this.setState({attachComponent:<tr >                   
                <th>
                    <center className="th__text">ATTACH</center>
                </th>
                <td>
                    <center className="td__text__attach"> <a onClick={() => this.getAttach(json.filename)}>{json.filename}</a></center>
                </td>              
                </tr>})

                this.setState({descriptionComponent: <tr >                   
                <th>
                    <center className="th__text">DESCRIPTION</center>
                </th>
                <td >
                    <center className="td__text">{this.props.description}</center>
                </td>              
                </tr>  })
                
            }else{
                this.setState({descriptionComponent: <tr >                   
                <td>
                    <center className="th__text">DESCRIPTION</center>
                </td>
                <td >
                    <center className="td__text" >{this.props.description}</center>
                </td>              
                </tr>  })
            }
          })

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
                <button class="btn btn-info" style={{color:"white", backgroundColor: "#17a2b8", fontSize:"16px", padding:"2px 5px 2px 5px"}} onClick={() => this.openModal()}>Details</button>
                <div>
                    <Modal visible={this.state.visible} width="700" height="800" effect="fadeInUp">

                        <table className="table table-hover" style={{marginLeft: "10px", width: "600px", height: "280px", marginTop: "30px"}}>
                            <thead>
                                <tr>
                                    <th colSpan={2}>
                                        <button
                                        type="button"
                                        class="btn-close"
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
                                <tr>                   
                                    <th>
                                        <center className="th__text">PIPE</center>
                                    </th>
                                    <td >
                                        <center className="td__text">{this.props.pipe}</center>
                                    </td>
                                </tr>

                                {this.state.descriptionComponent} 
                                {this.state.attachComponent}
                            </tbody>

                        </table>            
                                
                    </Modal>
                </div>
            </div>
        );
    }
}