import React from 'react'

const Button = ({text, ...props})=>{
    return (
        <button id="submit" className="button" {...props}>
            {text}
        </button>
    )
}

export default Button;