import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { useState } from 'react'
import '../styles/common.css'
import Input from '../components/InputComponet'
import Button from '../components/Button'
import Select from '../components/SelectComponent'
import Alert from '../components/Alert'
import AutoComplete from '../components/AutoCompleteInputComponent'

import {
    FaUser,
    FaPhoneAlt,
    FaBook,
    FaGraduationCap,
    FaMicroscope,
    FaHome,
    FaUserTag,
    FaEnvelope,

} from 'react-icons/fa'
import { TbRuler } from 'react-icons/tb'

const Register = ()=>{

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')  
    const [isStudent, setIsStudent] = useState(true)
    const [errorAlert, setErrorAlert] = useState(false)
    const navigate = useNavigate()
    const [validationErrors, setValidationErrors] = useState({})
    const [formdata, setFormdata] = useState({
        sur_name: "",
        first_name: "",        
        contact: "",
        email: "",
        reg_no: "",
        gender: "",
        member_type : "",
        course_code: "",
        entry: ""
    });

    const gender_options = [
        {value: 'false', name :'Male'},
        {value: 'true', name :'Female'}
    ]

    const memberType_options = [
        {value: 'false', name :'Student'},
        {value: 'true', name :'Alumnus'}
    ]

    const getCourseCode = (item) =>{
        setFormdata({
            ...formdata,
            course_code: item
        })
    }
   

    const handleChange = (e)=>{
        setFormdata({
            ...formdata,
            [e.target.name]:e.target.value
        })
        setValidationErrors({...validationErrors, [e.target.name]:''})
    }

    const handleMemberChange = (e) =>{
        if (e.target.value == 'true'){
            setIsStudent(false)
        }else{
            setIsStudent(true)
        }
        setFormdata({
            ...formdata,
            member_type: e.target.value
        })
        setValidationErrors({...validationErrors, member_type:''})
    }

    const handleSubmit = async(e)=>{
        e.preventDefault();
        if (validateForm()) return
        setIsLoading(true)

        formdata.gender = (formdata.gender) === "false" ? false : true;
        formdata.member_type = (formdata.member_type) === "false" ? false : true;

        if (formdata.member_type){
            formdata.reg_no = `${formdata.entry}_N_${formdata.course_code}_000_N`
        }
        const contact = formdata.contact.startsWith('0')
                        ? '256' + formdata.contact.slice(1)
                        : formdata.contact.startsWith('+')
                        ? formdata.contact.slice(1)
                        : formdata.contact;


        let data = {
            sur_name: formdata.sur_name[0].toUpperCase() + formdata.sur_name.slice(1).toLowerCase(),
            first_name: formdata.first_name[0].toUpperCase() + formdata.first_name.slice(1).toLowerCase(),           
            reg_no: formdata.reg_no,
            gender: formdata.gender,
            member_type : formdata.member_type,
            user : { email: formdata.email, contact: contact}
        }

        // console.log(JSON.stringify(data))
        

        try {

            const response = await fetch('https://127.0.0.1:8000/register_1/', {
                method: 'POST',
                credentials: "include",
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
                    member_type : "",
                    course_code: "",
                    entry: ""
                })
                navigate('/login')
            }else{
                console.log(response)
                setError(` ${jsondata.detail}: try once again`)
                setErrorAlert(true)
            }
           
            
        }catch (error) {
            setError(error.message)
            setErrorAlert(true)
        }finally {
            setIsLoading(false); // Ensure loading state is reset
        }
        
    }


    const validateForm = () =>{
        const errors = {}
        const name_regex  = /^[A-Za-z]+$/;
        const reg_regex = /^(0?[1-9]?[0-9]|100)[\/\-_]([a-zA-Z])[\/\-_]([a-zA-Z]+)[\/\-_](\d{2,})[\/\-_]([a-zA-Z]+)$/;
        const email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const mobile_regex = /^(?:\+256|256|0)(7[0-9]|75|76|77|78|79)\d{7}$/;




        if (!formdata.sur_name){
            errors.sur_name = "Sur name is required"
        }else if (!name_regex.test(formdata.sur_name)){
            errors.sur_name = "One name  with letters is required";
        }
        if (!formdata.first_name){
            errors.first_name = "First name is required"
        }else if (!name_regex.test(formdata.first_name)){
            errors.first_name = "One name  with letters is required";
        }
        if (!formdata.contact){
            errors.contact = "Contact  is required"
        }else if (!mobile_regex.test(formdata.contact)){
            errors.contact = "Invalid number, Uganda numbers only"
        }

        if (!formdata.email ){
            errors.email = "Email Address  is required"
        }else if (!email_regex.test(formdata.email)){
            errors.email = "Email is not valid"
        }

        if (!formdata.gender){
            errors.gender = "Select your gender"
        }

        if (!formdata.member_type){
           
            errors.member_type = "Select either Student or Alumnus"
        }

        if (formdata.member_type == 'false' && !formdata.reg_no.trim() ){
            errors.reg_no = "Registration number is required"
        }else if (!reg_regex.test(formdata.reg_no.trim())){
            errors.reg_no = "Registration  number is wrong"
        }

        if (formdata.member_type == 'true' && !formdata.course_code.trim() ){
            errors.coursecode = "Type search your course"
        } 
        
        if (formdata.member_type == 'true' && !formdata.entry.trim()){
            errors.entry = "Which entry were you admitted ie 19, 12 ...."
        }else if (Number(formdata.entry) < 1 || Number(formdata.entry) > 200){
            errors.entry = "Entry enterd is incorrect"
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
            <form>

                <Input 
                    icon = {<FaUser />}
                    placeholder = "Surname"
                    value={formdata.sur_name}
                    onChange={handleChange}
                    name="sur_name"
                    error={validationErrors.sur_name}
                        
                />
               
                <Input 
                    icon = {<FaUser />}
                    placeholder='First Name'
                    value={formdata.first_name}
                    onChange={handleChange}
                    name="first_name"
                    error={validationErrors.first_name}
                        
                />
                

                <Input 
                    icon = {<FaPhoneAlt />}
                    placeholder='Contact number'
                    value={formdata.contact}
                    onChange={handleChange}
                    name="contact"
                    error={validationErrors.contact}
                        
                />
                
                

                <Select 
                    options = {gender_options}
                    name="gender"
                    label="gender"
                    value={formdata.gender}
                    icon = {<FaMicroscope />}
                    onChange={handleChange}
                    error={validationErrors.gender}
                />
                <Select 
                    options = {memberType_options}
                    name="member_type"
                    label="type"
                    value={formdata.member_type}
                    icon = {<FaHome />}
                    onChange={handleMemberChange}
                    error={validationErrors.member_type}
                />
                {isStudent ? (
                    <Input 
                    icon = {<FaUserTag  />}
                    placeholder='Registration Number'
                    value={formdata.reg_no}
                    onChange={handleChange}
                    name="reg_no"
                    error={validationErrors.reg_no}
    
                />
                ): (
                    <>
                        <AutoComplete 
                            icon={<FaBook />}
                            setValue={getCourseCode}
                            error={validationErrors.coursecode}
                        />
                        <Input 
                            icon = {<FaGraduationCap  />}
                            placeholder=' ie 19 for 19th graduation'
                            type='number'
                            value={formdata.entry}
                            onChange={handleChange}
                            name="entry"
                            error={validationErrors.entry}
            
                        />
                    </>
                  
                )}

                <Input 
                    icon = {<FaEnvelope />}
                    placeholder='Email Address'
                    value={formdata.email}
                    onChange={handleChange}
                    name="email"
                    type="email"
                    error={validationErrors.email}
                        
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