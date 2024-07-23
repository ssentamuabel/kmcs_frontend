import React from 'react'
import {Link} from 'react-router-dom'
import { useState } from 'react'
import  '../App.css'

const Register = ()=>{
    const [formdata, setFormdata] = useState({
        sur_name: "",
        first_name: "",
        contact: "",
        email: "",
        reg_no: "",
        gender: "",
        member_type : ""
    });
   
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e)=>{
        setFormdata({
            ...formdata,
            [e.target.name]:e.target.value
        })
    }

    const handleSubmit = async(e)=>{
       
        setIsLoading(true)

        formdata.gender = (formdata.gender) === "false" ? false : true;
        formdata.member_type = (formdata.member_type) === "false" ? false : true;

        let data = {
            sur_name: formdata.sur_name,
            first_name: formdata.first_name,     
            reg_no: formdata.reg_no,
            gender: formdata.gender,
            member_type : formdata.member_type,
            user : { email: formdata.email, contact: formdata.contact,}
        }

        try {

            const response = await fetch('http://127.0.0.1:8000/register_1/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },          
                body : JSON.stringify(data)
            })
            
            if (response.ok){
                setFormdata({
                    ...formdata,
                    sur_name: "",
                    first_name: "",
                    contact: "",
                    email: "",
                    reg_no: "",
                    gender: "",
                    member_type : ""
                })
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
            <form>
                <input type="text" name="sur_name" placeholder='Sur name' value={formdata.sur_name} onChange={handleChange} /> 
                <br/>
                <input type="text" name="first_name" placeholder='First Name' value={formdata.first_name} onChange={handleChange}  /> 
                <br/>
                <input type="text" name="contact" placeholder='Contact' value={formdata.contact} onChange={handleChange} /> 
                <br/>
                <input type="email" name="email" placeholder='Email' value={formdata.email} onChange={handleChange} /> 
                <br/>
                <input type="text" name="reg_no"   placeholder='Registration No' value={formdata.reg_no} onChange={handleChange} /> 
                <br/>
                <select name="gender"  onChange={handleChange}>
                    <option value={formdata.gender}>Selct the gender</option>
                    <option value="false">Male</option>
                    <option value="true">Female</option>                    
                </select>
                <br/>
                <select name="member_type" value={formdata.member_type} onChange={handleChange} >
                    <option value={formdata.member_type}>Student</option>
                    <option value="false">Student</option>
                    <option value="true">Alumnus</option>                    
                </select>
                <br />
                
                <button type="submit" disabled={isLoading} onClick={handleSubmit} > 
                    {isLoading ? 'Loading...' : 'Submit'}
                </button>
                <br/>                

            </form>
            <Link to='/'>Login</Link>
        </div>   
    )
       
}

export default Register