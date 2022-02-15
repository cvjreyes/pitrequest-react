import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import { Link } from 'react-router-dom';

export default class QtrackerNVNSpecPopUp extends Component {
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
                this.setState({attachComponent:<tr className="specs__row">                   
                <td style={{border: "0.28px solid #D2D2D2", width:"150px", verticalAlign:"middle", textAlign:"center", borderRadius:"0px 0px 0px 5px"}}>
                    <p className="specs__spec__text">ATTACH</p>
                </td>
                <td style={{border: "0.28px solid #D2D2D2", width:"465px", verticalAlign:"middle", borderRadius:"0px 0px 5px 0px"}}>
                    <p className="specs__description__text"> <Link onClick={() => this.getAttach(json.filename)}>{json.filename}</Link></p>
                </td>              
                </tr>})

                this.setState({descriptionComponent: <tr className="specs__row">                   
                <td style={{border: "0.28px solid #D2D2D2", width:"150px", verticalAlign:"middle", textAlign:"center"}}>
                    <p className="specs__spec__text">DESCRIPTION</p>
                </td>
                <td style={{border: "0.28px solid #D2D2D2", width:"465px", verticalAlign:"middle"}}>
                    <p className="specs__description__text">{this.props.description}</p>
                </td>              
                </tr>  })
                
            }else{
                this.setState({descriptionComponent: <tr className="specs__row">                   
                <td style={{border: "0.28px solid #D2D2D2", width:"150px", verticalAlign:"middle", textAlign:"center", borderRadius:"0px 0px 0px 5px"}}>
                    <p className="specs__spec__text">DESCRIPTION</p>
                </td>
                <td style={{border: "0.28px solid #D2D2D2", width:"465px", verticalAlign:"middle", borderRadius:"0px 0px 5px 0px"}}>
                    <p className="specs__description__text">{this.props.description}</p>
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
                    <Modal visible={this.state.visible} width="700" height="400" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                    <br></br>
                    <center className="popUp__title"><h3><strong>{this.props.incidence_number}</strong></h3></center>
                    
                    <table className="specs__container">
                        <tr className="specs__row">                   
                        <td style={{border: "0.28px solid #D2D2D2", width:"150px", verticalAlign:"middle", textAlign:"center", borderRadius:"5px 0px 0px 0px"}}>
                            <p className="specs__spec__text">NAME</p>
                        </td>
                        <td style={{border: "0.28px solid #D2D2D2", width:"465px", verticalAlign:"middle", borderRadius:"0px 5px 0px 0px"}}>
                            <p className="specs__description__text">{this.props.name}</p>
                        </td>              
                        </tr>

                        {this.state.descriptionComponent} 
                        {this.state.attachComponent}
                    </table>            
                                
                    </Modal>
                </div>
            </div>
        );
    }
}