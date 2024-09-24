import React from 'react'

const Button = ({text, id="submit", ...props})=>{
    return (
        <button 
            id={id} 
            className="button" {...props}>
                
            {text}
        </button>
    )
}

export default Button;