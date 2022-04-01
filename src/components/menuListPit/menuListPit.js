import React, { useState, useEffect } from 'react';
import MenuListPITList from "../menuListPitList/menuListPitList"
import './menuList.css'
import PITLogo from "../../assets/images/pitlogo.svg"




const MenuListPIT = (props) =>{

    function success(){
        props.success()
    }

    function successProject(){
        props.successProject()
    }

    return(
        <div class="panel__container">
            <div className="panel__heading__container">
                <img src={PITLogo} alt="PITLogo" className="pit__image"/>
            </div>

            <div className="elements__container">
                <div className="menu" style={{paddingTop:"10px"}}>
                    <MenuListPITList success={success.bind(this)} successProject={successProject.bind(this)}/>
                </div>
                
            </div>
            
            
        </div>
    );
};

export default MenuListPIT;