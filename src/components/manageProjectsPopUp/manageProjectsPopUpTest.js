import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import './manageProjectsPopUp.css'
import AlertF from "../alert/alert"

export default class ManageRolesPopUpTest extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            visible : false,
            currentRoles: this.props.roles,
            id : this.props.id,
            username : "",
            projectsList: [],
            projectsID: {},
            selectAll: false,
            checkedProject: false,
            projectName: [],
            projectId: [],
            projectInfo: {}
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
                    let projectName = []
                    let projectId = []
                    let projectInfo = {}

                    for(let i = 0; i < projects.length; i++){
                        if(user_projects.indexOf(projects[i].id) > -1){
                            projectsID[projects[i].id] = true
                            // console.log("entra");
                            projectName.push(projects[i].name)
                            projectId.push(projects[i].id)
                            projectInfo = {projectId, projectName}
                            projectsList.push(<div style={{textAlign:"left", marginLeft:"70px"}}>
                                                <input 
                                                    defaultChecked={true} 
                                                    type="checkbox"
                                                    name={projects[i].name} 
                                                    value={projects[i].id} 
                                                    id={projects[i].id} 
                                                    //checked={checkedProject }
                                                    onChange={(e) => this.checkProject(projects[i].id) }/>
                                                <label 
                                                    for={projects[i].name} 
                                                    className="popUp__input__checkbox__label__projects">{projects[i].name}
                                                </label>
                                            </div> )
                        }else{
                            projectsID[projects[i].id] = false
                            // console.log("sale");
                            projectName.push(projects[i].name)
                            projectId.push(projects[i].id)
                            projectsList.push(<div style={{textAlign:"left", marginLeft:"70px"}}>
                                                <input 
                                                    type="checkbox" 
                                                    name={projects[i].name} 
                                                    value={projects[i].id} id={projects[i].id} 
                                                    //checked={checkedProject }
                                                    onChange={(e) => this.checkProject(projects[i].id) }/>
                                                <label 
                                                    for={projects[i].name} 
                                                    className="popUp__input__checkbox__label__projects">{projects[i].name}
                                                </label>
                                            </div> )
                        }
                        // console.log("Projects ids: " + projectId);
                        // console.log("Projects names: " + projectName);
                        console.log("Projects info: " + JSON.stringify(projectInfo));
                    }
                
                    this.setState({projectsList: projectsList, projectsID: projectsID, projectId: projectId, projectName: projectName, projectInfo: projectInfo})
                })

            }
            
        })
    
        this.setState({
            visible : true,
            projectsList: [],
            projectsID: {},
        });
    }

    closeModal() {
        this.setState({
            visible : false,
            email : "",
            username : "",
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

    async checkProject(projectID){
        let auxProjectsID = this.state.projectsID
        auxProjectsID[projectID] = !auxProjectsID[projectID]
        await this.setState({projectsID : auxProjectsID})
        console.log("ProjectID: " + projectID);
        console.log("ProjectsID: " + JSON.stringify(this.state.projectsID));
    }

    async handleClickAll(){
        let auxSelectAll = this.state.selectAll
        auxSelectAll = !auxSelectAll
        await this.setState({selectAll : auxSelectAll})
        console.log("SelectAll: " + this.state.selectAll);
    }

    async checkAll(){
        let checkedProject = this.state.checkedProject
        if(this.state.selectAll !== true){
            checkedProject = true
        } else {
            checkedProject = false
        }
        await this.setState({checkedProject : checkedProject})
        console.log("CheckALL: " + JSON.stringify(this.state.checkedProject));
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
                            <div style={{textAlign:"left", marginLeft:"50px"}}>
                                <input 
                                    type="checkbox" 
                                    name="selectall" 
                                    value="selectall" 
                                    id="selectall" 
                                    //checked={this.state.projectsList.filter(project => project?.isChecked === true)} 
                                    onChange={(e) => {this.handleClickAll(); }}/>
                                <label 
                                    for="selectall" 
                                    className="popUp__input__checkbox__label__projects">
                                        <b>Select all</b>
                                </label>
                            </div>
                            {/* {JSON.stringify(this.state.projectInfo).map((projectInfo) => (
                                    <div style={{textAlign:"left", marginLeft:"70px"}}>
                                        <input 
                                            type="checkbox" 
                                            name={projectInfo.projectName} 
                                            value={projectInfo.projectId} 
                                            id={projectInfo.projectId} 
                                            //onChange={(e) => this.checkProject(projectInfo.projectId) }
                                        />
                                        <label 
                                            for={projectInfo.projectName} 
                                            className="popUp__input__checkbox__label__projects">{projectInfo.projectName}
                                        </label>
                                    </div>
                                ))
                            } */}
                            {/* {this.state.projectsList} */}
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