import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import AlertF from "../alert/alert"
import "./requestAccessPopUp.css"

export default class RequestAccessPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible : false,
            id : props.id,
            username : "",
            email : "",
            projects: [],
            project: "Select...",
            otherproject: "",
            blankFields: false,
            selected: "@technipenergies.com"
        }
        
    }
   

    openModal() {      
        this.setState({
            visible : true,
        });
    }

    closeModal() {
        this.setState({
            visible : false,
            email : "",
            username : "",
            email : "",
            project: "Select...",
            otherproject: "",
            blankFields: false,
            selected: "@technipenergies.com"
        });
        document.getElementById("projectSelect").value = "Select..."

    }

    async componentDidMount(){
        const options = {
          method: "GET",
          headers: {
              "Content-Type": "application/json"
          }
        }
  
        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getProjects/", options)
          .then(response => response.json())
          .then(async json => {
            let projects = ["Select..."]
            for(let i = 0; i < json.projects.length; i++){
              projects.push(json.projects[i].name)
            }
            this.setState({projects:projects})
          })
      }

    submitRequest(){
        const email = this.state.email + this.state.selected
        if(this.state.email === "" || this.state.email === null || (document.getElementById("projectSelect").value === "Select..." && this.state.otherproject === "")){
            this.setState({
                blankFields: true
            })
        }else{
            this.props.submitRequest(email, document.getElementById("projectSelect").value, this.state.otherproject)
            this.closeModal()
        }   

    }

    handleChangeUsername(event){
        this.setState({username: event.target.value});
    }

    onChange(event){
        this.setState({selected: event.target.value});
    }

    render() {
        return (
            <section >
                <input type="button"  value="Request access" className="request__button" onClick={() => this.openModal()} />
                <div>
                    <Modal visible={this.state.visible} width="650" height="400" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                    <div
                        className={`alert alert-success ${this.state.blankFields ? 'alert-shown' : 'alert-hidden'}`}
                        onTransitionEnd={() => this.setState({blankFields: false})}
                        >
                        <AlertF type="warning" text="Email or project missing!" popUp={true}/>
                      </div>

                    <div className="popUp__container" >
                            <center className="title__popUp__user">Request access</center>
                                
                        </div>
                        <div className="popUp__input">
                            <h4 >Email</h4>
                            
                        </div>
                        
                        <div className="popUp__input">
                            <input type="text" id="email" className="popUp__input__text" value={this.state.email} onChange={(e) => this.setState({email: e.target.value})} style={{fontSize: "18px"}}></input>
                            <select className="popUp_input_select" name="select" onChange={(e) => this.setState({selected: e.target.value})} value={this.state.selected} style={{fontSize: "18px"}}>
                                <option value="@technipenergies.com" selected>@technipenergies.com</option>
                                <option value="@external.technipenergies.com">@external.technipenergies.com</option>
                                <option value="@tipiel.com.co">@tipiel.com.co</option>
                            </select>
                        </div>
                        <div className="popUp__input" style={{marginTop: "25px", marginBottom: "-20px", marginLeft:"3px"}}>
                            <h4>Project</h4>
                            <select id="projectSelect" className="projectSelect" style={{marginLeft:"3px"}}> 
                                {this.state.projects.map(project =>(
                                    <option>{project}</option>
                                ))}
                            </select>
                            <div style={{display: "flex"}}>
                                <label for="otherproject" style={{marginLeft:"3px", marginTop: "3px", fontWeight:"500"}}>Other project: </label>
                                <input type="text" id="otherproject" className="popUp__input__text2" value={this.state.otherproject} onChange={(e) => this.setState({otherproject: e.target.value})} style={{fontSize: "18px"}}></input>

                            </div>
                        </div>
                         
                        
                        <div className="popUp__buttons__container__users2">
                            <button class="btn__addUser" style={{marginLeft:"0px"}} onClick={() => this.submitRequest()}>Submit</button>
                            <button class="btn__cancel__user" onClick={() => this.closeModal()}>Cancel</button>
                        </div>
                    </Modal>
                </div>
            </section>
        );
    }
}