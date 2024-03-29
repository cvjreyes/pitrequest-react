import React, { Component } from 'react';
import SuccessIcon from "../../assets/images/CheckCircle.png"
import ErrorIcon from "../../assets/images/WarningCircle.png"
import WarningIcon from "../../assets/images/Warning.png"
import "./alert.css"

export default class Alert extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: props.type,
            text: props.text,
            alert: null,
            subtext: props.subtext,
            popUp: props.popUp,
            change: props.change
        }
        
    }

    componentDidMount(){
        let alertComponent = null
        if(this.state.type === "success"){
            if(this.state.change){
                alertComponent = <div className="alert__success">
                                    
                <img src={SuccessIcon} className="alert__icon" alt="success"></img>
                <div className="text__alert__container">
                    <p className="alert__title">Excellent!</p>
                    <p className="alert__text" style={{marginLeft:0}}>{this.props.text}</p>
                </div>
            
            </div>
            }else{
                let cn ="alert__success"
                if(this.props.cn){
                    cn = this.props.cn
                }
                alertComponent = <div className={cn}>
                                    
                                    <img src={SuccessIcon} className="alert__icon" alt="success2"></img>
                                    <div className="text__alert__container">
                                        <p className="alert__title">Excellent!</p>
                                        <p className="alert__text" style={{marginLeft:"-45px"}}>{this.props.text}</p>
                                    </div>
                                
                                </div>
            }
            this.setState({alert: alertComponent})
        }else if(this.state.type === "error"){
            let cn ="alert__error"
            if(this.props.cn){
                cn = this.props.cn
            }
            if(this.state.change){
                alertComponent = <div className={cn}>
                                    
                <img src={ErrorIcon} className="alert__icon" alt="error"></img>
                <div className="text__alert__container">
                    <p className="alert__title">Oops!</p>
                    <p className="alert__error__text" style={{marginLeft:"0px"}}>Something has failed:</p>
                    <p className="alert__subtext" style={{marginLeft:this.props.margin}}>{this.props.subtext}</p>
                </div>
            
            </div>
            }else{
                alertComponent = <div className={cn}>
                                    
                                    <img src={ErrorIcon} className="alert__icon" alt="error2"></img>
                                    <div className="text__alert__container">
                                        <p className="alert__title">Oops!</p>
                                        <p className="alert__error__text">Something has failed:</p>
                                        <p className="alert__subtext" style={{marginLeft:"-60px"}}>{this.props.subtext}</p>
                                    </div>
                                
                                </div>
            }
            this.setState({alert: alertComponent})
        }else if(this.state.type==="qtracker"){
            if(this.props.text){
                alertComponent = <div className="alert__warning__qtracker">
                                    
                <img src={WarningIcon} className="alert__icon" alt="success"></img>
                <div className="text__alert__container">
                    <p className="alert__title">Warning</p>
                    <p className="alert__text" style={{marginLeft:"-1px"}}>{this.props.text}</p>
                </div>
            
            </div>
            }else{
                if(this.props.project){
                    alertComponent = <div className="alert__success">
                                    
                    <img src={SuccessIcon} className="alert__icon" alt="success"></img>
                    <div className="text__alert__container">
                        <p className="alert__title">Success</p>
                        <p className="alert__text" style={{marginLeft:"-40px"}}>Project created successfully!</p>
                    </div>
                
                </div>
                }else{
                    alertComponent = <div className="alert__success">
                                    
                    <img src={SuccessIcon} className="alert__icon" alt="success"></img>
                    <div className="text__alert__container">
                        <p className="alert__title">Success</p>
                        <p className="alert__text" style={{marginLeft:"-45px"}}>Request sent successfully!</p>
                    </div>
                
                </div>
                }
                
            }
            
             this.setState({alert: alertComponent})
        }else{
            if(this.state.popUp){
                alertComponent = <div className="alert__warning" style={{marginTop:"-200px"}}>
                                    
                                    <img src={WarningIcon} className="alert__icon" alt="warning"></img>
                                    <div className="text__alert__container">
                                        <p className="alert__title">Warning</p>
                                        <p className="alert__text" >{this.props.text}</p>
                                    </div>
                                
                                </div>
            }else{
                alertComponent = <div className="alert__warning">
                                    
                                    <img src={WarningIcon} className="alert__icon" alt="warning2"></img>
                                    <div className="text__alert__container">
                                        <p className="alert__title">Warning</p>
                                        <p className="alert__text" style={{marginLeft:this.props.margin}}>{this.props.text}</p>
                                    </div>
                                
                                </div>
            }
            this.setState({alert: alertComponent})  

        }
    }

    
    

    render() {

        return (
            <div className="alert__container__fade">
                {this.state.alert}
            </div>           
        );
    }
}