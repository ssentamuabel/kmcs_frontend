import React from 'react'
import '../styles/components.css'
import '../styles/common.css'
import Input from './InputComponet'
import { FaUserGear } from "react-icons/fa6";
import {
   
    FaPhoneAlt,    
    FaUserTag,
    FaUserGraduate,
    FaBriefcase

} from 'react-icons/fa'


const Model = ({
    onCancel = ()=>{},  
    onConfirm = ()=>{}
})=>{
    return (
        <div id="alert-container">
            <div id="face-form">
                <div id="body">
                    <h4>Face Data</h4>
                    <div id="form-inputs">
                        <div id="form-inputs">
                            <Input 
                                
                                placeholder="Sur name"
                                icon = {<FaUserTag />}
                            />
                            <Input 
                                
                                placeholder="First name"
                                icon = {<FaUserTag />}
                            />
                             <Input 
                                
                                placeholder="Other names"
                                icon = {<FaUserTag />}
                            />
                            
                            <Input 
                                addbtn
                                placeholder="Contact"
                                icon = {<FaPhoneAlt />}
                    
                            />
                            <Input 
                                addbtn
                                placeholder="Occupation"
                                icon= { <FaBriefcase />}
                                />
                            <Input 
                                addbtn
                                placeholder="Proffession"
                                icon= { <FaUserGraduate />}
                            />
                            <Input 
                                addbtn
                                placeholder="Skills"
                                icon= { <FaUserGear />}
                            />
                            

                        </div>
                                              
                    </div>
                </div>
                <div id="footer">
                    <button> </button>
                </div>

            </div>

        </div>
    )
}

export default Model;