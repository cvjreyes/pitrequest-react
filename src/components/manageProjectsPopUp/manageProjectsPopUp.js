import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import './manageProjectsPopUp.css'
import AlertF from "../alert/alert"

export default class ManageRolesPopUp extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            visible : false,
            visibleSelectAll: false,
            visibleUnselectAll: false,
            currentRoles: this.props.roles,
            id : this.props.id,
            username : "",
            projectsList: [],
            projectsID: {},
            selectAllProjects: {},
            unselectAllProjects: {},
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
                    let selectAllProjects = {}
                    let unselectAllProjects = {}

                    for(let i = 0; i < projects.length; i++){
                        selectAllProjects[projects[i].id]=true
                        unselectAllProjects[projects[i].id]=false
                        if(user_projects.indexOf(projects[i].id) > -1){
                            projectsID[projects[i].id] = true
                            projectsList.push(<div style={{textAlign:"left", marginLeft:"70px"}}>
                                                <input 
                                                    defaultChecked={true} 
                                                    type="checkbox"
                                                    name={projects[i].name} 
                                                    value={projects[i].id} 
                                                    id={projects[i].id} 
                                                    onChange={(e) => this.checkProject(projects[i].id) }/>
                                                <label 
                                                    for={projects[i].name} 
                                                    className="popUp__input__checkbox__label__projects">{projects[i].name}
                                                </label>
                                            </div> )
                        }else{
                            projectsID[projects[i].id] = false
                            projectsList.push(<div style={{textAlign:"left", marginLeft:"70px"}}>
                                                <input 
                                                    type="checkbox" 
                                                    name={projects[i].name} 
                                                    value={projects[i].id} id={projects[i].id} 
                                                    onChange={(e) => this.checkProject(projects[i].id) }/>
                                                <label 
                                                    for={projects[i].name} 
                                                    className="popUp__input__checkbox__label__projects">{projects[i].name}
                                                </label>
                                            </div> )
                        }
                        
                    }
                    this.setState({projectsList: projectsList, projectsID: projectsID, selectAllProjects: selectAllProjects, unselectAllProjects: unselectAllProjects})
                })

            }
            
        })
    
        
        this.setState({
            visible : true,
            projectsList: [],
            projectsID: {},
            selectAllProjects: {},
            unselectAllProjects: {}
        });
    }

    openModalSelectAll() {
        this.setState({
            visibleSelectAll : true,
        });
    }

    openModalUnselectAll() {
        this.setState({
            visibleUnselectAll : true,
        });
    }
    closeModal() {
        this.setState({
            visible : false,
            email : "",
            username : "",
        });
    }
    
    closeModalSelectAll() {
        this.setState({
            visibleSelectAll : false,
        });
    }

    closeModalUnselectAll() {
        this.setState({
            visibleUnselectAll : false,
        });
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

    selectAllProjects(){
        let projects = []
        Object.entries(this.state.selectAllProjects).map( ([key, value]) => {
            if(value){
                projects.push(key)
            }
        } )
        
        this.props.submitProjects(this.props.id, projects)
        this.closeModal()
        this.closeModalSelectAll()
    }

    unselectAllProjects(){
        let projects = []
        Object.entries(this.state.unselectAllProjects).map( ([key, value]) => {
            if(value){
                projects.push(key)
            }
        } )
        
        this.props.submitProjects(this.props.id, projects)
        this.closeModal()
        this.closeModalUnselectAll()
    }

    async checkProject(projectID){
        let auxProjectsID = this.state.projectsID
        auxProjectsID[projectID] = !auxProjectsID[projectID]
        await this.setState({projectsID : auxProjectsID})
    }


    render() {
        return (
            <section >
                <input type="button"  value="PROJECTS" className="btn"  style={{padding:"2px 5px 2px 5px", marginRight:"5px", marginLeft:"5px", width:"80px", fontSize:"12px", float:"right", backgroundColor:"#78B28A", color:"white"}} onClick={() => this.openModal()} />
                <div>
                    <Modal visible={this.state.visible} width="500" height="600" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                        <div
                            className={`alert alert-success ${this.state.blankFields ? 'alert-shown' : 'alert-hidden'}`}
                            onTransitionEnd={() => this.setState({blankFields: false})}>
                                <AlertF type="warning" text="Username or email missing!" popUp={true}/>
                        </div>
                        <div className="popUp__container" >
                            <center className="title__popUp" style={{marginLeft: "15px"}}>Manage Projects</center>
                        </div>
                        <div className='container__select__all'>
                            <button style={{fontSize:"20px"}} className="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne" onClick={() => this.openModalSelectAll()}>Select All</button>
                            <button style={{fontSize:"20px"}} className="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne" onClick={() => this.openModalUnselectAll()}>Unselect All</button>
                        </div>
                        <div className="project__manager__container">
                            {this.state.projectsList}
                        </div>
                        <div className="popUp__buttons__container__manage__projects2">
                            <button className="btn__submit" onClick={() => this.submitProjects()}>Submit</button>
                            <button className="btn__cancel" onClick={() => this.closeModal()}>Cancel</button>
                        </div>
                    </Modal>
                </div>
                <div>
                    <Modal visible={this.state.visibleSelectAll} width="450" height="160" effect="fadeInUp" onClickAway={() => this.closeModalSelectAll()}>
                        <div className="popUp__container" style={{marginTop:"2%"}}>
                            <center className="title__popUp__all">Are you sure you want to <b>SELECT</b> all projects?</center>
                        </div> 
                        <div className="popUp__buttons__container__manage">
                            <button className="btn__delete" onClick={() => this.selectAllProjects()} >Yes</button>
                            <button className="btn__cancel" onClick={() => this.closeModalSelectAll()} >No</button>
                        </div>
                    </Modal>
                </div>
                <div>
                    <Modal visible={this.state.visibleUnselectAll} width="450" height="160" effect="fadeInUp" onClickAway={() => this.closeModalUnselectAll()}>
                        <div className="popUp__container" style={{marginTop:"2%"}}>
                            <center className="title__popUp__all">Are you sure you want to <b>UNSELECT</b> all projects?</center>
                        </div> 
                        <div className="popUp__buttons__container__manage">
                            <button className="btn__delete" onClick={() => this.unselectAllProjects()} >Yes</button>
                            <button className="btn__cancel" onClick={() => this.closeModalUnselectAll()} >No</button>
                        </div>
                    </Modal>
                </div>
            </section>
        );
    }
}