import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { useState } from 'react'
import '../styles/common.css'
import Input from '../components/InputComponet'
import Button from '../components/Button'
import Select from '../components/SelectComponent'
import Alert from '../components/Alert'

import {
    FaUser,
    FaPhoneAlt,
    FaEnvelope,
    FaUserTag,
    FaMicroscope,
    FaHome

} from 'react-icons/fa'

const Register = ()=>{

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [errorAlert, setErrorAlert] = useState(false)
    const navigate = useNavigate()
    const [formdata, setFormdata] = useState({
        sur_name: "",
        first_name: "",
        contact: "",
        email: "",
        reg_no: "",
        gender: "",
        member_type : ""
    });

    const gender_options = [
        {value: 'false', name :'Male'},
        {value: 'true', name :'Female'}
    ]

    const memberType_options = [
        {value: 'false', name :'Student'},
        {value: 'true', name :'Alumnus'}
    ]
   

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

            const jsondata = await response.json()

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
                navigate('/login')
            }else{
                setError(` ${jsondata.detail}: try once again`)
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
            <form>

                <Input 
                    icon = {<FaUser />}
                    placeholder = "Surname"
                    value={formdata.sur_name}
                    onChange={handleChange}
                    name="sur_name"
                        
                />
                <Input 
                    icon = {<FaUser />}
                    placeholder='First Name'
                    value={formdata.first_name}
                    onChange={handleChange}
                    name="first_name"
                        
                />

                <Input 
                    icon = {<FaPhoneAlt />}
                    placeholder='Contact number'
                    value={formdata.contact}
                    onChange={handleChange}
                    name="contact"
                        
                />
                <Input 
                    icon = {<FaEnvelope />}
                    placeholder='Email Address'
                    value={formdata.email}
                    onChange={handleChange}
                    name="email"
                    type="email"
                        
                />
                <Input 
                    icon = {<FaUserTag  />}
                    placeholder='Registration Number'
                    value={formdata.reg_no}
                    onChange={handleChange}
                    name="reg_no"
    
                />

                <Select 
                    options = {gender_options}
                    name="gender"
                    label="gender"
                    value={formdata.gender}
                    icon = {<FaMicroscope />}
                    onChange={handleChange}
                />

                <Select 
                    options = {memberType_options}
                    name="member_type"
                    label="type"
                    value={formdata.member_type}
                    icon = {<FaHome />}
                    onChange={handleChange}
                />
                
                    
                <Button 
                    text={isLoading ? 'Loading...' : 'Submit'}
                    disabled={isLoading}
                    onClick={handleSubmit}
                />
                       

            </form>
            <Link to='/login'>Login</Link>
        </div>   
    )
       
}

export default Register