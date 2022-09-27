import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import './manageProjectsPopUp.css'
import AlertF from "../alert/alert"

export default class ManageRolesPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible : false,
            currentRoles: this.props.roles,
            id : this.props.id,
            username : "",
            projectsList: [],
            projectsID: {}
        }
        
    }

   
    async openModal() { 
        
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }

       
        fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getProjectsByUser/"+this.props.id, options)
        .then(response => response.json())
        .then(json =>{
            if(json.error){

            }else{
                const user_projects = json.projects
                fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getProjects/", options)
                .then(response => response.json())
                .then(json =>{
                    const projects = json.projects
                    let projectsList = []
                    let projectsID = {}
                    for(let i = 0; i < projects.length; i++){
                        if(user_projects.indexOf(projects[i].id) > -1){
                            projectsID[projects[i].id] = true
                            projectsList.push(<div style={{textAlign:"left", marginLeft:"70px"}}><input defaultChecked={true} type="checkbox" name={projects[i].name} value={projects[i].id} id={projects[i].id} onChange={(e) => this.checkProject(projects[i].id)}/>
                            <label for={projects[i].name} className="popUp__input__checkbox__label__projects">{projects[i].name}</label></div> )
                        }else{
                            projectsID[projects[i].id] = false
                            projectsList.push(<div style={{textAlign:"left", marginLeft:"70px"}}><input type="checkbox" name={projects[i].name} value={projects[i].id} id={projects[i].id} onChange={(e) => this.checkProject(projects[i].id)}/>
                            <label for={projects[i].name} className="popUp__input__checkbox__label__projects">{projects[i].name}</label></div> )
                        }
                        
                    }
                    this.setState({projectsList: projectsList, projectsID: projectsID})
                })

            }
        })
    
        this.setState({
            visible : true,
            projectsList: [],
            projectsID: {}
        });
    }

    closeModal() {
        this.setState({
            visible : false,
            email : "",
            username : "",
        });

    }

    async checkProject(projectID){
        let auxProjectsID = this.state.projectsID
        auxProjectsID[projectID] = !auxProjectsID[projectID]
        await this.setState({projectsID : auxProjectsID})
    }

    submitProjects(){
        let projects = []
        Object.entries(this.state.projectsID).map( ([key, value]) => {
            if(value){
                projects.push(key)
            }
        } )
        
        this.props.submitProjects(this.props.id, projects)
        this.closeModal()

    }

    render() {
        return (
            <section >
                <input type="button"  value="PROJECTS" className="btn"  style={{padding:"2px 5px 2px 5px", marginRight:"5px", marginLeft:"5px", width:"80px", fontSize:"12px", float:"right", backgroundColor:"#78B28A", color:"white"}} onClick={() => this.openModal()} />
                <div>
                    <Modal visible={this.state.visible} width="500" height="500" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                    <div
                        className={`alert alert-success ${this.state.blankFields ? 'alert-shown' : 'alert-hidden'}`}
                        onTransitionEnd={() => this.setState({blankFields: false})}
                        >
                        <AlertF type="warning" text="Username or email missing!" popUp={true}/>
                      </div>
                    <div className="popUp__container" >
                            <center className="title__popUp" style={{marginLeft: "15px"}}>Manage Projects</center>
                                
                        </div>
                        <div className="project__manager__container">
                            {this.state.projectsList}
                        </div>
                        <div className="popUp__buttons__container__manage__projects2">
                            <button class="btn__submit" onClick={() => this.submitProjects()}>Submit</button>
                            <button class="btn__cancel" onClick={() => this.closeModal()}>Cancel</button>
                        </div>
                    </Modal>
                </div>
            </section>
        );
    }
}