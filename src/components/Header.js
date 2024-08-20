import React , { useRef, useContext } from 'react'
import {RightsContext} from '../contexts/RightsProvider'
import { AiOutlineLogout } from "react-icons/ai";
import { LuPenSquare } from "react-icons/lu";
import { CgMenuGridR } from "react-icons/cg";



const Header = ({ onLogout, onMenuClick})=>{
    const {rights} = useContext(RightsContext)
    return (
        <div id='top-header'>
             
            <div className="title">
                <h4>Kyambogo University Muslim Centralised System</h4>
                
            </div>
            <div className="user">
                <div id="menu-bar">
                    <div id="menu-icon" onClick={onMenuClick} ><CgMenuGridR /></div>
                    <h4>KMCS</h4>
                </div>
                <div id="user-name">
                    <span id="pen-icon"><LuPenSquare /></span>
                    <p id="user-p">{rights.name}</p>
                </div>       
                <div id="logout" onClick={onLogout}>
                    <div id="logout-icon"><AiOutlineLogout /></div>
                    <p>Logout</p>
                </div>
            </div>
        </div>
    )
}

export default Header