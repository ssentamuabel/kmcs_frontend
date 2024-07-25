import React from 'react'
import '../styles/components.css'
import '../styles/common.css'

const Alert = ({
        message, 
        type, 
        onCancel = ()=>{},  
        onConfirm = ()=>{}
    })=>{

    

    return (
        <div id="alert-container">
            <div id="custom-alert">
                <div id="alert-message" className="black">
                    {message}
                </div>
                
                <div id="alert-buttons">
                {type == 'Confirm' ? (<>
                    <button 
                        className="danger"
                        onClick={onConfirm}
                    >
                        Confirm
                    </button>

                    <button 
                        className="go"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </>) : type == 'Error' ? (
                     <button 
                     className="go"
                     onClick={onCancel}
                 >
                     Ok
                 </button>
                ) : (
                    <button 
                     className="go"
                     onClick={onCancel}
                 >
                    Ok
                 </button>
                ) }
                   

                </div>
            </div>
        </div>
    )
}

export default Alert