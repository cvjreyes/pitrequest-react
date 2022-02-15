//Botones de accion que aparecen en cada fase de isotracker para tratar los archivos
import ForceClaimPopUp from '../forceClaimPopUp/forceClaimPopUp';
import ActionExtra from "../../components/actionExtra/actionExtra"
import CancelIso from "../../components/cancelIso/cancelIso"
import HoldComment from '../../components/holdComment/holdComment';
import AddUserPopUp from '../addUserPopUp/addUserPopUp';
import "./actionBtns.css"

const ActionBtns = props =>{
    function assignToUser(username){
        props.forceClaim(username)
    }
    
    function toIssue(transmittal, date){
        props.issue(transmittal, date)
    }

    function returnIso(destiny, comments){
        props.returnIso(destiny, comments)
    }

    function sendHolds(comments){
        props.transaction("On hold",comments)
    }

    function addUser(username, email, roles){
        props.addUser(username, email, roles)
    }

    function exportModelled(){
        props.exportModelled()
    }

    function exportNotModelled(){
        props.exportNotModelled()
    }

    function exportFull(){
        props.exportFull()
    }

    function exportLineIdGroup(){
        props.exportLineIdGroup()
    }

    function exportHolds(){
        props.exportHolds()
    }

    function exportHoldsNoProgress(){
        props.exportHoldsNoProgress()
    }

    function downloadBOM(){
        props.downloadBOM()
    }
    
    function exportTimeTrack(){
        props.exportTimeTrack()
    }

    var actionBtn1, actionBtn2, actionBtn3, actionBtn4, actionBtn5, actionBtn6, actionBtn7, actionBtn8, actionBtn9, actionBtn10, actionBtn11, actionBtn12
    if(props.onlyDownload){
        if(props.role === "SpecialityLead" || props.role === "DesignLead"){
            actionBtn6 = <button className="action__btn" name="destination" value="stress" onClick={() => props.transaction("Recycle bin")}>Delete</button>
            if(process.env.REACT_APP_PROGRESS === "0"){
                actionBtn7 = <HoldComment sendHolds={sendHolds.bind(this)}/>
            }
        }
        actionBtn11 = <button className="action__btn"  name="destination" value="stress" onClick={() => props.downloadFiles()}>Download</button>
    }else{
        
        if (props.currentTab !== "My Tray" && props.currentTab !== "Recycle bin" && props.currentTab !== "On hold"){
            actionBtn11 = <button className="action__btn"  name="destination" value="stress" onClick={() => props.downloadFiles()}>Download</button>
            if (!(props.role === "SpecialityLead" && (props.currentTab === "Process" || props.currentTab === "Instrument")) && props.currentTab !== "Issued"){
                actionBtn1 = <button className="action__btn"  name="destination" value="stress" onClick={() => props.claimClick()}>Claim</button>
            }
            if(props.currentTab === "Issued"){
                
                if(props.role === "SpecialityLead"){
                    actionBtn1 = <button className="action__btn" name="newrev" value="newrev" onClick={() => props.newRev()}>New Rev</button>
                }else if(props.role === "Design" || props.role === "DesignLead"){
                    actionBtn1 = <button className="action__btn" name="newrev" value="newrev" onClick={() => props.request()}>Request</button>
                }
            }
    
        }if (props.currentTab === "My Tray"){
            actionBtn1 = <button className="action__btn" name="destination" value="stress" onClick={() => props.unclaimClick()}>Unclaim</button>
            actionBtn11 = <button className="action__btn" name="destination" value="stress" onClick={() => props.downloadFiles()}>Download</button>
            if(props.role !== "Design" && props.role !== "DesignLead" && props.role !== "Process" && props.role !== "Instrument" && props.role !== "StressLead" && props.role !== "SupportsLead" ){
                if(props.role === "Stress"){
                    actionBtn2 = <button className="action__btn" onClick={() => props.returnIso("Design","")}>Design</button>
                }else{
                    actionBtn2 = <CancelIso returnIso={returnIso.bind(this)} role={props.role}/>
                }
            }
            
            if(props.role === "DesignLead" || props.role === "SupportsLead"){
                actionBtn9 = <button className="action__btn" name="destination" value="stress" onClick={() => props.transaction("Materials")}>Materials</button>
            }if(props.role === "Materials"){
                actionBtn5 = <button className="action__btn" name="destination" value="stress" onClick={() => props.transaction("Issuer")}>Issuer</button>
            }if(props.role === "Issuer"){
                actionBtn5 = <button className="action__btn" name="destination" value="stress" onClick={() => props.transaction("LDE/Isocontrol")}>LOS/Isoctrl</button>
            }
            if(process.env.REACT_APP_IFC === "0"){
                if (props.role !== "Stress" && props.role !== "StressLead" && props.role !== "Materials" && props.role !== "Issuer" && props.role !== "SpecialityLead"){
                    actionBtn3 = <button className="action__btn" onClick={() => props.transaction("Stress")}>Stress</button>
                } if (props.role !== "Supports" && props.role !== "SupportsLead" && props.role !== "Materials" && props.role !== "Issuer" && props.role !== "SpecialityLead"){
                    actionBtn4 = <button className="action__btn" onClick={() => props.transaction("Supports")}>Support</button>
                }
                if(props.role !== "DesignLead" && props.role !== "StressLead" && props.role !== "SupportsLead" && props.role !== "Process" && props.role !== "Instrument"){
                    actionBtn5= <button className="action__btn" name="destination" value="stress" onClick={() => props.verifyClick()}>Verify</button>
                }
                if(props.role === "Supports"){
                    actionBtn6 = actionBtn5
                    actionBtn5 = <button className="action__btn" name="destination" value="stress" onClick={() => props.transaction("Materials")}>Materials</button>
                }if(props.role === "Materials"){
                    actionBtn5 = <button className="action__btn" name="destination" value="stress" onClick={() => props.transaction("Issuer")}>Issuer</button>
                }if(props.role === "Issuer"){
                    actionBtn5 = <button className="action__btn" name="destination" value="stress" onClick={() => props.transaction("LDE/Isocontrol")}>LOS/Isoctrl</button>
                }

            }else{
                if(props.role === "DesignLead"){
                    actionBtn3 = <button className="action__btn" onClick={() => props.transaction("Stress")}>Stress</button>
                    actionBtn4 = <button className="action__btn" onClick={() => props.transaction("Supports")}>Support</button>     
                }else if(props.role === "Stress"){
                    actionBtn5= <button className="action__btn"  name="destination" value="stress" onClick={() => props.verifyClick()}>Verify</button>
                    actionBtn3 = <button class="action__btn" onClick={() => props.transaction("Supports")}>Supports</button>
                }else if(props.role === "Supports"){
                    actionBtn5= <button className="action__btn" name="destination" value="stress" onClick={() => props.verifyClick()}>Verify</button>
                    actionBtn3 = <button className="action__btn" onClick={() => props.returnIso("Stress", "")}>Stress</button>
                }else if(props.role === "SupportsLead"){
                    actionBtn3 = <button className="action__btn" onClick={() => props.returnIso("Supports", "")}>Supports</button>

                }else if (props.role !== "Process" && props.role !== "Instrument" && props.role !== "StressLead" && props.role !== "SupportsLead" && props.role !== "Materials" && props.role !== "Issuer"){
                    actionBtn3 = <button className="action__btn" name="destination" value="stress" onClick={() => props.verifyClick()}>Verify</button>

                }
            }
            
            if(props.role === "DesignLead"){
                actionBtn2 = <button className="action__btn" onClick={() => returnIso("Design", "")}>Design</button>               
            }if(props.role === "SpecialityLead"){
                actionBtn3 = actionBtn1
                actionBtn1 = <ActionExtra toIssue={toIssue.bind(this)} role={props.role}/>
                actionBtn2 = <CancelIso returnIso={returnIso.bind(this)} role={props.role}/>
                actionBtn5 = null
            }
            else if(props.role === "StressLead"){
                actionBtn2 = <button className="action__btn" onClick={() => props.returnIso("Stress", "")}>Stress</button>
                actionBtn4 = <button className="action__btn" onClick={() => props.transaction("Supports")}>Supports</button>
                actionBtn5 = <button className="action__btn" name="destination" value="stress" onClick={() => props.transaction("Materials")}>Materials</button>

            }
            else if(props.role === "SupportsLead"){
                actionBtn3 = <button className="action__btn" onClick={() => props.returnLeadStress()}>LDG Stress</button>
                actionBtn4 = <button className="action__btn" onClick={() => props.returnIso("Supports", "")}>Supports</button>
                
            }

            
        
        }else if(props.role === "SpecialityLead" && props.currentTab !== "LDE/IsoControl" && props.currentTab !== "Process" &&  props.currentTab !== "Instrument" && props.currentTab !== "Issued" && props.currentTab !== "Recycle bin" && props.currentTab !== "On hold"){
            actionBtn10 = <ForceClaimPopUp currentTab={props.currentTab} assignToUser={assignToUser.bind(this)}/>
            actionBtn1 = null
        }
        
        if ((props.currentTab === "Recycle bin" && (props.role === "DesignLead" || props.role === "SpecialityLead")) || 
            (props.currentTab === "On hold" && (props.role === "DesignLead" || props.role === "SpecialityLead" || props.role === "Issuer"))){
                if(process.env.REACT_APP_PROGRESS === "0"){
                    actionBtn8 = <button className="action__btn" onClick={() => props.restoreClick()}>Restore</button>
                    actionBtn7 = <button className="action__btn" name="destination" value="stress" onClick={() => props.downloadFiles()}>Download</button>
                }
                if(props.currentTab === "Recycle bin" && (props.role === "DesignLead" || props.role === "SpecialityLead")){
                    actionBtn8 = <button className="action__btn" onClick={() => props.restoreClick()}>Restore</button>
                    actionBtn7 = <button className="action__btn" name="destination" value="stress" onClick={() => props.downloadFiles()}>Download</button>
                }
        }
        if((props.role === "SpecialityLead" || props.role === "DesignLead") && props.currentTab !== "Recycle bin" && props.currentTab !== "On hold" && props.currentTab !== "Process" && props.currentTab !== "Instrument" && props.currentTab !== "Issued"){
            actionBtn6 = <button className="action__btn" name="destination" value="stress" onClick={() => props.transaction("Recycle bin")}>Delete</button>
            if(process.env.REACT_APP_PROGRESS === "0"){
                actionBtn7 = <HoldComment sendHolds={sendHolds.bind(this)}/>
            }
        }
        if(props.currentTab === "Status"){
            actionBtn1 = null
            actionBtn6 = null
            actionBtn7 = null
            actionBtn10 = null
        }
        if(props.currentTab === "Users"){
            actionBtn6 = <AddUserPopUp addUser={addUser.bind(this)}/>
            actionBtn7 = null
            actionBtn10 = null
            actionBtn11 = null
        }

        
    }
    if(props.currentTab === "IsoControl"){
        actionBtn1 = <button className="action__btn" name="export" value="export" onClick={() => exportModelled()}>Export</button>
        actionBtn6 = null
        actionBtn7 = null
        actionBtn10 = null
        actionBtn11 = null
    }else if(props.currentTab === "IsoControlNotMod"){
        actionBtn1 = <button className="action__btn" name="export" value="export" onClick={() => exportNotModelled()}>Export</button>
        actionBtn6 = null
        actionBtn7 = null
        actionBtn10 = null
        actionBtn11 = null
    }else if(props.currentTab === "IsoControlFull"){
        actionBtn1 = <button className="action__btn" name="export" value="export" onClick={() => exportFull()}>Export</button>
        actionBtn6 =  <button className="action__btn" name="downloadBOM" value="export" onClick={() => downloadBOM()}>Download BOM</button>
        actionBtn7 = null
        actionBtn10 = null
        actionBtn11 = null
    }else if(props.currentTab === "IsoControlLineIdGroup"){
        actionBtn1 = <button className="action__btn" name="export" value="export" onClick={() => exportLineIdGroup()}>Export</button>
        actionBtn6 = null
        actionBtn7 = null
        actionBtn10 = null
        actionBtn11 = null
    }else if(props.currentTab === "On hold" && process.env.REACT_APP_PROGRESS === "1"){
        actionBtn1 = <button className="action__btn" name="export" value="export" onClick={() => exportHolds()}>Export</button>
        actionBtn6 = null
        actionBtn7 = null
        actionBtn10 = null
        actionBtn11 = null
    }else if(props.currentTab === "On hold" && process.env.REACT_APP_PROGRESS === "0"){
        actionBtn1 = <button className="action__btn" name="export" value="export" onClick={() => exportHoldsNoProgress()}>Export</button>
        actionBtn6 = null
        actionBtn7 = null
        actionBtn10 = null
        actionBtn11 = null
    }else if(props.currentTab === "TimeTrack"){
        actionBtn1 = <button className="action__btn" name="export" value="export" onClick={() => exportTimeTrack()}>Export</button>
        actionBtn6 = null
        actionBtn7 = null
        actionBtn10 = null
        actionBtn11 = null
    }

    return(
        <div style={{display:"flex", marginTop:"10px"}}>
            {actionBtn1}
            {actionBtn2}
            {actionBtn3}
            {actionBtn4}
            {actionBtn5}
            {actionBtn9}
            {actionBtn6}
            
            {actionBtn7}
            {actionBtn8}
            
            {actionBtn10}
            {actionBtn11}
            {actionBtn12}
        </div>
    );
};

export default ActionBtns;