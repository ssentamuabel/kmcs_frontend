import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { useState } from 'react'
import '../styles/auth.css'
import kmcs from '../kmcs.png'
import { CONFIG } from '../config'
import {
    FaUser,
    FaPhoneAlt,
    FaBook,
    FaGraduationCap,
    FaHome,
    FaUserTag,
    FaEnvelope,
    FaExclamationTriangle,
    FaCheckCircle
} from 'react-icons/fa'

const Register = ()=>{
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [errorAlert, setErrorAlert] = useState(false)
    const [successAlert, setSuccessAlert] = useState(false)
    const [isStudent, setIsStudent] = useState(true)
   
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
        {value: 'Male', name :'Male'},
        {value: 'Female', name :'Female'}
    ]

    const memberType_options = [
        {value: 'Student', name :'Student'},
        {value: 'Alumnus', name :'Alumnus'}
    ]
    const hall_options = [
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

        let data = {
            sur_name: formdata.sur_name[0].toUpperCase() + formdata.sur_name.slice(1).toLowerCase(),
            first_name: formdata.first_name[0].toUpperCase() + formdata.first_name.slice(1).toLowerCase(),           
            reg_no: formdata.reg_no.replace(/[\/\-_]/g, '_').toUpperCase(),
            hall_of_attachment : formdata.hall,
            gender: formdata.gender === "Female" ? true : false,
            member_type : formdata.member_type === "Alumnus" ? true: false,
            user : { email: formdata.email, contact: contact }
        }

        try {
            const response = await fetch(`${CONFIG.backend_url}/register_1/`, {
                method: 'POST',
                credentials: "include",
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
                    member_type : "",
                    course_code: "",
                    entry: "",
                    hall: ""
                })
                setSuccessAlert(true)
                setAlertMessage("Registration successful! Check your email for your password.")
                setTimeout(() => {
                    setSuccessAlert(false)
                    navigate('/login')
                }, 3000)
            }else{
                setErrorAlert(true)
                setAlertMessage(`Registration failed. Check your number or email, it seems to be used already.`)
                setTimeout(() => {
                    setErrorAlert(false)
                }, 5000)
            }
           
        }catch (error) {
            setErrorAlert(true)
            setAlertMessage("Something went wrong. Please try again.")
            setTimeout(() => {
                setErrorAlert(false)
            }, 5000)
        }finally {
            setIsLoading(false);
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
            errors.sur_name = "One name with letters is required";
        }
        if (!formdata.first_name){
            errors.first_name = "First name is required"
        }else if (!name_regex.test(formdata.first_name)){
            errors.first_name = "One name with letters is required";
        }
        if (!formdata.contact){
            errors.contact = "Contact is required"
        }else if (!mobile_regex.test(formdata.contact)){
            errors.contact = "Invalid number, Uganda numbers only"
        }

        if (!formdata.email ){
            errors.email = "Email Address is required"
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
    
    const closeAlert = () => {
        setErrorAlert(false)
        setSuccessAlert(false)
    };
   
    return (
        <div className="auth-container">
            {/* Alert Messages */}
            {errorAlert && (
                <div className="auth-alert">
                    <div className="auth-alert-content">
                        <FaExclamationTriangle style={{color: '#e74c3c', fontSize: '1.2rem', marginRight: '10px'}} />
                        <div className="auth-alert-message">{alertMessage}</div>
                        <button className="auth-alert-close" onClick={closeAlert}>&times;</button>
                    </div>
                </div>
            )}
            
            {successAlert && (
                <div className="auth-alert success">
                    <div className="auth-alert-content">
                        <FaCheckCircle style={{color: '#27ae60', fontSize: '1.2rem', marginRight: '10px'}} />
                        <div className="auth-alert-message">{alertMessage}</div>
                        <button className="auth-alert-close" onClick={closeAlert}>&times;</button>
                    </div>
                </div>
            )}
            
            <div className="auth-left">
                <div className="auth-left-content">
                    <img src={kmcs} alt="KMCS" className="auth-logo" />
                    <h1>Kyambogo University Muslim Centralised System</h1>
                    <p>Join our community today! Create an account to explore the diversity of the Muslim Fraternity in Kyambogo.</p>
                </div>
            </div>
            
            <div className="auth-right">
                <div className="auth-form-container">
                    <h2>Create an Account</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="auth-form-group">
                            <label className="auth-form-label">Surname</label>
                            <div className="auth-input-wrapper">
                                <div className="input-icon">
                                    <FaUser />
                                </div>
                                <input
                                    type="text"
                                    className={`auth-input ${validationErrors.sur_name ? 'error' : ''}`}
                                    placeholder="Enter your surname"
                                    value={formdata.sur_name}
                                    onChange={handleChange}
                                    name="sur_name"
                                />
                            </div>
                            {validationErrors.sur_name && (
                                <div className="auth-error-message">
                                    <FaExclamationTriangle /> {validationErrors.sur_name}
                                </div>
                            )}
                        </div>
                        
                        <div className="auth-form-group">
                            <label className="auth-form-label">First Name</label>
                            <div className="auth-input-wrapper">
                                <div className="input-icon">
                                    <FaUser />
                                </div>
                                <input
                                    type="text"
                                    className={`auth-input ${validationErrors.first_name ? 'error' : ''}`}
                                    placeholder="Enter your first name"
                                    value={formdata.first_name}
                                    onChange={handleChange}
                                    name="first_name"
                                />
                            </div>
                            {validationErrors.first_name && (
                                <div className="auth-error-message">
                                    <FaExclamationTriangle /> {validationErrors.first_name}
                                </div>
                            )}
                        </div>
                        
                        <div className="auth-form-group">
                            <label className="auth-form-label">Contact Number</label>
                            <div className="auth-input-wrapper">
                                <div className="input-icon">
                                    <FaPhoneAlt />
                                </div>
                                <input
                                    type="text"
                                    className={`auth-input ${validationErrors.contact ? 'error' : ''}`}
                                    placeholder="Enter your contact number"
                                    value={formdata.contact}
                                    onChange={handleChange}
                                    name="contact"
                                />
                            </div>
                            {validationErrors.contact && (
                                <div className="auth-error-message">
                                    <FaExclamationTriangle /> {validationErrors.contact}
                                </div>
                            )}
                        </div>
                        
                        <div className="auth-form-group">
                            <label className="auth-form-label">Gender</label>
                            <div className="auth-input-wrapper">
                                <div className="input-icon">
                                    <FaHome />
                                </div>
                                <select
                                    className={`auth-input ${validationErrors.gender ? 'error' : ''}`}
                                    value={formdata.gender}
                                    onChange={handleChange}
                                    name="gender"
                                >
                                    <option value="">Select Gender</option>
                                    {gender_options.map((option, index) => (
                                        <option key={index} value={option.value}>{option.name}</option>
                                    ))}
                                </select>
                            </div>
                            {validationErrors.gender && (
                                <div className="auth-error-message">
                                    <FaExclamationTriangle /> {validationErrors.gender}
                                </div>
                            )}
                        </div>
                        
                        <div className="auth-form-group">
                            <label className="auth-form-label">Member Type</label>
                            <div className="auth-input-wrapper">
                                <div className="input-icon">
                                    <FaUserTag />
                                </div>
                                <select
                                    className={`auth-input ${validationErrors.member_type ? 'error' : ''}`}
                                    value={formdata.member_type}
                                    onChange={handleMemberChange}
                                    name="member_type"
                                >
                                    <option value="">Select Member Type</option>
                                    {memberType_options.map((option, index) => (
                                        <option key={index} value={option.value}>{option.name}</option>
                                    ))}
                                </select>
                            </div>
                            {validationErrors.member_type && (
                                <div className="auth-error-message">
                                    <FaExclamationTriangle /> {validationErrors.member_type}
                                </div>
                            )}
                        </div>
                        
                        {formdata.member_type === 'Student' && (
                            <>
                                <div className="auth-form-group">
                                    <label className="auth-form-label">Registration Number</label>
                                    <div className="auth-input-wrapper">
                                        <div className="input-icon">
                                            <FaUserTag />
                                        </div>
                                        <input
                                            type="text"
                                            className={`auth-input ${validationErrors.reg_no ? 'error' : ''}`}
                                            placeholder="Enter your registration number"
                                            value={formdata.reg_no}
                                            onChange={handleChange}
                                            name="reg_no"
                                        />
                                    </div>
                                    {validationErrors.reg_no && (
                                        <div className="auth-error-message">
                                            <FaExclamationTriangle /> {validationErrors.reg_no}
                                        </div>
                                    )}
                                </div>
                                
                                <div className="auth-form-group">
                                    <label className="auth-form-label">Hall of Attachment</label>
                                    <div className="auth-input-wrapper">
                                        <div className="input-icon">
                                            <FaHome />
                                        </div>
                                        <select
                                            className={`auth-input ${validationErrors.hall ? 'error' : ''}`}
                                            value={formdata.hall}
                                            onChange={handleChange}
                                            name="hall"
                                        >
                                            <option value="">Select Hall</option>
                                            {hall_options.map((option, index) => (
                                                <option key={index} value={option.value}>{option.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {validationErrors.hall && (
                                        <div className="auth-error-message">
                                            <FaExclamationTriangle /> {validationErrors.hall}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                        
                        {formdata.member_type === 'Alumnus' && (
                            <>
                                <div className="auth-form-group">
                                    <label className="auth-form-label">Course Code</label>
                                    <div className="auth-input-wrapper">
                                        <div className="input-icon">
                                            <FaBook />
                                        </div>
                                        <input
                                            type="text"
                                            className={`auth-input ${validationErrors.coursecode ? 'error' : ''}`}
                                            placeholder="Enter your course code"
                                            value={formdata.course_code}
                                            onChange={(e) => getCourseCode(e.target.value)}
                                            name="course_code"
                                        />
                                    </div>
                                    {validationErrors.coursecode && (
                                        <div className="auth-error-message">
                                            <FaExclamationTriangle /> {validationErrors.coursecode}
                                        </div>
                                    )}
                                </div>
                                
                                <div className="auth-form-group">
                                    <label className="auth-form-label">Entry Year</label>
                                    <div className="auth-input-wrapper">
                                        <div className="input-icon">
                                            <FaGraduationCap />
                                        </div>
                                        <input
                                            type="number"
                                            className={`auth-input ${validationErrors.entry ? 'error' : ''}`}
                                            placeholder="Enter your entry year (e.g., 19, 12)"
                                            value={formdata.entry}
                                            onChange={handleChange}
                                            name="entry"
                                        />
                                    </div>
                                    {validationErrors.entry && (
                                        <div className="auth-error-message">
                                            <FaExclamationTriangle /> {validationErrors.entry}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                        
                        <div className="auth-form-group">
                            <label className="auth-form-label">Email Address</label>
                            <div className="auth-input-wrapper">
                                <div className="input-icon">
                                    <FaEnvelope />
                                </div>
                                <input
                                    type="email"
                                    className={`auth-input ${validationErrors.email ? 'error' : ''}`}
                                    placeholder="Enter your email address"
                                    value={formdata.email}
                                    onChange={handleChange}
                                    name="email"
                                />
                            </div>
                            {validationErrors.email && (
                                <div className="auth-error-message">
                                    <FaExclamationTriangle /> {validationErrors.email}
                                </div>
                            )}
                        </div>
                        
                        <button 
                            type="submit"
                            className="auth-submit-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Registering...' : 'Register'}
                        </button>
                    </form>
                    
                    <div className="auth-footer">
                        <p>Already have an account? <Link to='/login'>Login here</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register