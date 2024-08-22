import React, {useState, useRef, useEffect} from 'react'
import { FaEye, FaEyeSlash, FaPlus } from 'react-icons/fa'


const InputComponet = ({
        icon, 
        password, 
        error, 
        addbtn, 
        handleAddField =()=>{}, 
        type='text', ...props})=>{
            
    const inputRef = useRef(null)
    

    const [showPassword, setShowPassword] = useState(false)

    const handleShowPassword = ()=>{
        
        showPassword ? setShowPassword(false) : setShowPassword(true)

        if (inputRef.current){
            showPassword ? inputRef.current.type = 'password' : inputRef.current.type = 'text'
        }

    }

    useEffect(()=>{
        if (inputRef.current){
            if (password){
                inputRef.current.type= 'password'
            }
        }
    }, [])

    return (
        <>
            <div  id="input-container">
                <div className="wrapper">
                    <div id="input-icon">{icon}</div>                
                    <input ref={inputRef}      {...props}  />      
                    
                    {password && <span id="password-icon" onClick={handleShowPassword}>{showPassword ? <FaEye/> :<FaEyeSlash/> }</span>}
                    {addbtn && <span id="password-icon" onClick={handleAddField}><FaPlus /></span >}

                </div>
                {error && <span id="input-error">{error}</span>}                        
            </div>
           
            
        </>
       
    )
}

export default InputComponet 