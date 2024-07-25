import React from 'react'
import {Link} from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../styles/common.css'

const Login = ({onLogin})=>{
    const [formdata, setFormdata] = useState({
        contact: "",
        password : ""
    });
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()


    const handleChange = (e)=>{
        setFormdata({
            ...formdata,
            [e.target.name]:e.target.value
        })
    }

    const handleSubmit = async(e)=>{
       
        setIsLoading(true)

        try {

            const response = await fetch('http://127.0.0.1:8000/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },          
                body : JSON.stringify(formdata)
            })
            
            if (response.ok){
                onLogin()
                setFormdata({
                    ...formdata,
                    contact: "",
                    password: ""
                })
                navigate('/')
            }else{
                console.log("The connection has a problem")
            }

            const jsondata = await response.json()
           
            console.log(jsondata)            
            
        }catch (error) {
            console.log(error)
        }finally {
            setIsLoading(false); // Ensure loading state is reset
        }
        
    }
   
    

    return (
        <div className='container'>
            <form autoComplete='off'>
                <input type="text" name="contact" value={formdata.contact} onChange={handleChange} /> 
                <br/>
                <input type="password" name="password"  value={formdata.password} onChange={handleChange} />
                <br/>
                <button type="submit" disabled={isLoading} onClick={handleSubmit} >
                {isLoading ? 'Loading...' : 'Submit'}
                </button>
                <br/>                

            </form>
            <Link to='/register'>Register</Link>
        </div>        
    )
}

export default Login