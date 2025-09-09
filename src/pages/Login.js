import React from 'react'
import {Link} from 'react-router-dom'
import { useState } from 'react'
import kmcs from '../kmcs.png'
import { CONFIG } from '../config'
import '../styles/auth.css'
import {
    FaPhoneAlt,
    FaUserLock,
    FaExclamationTriangle,
    FaCheckCircle
} from 'react-icons/fa'

const Login = ({onLogin})=>{
    const [errorAlert, setErrorAlert] = useState(false)
    const [successAlert, setSuccessAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
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
        e.preventDefault();
        const csrfToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken'))
            ?.split('=')[1];
            
       if (!validateForm()) return

        setIsLoading(true)

        const cleaned_contact = formdata.contact.startsWith('0')
                        ? '256' + formdata.contact.slice(1)
                        : formdata.contact.startsWith('+')
                        ? formdata.contact.slice(1)
                        : formdata.contact;
        
        
        try {
            const response = await fetch(`${CONFIG.backend_url}/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
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
                setSuccessAlert(true)
                setAlertMessage("Login successful! Redirecting...")
                setTimeout(() => {
                    setSuccessAlert(false)
                }, 3000)
            }else{
                setErrorAlert(true)
                setAlertMessage(jsondata.detail || "Login failed. Please try again.")
                setTimeout(() => {
                    setErrorAlert(false)
                }, 5000)
            }
        
        }catch (error) {
            setErrorAlert(true)
            setAlertMessage("Connection problem. Please try again.")
            setTimeout(() => {
                setErrorAlert(false)
            }, 5000)
        }finally {
            setIsLoading(false);
        }
    }

    const validateForm = () =>{
        const errors = {}
        const mobile_regex = /^(?:\+256|256|0)(7[0-9]|75|76|77|78|79)\d{7}$/;

        if (!formdata.password){
            errors.password = "Password is required"
        }

        if (!formdata.contact){
            errors.contact = "Contact is required"
        }else if (!mobile_regex.test(formdata.contact)){
            errors.contact = "Invalid number, Uganda numbers only"
        }

        setValidationErrors(errors)
        return Object.keys(errors).length === 0;
    }

    const closeAlert = () => {
        setErrorAlert(false)
        setSuccessAlert(false)
    }

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
                    <p>Welcome back! Please login to access your account and explore the diversity of the Muslim Fraternity in Kyambogo.</p>
                </div>
            </div>
            
            <div className="auth-right">
                <div className="auth-form-container">
                    <h2>Login to Your Account</h2>
                    <form onSubmit={handleSubmit}>
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
                            <label className="auth-form-label">Password</label>
                            <div className="auth-input-wrapper">
                                <div className="input-icon">
                                    <FaUserLock />
                                </div>
                                <input
                                    type="password"
                                    className={`auth-input ${validationErrors.password ? 'error' : ''}`}
                                    placeholder="Enter your password"
                                    value={formdata.password}
                                    onChange={handleChange}
                                    name="password"
                                />
                            </div>
                            {validationErrors.password && (
                                <div className="auth-error-message">
                                    <FaExclamationTriangle /> {validationErrors.password}
                                </div>
                            )}
                        </div>
                        
                        <button 
                            type="submit"
                            className="auth-submit-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                    
                    <div className="auth-footer">
                        <p>Don't have an account? <Link to='/register'>Register here</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login