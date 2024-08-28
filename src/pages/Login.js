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
    const [validationErrors, setValidationErrors] = useState({})
    


    const handleChange = (e)=>{
        setFormdata({
            ...formdata,
            [e.target.name]:e.target.value
        })
        setValidationErrors({...validationErrors, [e.target.name]:''})
    }

    const handleSubmit = async(e)=>{
       

       if (!validateForm()) return

        setIsLoading(true)

        const cleaned_contact = formdata.contact.startsWith('0')
                        ? '256' + formdata.contact.slice(1)
                        : formdata.contact.startsWith('+')
                        ? formdata.contact.slice(1)
                        : formdata.contact;
        
        

        try {

            const response = await fetch('https://127.0.0.1:8000/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },          
                body : JSON.stringify({contact:cleaned_contact, password:formdata.password}),
                credentials: "include",
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




    const validateForm = () =>{
        const errors = {}
       
        const mobile_regex = /^(?:\+256|256|0)(7[0-9]|75|76|77|78|79)\d{7}$/;

        if (!formdata.password){
            errors.password = "First name is required"
        }

        if (!formdata.contact){
            errors.contact = "Contact  is required"
        }else if (!mobile_regex.test(formdata.contact)){
            errors.contact = "Invalid number, Uganda numbers only"
        }

        setValidationErrors(errors)
        return Object.keys(errors).length === 0;
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
                    error={validationErrors.contact}
                    
                />

                <Input 
                    icon = {<FaUserLock />}
                    placeholder = "**********"                  
                    password
                    name="password"
                    onChange={handleChange}
                    value={formdata.password}
                    error={validationErrors.password}
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