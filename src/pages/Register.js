import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { useState } from 'react'
import '../styles/common.css'
import Input from '../components/InputComponet'
import Button from '../components/Button'
import Select from '../components/SelectComponent'
import Alert from '../components/Alert'
import { CONFIG } from '../config'
import AutoComplete from '../components/AutoCompleteInputComponent'
import kmcs from '../kmcs.png'

import {
    FaUser,
    FaPhoneAlt,
    FaBook,
    FaGraduationCap,
    FaMicroscope,
    FaHome,
    FaUserTag,
    FaEnvelope,
    FaUserPlus

} from 'react-icons/fa'


const Register = ()=>{
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')  
    const [isStudent, setIsStudent] = useState(true)
    const [done, setDone] = useState(false)
    const [errorAlert, setErrorAlert] = useState(false)
    
   
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
        entry: "",
        hall: ""
    });

    const gender_options = [
        // {value: '', name: 'Select Gender'},
        {value: 'Male', name :'Male'},
        {value: 'Female', name :'Female'}
    ]

    const memberType_options = [
        // {value: '', name: 'Select Member Type'},
        {value: 'Student', name :'Student'},
        {value: 'Alumnus', name :'Alumnus'}
    ]
    const hall_options = [
        // {value: '', name: 'Select Hall'},
        {value: 'Kulubya', name :'Kulubya'},
        {value: 'Pearl', name :'Pearl'},
        {value: 'Mandella', name :'Mandella'},
        {value: 'North Hall', name :'North Hall'},
        {value: 'Nanziri', name :'Nanziri'}
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
       
        removeValidationError([e.target.name]);
    }

    const handleMemberChange = (e) =>{
        if (e.target.value === 'Alumnus'){
            setIsStudent(false)
        }else{
            setIsStudent(true)
        }
        setFormdata({
            ...formdata,
            member_type: e.target.value
        })
        removeValidationError('member_type');
    }

    const handleSubmit = async(e)=>{
        e.preventDefault();
        console.log(validateForm())
        console.log(validationErrors)

        if (!validateForm()) return;
        setIsLoading(true)        

        if (formdata.member_type === "Alumnus"){
            formdata.reg_no = `${formdata.entry}_N_${formdata.course_code}_000_N`
        }
        const contact = formdata.contact.startsWith('0')
                        ? '256' + formdata.contact.slice(1)
                        : formdata.contact.startsWith('+')
                        ? formdata.contact.slice(1)
                        : formdata.contact;

        // const role_id  = member_type? 2:1 ;

        let data = {
            sur_name: formdata.sur_name[0].toUpperCase() + formdata.sur_name.slice(1).toLowerCase(),
            first_name: formdata.first_name[0].toUpperCase() + formdata.first_name.slice(1).toLowerCase(),           
            reg_no: formdata.reg_no.replace(/[\/\-_]/g, '_').toUpperCase(),
            hall_of_attachment : formdata.hall,
            gender: formdata.gender === "Female" ? true : false,
            member_type : formdata.member_type === "Alumnus" ? true: false,
            user : { email: formdata.email, contact: contact}
        }

        // console.log(JSON.stringify(data))
        console.log(data)
        // setIsLoading(false)

        try {

            const response = await fetch(`${CONFIG.backend_url}/register_1/`, {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },          
                body : JSON.stringify(data)
                
            })

            // const jsondata = await response.json()

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
                    entry: "",
                    hall: ""
                })
                setDone(true)
               
            }else{
                console.log(response)
                setError(`Check your number   or email, Its seems to be used already`)
                setErrorAlert(true)
            }
           
            
        }catch (error) {
            setError("Something went wrong")
            setErrorAlert(true)
        }finally {
            setIsLoading(false); // Ensure loading state is reset
        }
        
    }


    const validateForm = () =>{
        const errors = {}
        const name_regex  = /^[A-Za-z]+$/;
        const reg_regex = /^(0?[1-9]?[0-9]|100)[\/\-_][a-zA-Z][\/\-_]([a-zA-Z]{3})[\/\-_](\d{2,})[\/\-_]([a-zA-Z]{2})$/;
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

        if (formdata.member_type === 'Alumnus'){

            if (!formdata.course_code.trim()){
                errors.coursecode = "Type search your course or choose one related "            
            }

            if (!formdata.entry.trim()){
                errors.entry = "Which entry were you admitted ie 19, 12 ...."
            }
        }else if (formdata.member_type === 'Student'){
            if (!formdata.reg_no.trim()){
                errors.reg_no = "Registration number is required"
            }else if (!reg_regex.test(formdata.reg_no.trim())){
                errors.reg_no = "Invalid registration Number"
            }

            if (!formdata.hall.trim()){
                 errors.hall = "Hall of Attachment"
            }
        }else{
            errors.member_type = "Select either Student or Alumnus"
        }
        


        setValidationErrors(errors)
        return Object.keys(errors).length === 0;
    }

    const removeValidationError = (key) => {
        const { [key]: _, ...rest } = validationErrors;
        setValidationErrors(rest);
    };
    
   
    return (
        <div id='register-page'>
            { 
                errorAlert && (<Alert 
                type='Error'
                message ={error}
                 onCancel={()=>{setErrorAlert(false)}}                     
                />)
            }

            { done && (<Alert 
                
                message ="Check your email (spam) for your password"
                onCancel={()=>{setDone(false); navigate('/login')}} 
                
                />)           
            }
             
             <div className="right">
               <div id="right-wrapper">
                   
                <center> <img src={kmcs} alt="KMCS" /></center>
                
                <h3>Kyambogo University Muslim Centralised System</h3>
                <p>Join our community and explore the diversity of the Muslim Fraternity</p>
                
               </div>            

            </div>
            <div className="left">
               
                <div id="left-wrapper">
                    <h4>Create Account</h4>
                    <p>Fill in your details to register</p>
                    <div className="register-form">
                        <div className="form-row">
                            <div className="form-field">
                                <Input 
                                    icon = {<FaUser />}
                                    placeholder = "Surname"
                                    value={formdata.sur_name}
                                    onChange={handleChange}
                                    name="sur_name"
                                    error={validationErrors.sur_name}
                                />
                            </div>
                            <div className="form-field">
                                <Input 
                                    icon = {<FaUser />}
                                    placeholder='First Name'
                                    value={formdata.first_name}
                                    onChange={handleChange}
                                    name="first_name"
                                    error={validationErrors.first_name}
                                />
                            </div>
                        </div>
                        
                        <div className="form-row">
                            <div className="form-field">
                                <Input 
                                    icon = {<FaPhoneAlt />}
                                    placeholder='Contact number'
                                    value={formdata.contact}
                                    onChange={handleChange}
                                    name="contact"
                                    error={validationErrors.contact}
                                />
                            </div>
                            <div className="form-field">
                                <Select 
                                    options = {gender_options}
                                    name="gender"
                                    label="Gender"
                                    value={formdata.gender}
                                    icon = {<FaMicroscope />}
                                    onChange={handleChange}
                                    error={validationErrors.gender}
                                />
                            </div>
                        </div>
                        
                        <div className="form-row">
                            <div className="form-field">
                                <Select 
                                    options = {memberType_options}
                                    name="member_type"
                                    label="Member Type"
                                    value={formdata.member_type}
                                    icon = {<FaHome />}
                                    onChange={handleMemberChange}
                                    error={validationErrors.member_type}
                                />
                            </div>
                            {isStudent ? (
                                <div className="form-field">
                                    <Input 
                                        icon = {<FaUserTag  />}
                                        placeholder='Registration Number'
                                        value={formdata.reg_no}
                                        onChange={handleChange}
                                        name="reg_no"
                                        error={validationErrors.reg_no}
                                    />
                                </div>
                            ) : (
                                <div className="form-field">
                                    <AutoComplete 
                                        icon={<FaBook />}
                                        setValue={getCourseCode}
                                        error={validationErrors.coursecode}
                                    />
                                </div>
                            )}
                        </div>
                        
                        {isStudent ? (
                            <div className="form-row">
                                <div className="form-field">
                                    <Select 
                                        options = {hall_options}
                                        name="hall"
                                        label="Hall of Attachment"
                                        value={formdata.hall}
                                        icon = {<FaHome />}
                                        onChange={handleChange}
                                        error={validationErrors.hall}
                                    />
                                </div>
                                <div className="form-field">
                                    {/* Empty field for spacing */}
                                </div>
                            </div>
                        ) : (
                            <div className="form-row">
                                <div className="form-field">
                                    <Input 
                                        icon = {<FaGraduationCap  />}
                                        placeholder='Turn of entry ie 09, 11, 12 ....'
                                        type='number'
                                        value={formdata.entry}
                                        onChange={handleChange}
                                        name="entry"
                                        error={validationErrors.entry}
                                    />
                                </div>
                                <div className="form-field">
                                    {/* Empty field for spacing */}
                                </div>
                            </div>
                        )}
                        
                        <div className="form-row">
                            <div className="form-field">
                                <Input 
                                    icon = {<FaEnvelope />}
                                    placeholder='Email Address'
                                    value={formdata.email}
                                    onChange={handleChange}
                                    name="email"
                                    type="email"
                                    error={validationErrors.email}
                                />
                            </div>
                            <div className="form-field">
                                {/* Empty field for spacing */}
                            </div>
                        </div>
                        
                        <Button 
                            id="info"
                            text={isLoading ? 'Processing...' : 'Create Account'}
                            icon={<FaUserPlus />}
                            disabled={isLoading}
                            onClick={handleSubmit}
                        />

                </div>
                <p>Already have an account? <Link to='/login'>Login</Link> </p> 
               

                </div>
            </div>        
           
        </div>   
    )
       
}

export default Register