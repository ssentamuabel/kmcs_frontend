import React from 'react'
import {Link} from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../styles/common.css'
import Input from '../components/InputComponet'
import Button from '../components/Button'
import Alert from '../components/Alert'
import {
    FaPhoneAlt,
    FaUserLock
} from 'react-icons/fa'



const Login = ({onLogin})=>{
    const [errorAlert, setErrorAlert] = useState(false)
    const [error, setError] = useState('')
    const [formdata, setFormdata] = useState({
        contact: "",
        password : ""
    });
    const [isLoading, setIsLoading] = useState(false)
    


    const handleChange = (e)=>{
        setFormdata({
            ...formdata,
            [e.target.name]:e.target.value
        })
    }

    const handleSubmit = async(e)=>{
       e.preventDefault()

        setIsLoading(true)

        try {

            const response = await fetch('http://127.0.0.1:8000/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },          
                body : JSON.stringify(formdata)
            })

            const jsondata = await response.json()
           
            
            if (response.ok){
                
                onLogin(jsondata)
                setFormdata({
                    ...formdata,
                    contact: "",
                    password: ""
                })
                
            }else{
                
                setError(`${jsondata.detail}: try once again`)
                setErrorAlert(true)
            }
        
            
        }catch (error) {
            setError('Connection Problem')
            setErrorAlert(true)
        }finally {
            setIsLoading(false); // Ensure loading state is reset
        }
        
    }

    return (
        <div className='container'>
            { 
                errorAlert && (<Alert 
                type='Error'
                message ={error}
                 onCancel={()=>{setErrorAlert(false)}}                     
                />)
             }   
            <form autoComplete='off'>              
            
                <Input 
                    icon = {<FaPhoneAlt />}
                    placeholder = "Contact"
                    value={formdata.contact}
                    onChange={handleChange}
                    name="contact"
                    
                />

                <Input 
                    icon = {<FaUserLock />}
                    placeholder = "**********"                  
                    password
                    name="password"
                    onChange={handleChange}
                    value={formdata.password}
                /> 

                <Button 
                    text={isLoading ? 'Loading...' : 'Submit'}
                    disabled={isLoading}
                    onClick={handleSubmit}

                />

            </form>
            <Link to='/register'>Register</Link>
        </div>        
    )
}

export default Login