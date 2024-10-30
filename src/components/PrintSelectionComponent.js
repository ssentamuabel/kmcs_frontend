import React, {useState} from 'react'
import '../styles/components.css';
import '../styles/common.css';
import Button from './Button'

const PrintSelectionComponent = ({onCancel})=>{
    const [fields, setFields] = useState({
        name: true,
        gender:false,
        contact: false,
        email:false,
        occupation:false,
        profession:false,
        reg_no: false,
        hall:false,
        residence:false
    })


    const handleChange = (e)=>{
        setFields({
            ...fields,
            [e.target.name]: e.target.checked
        })
    }
    return (
        <div className="dialogue-container">
            
            <div className="field-selection-dialogue">
                <h4 >Select the fields  to print</h4>
                <div className="fields">
                    <div className="field-item">
                        <input
                            type="checkbox" 
                            id="name" 
                            name="name" 
                            checked={fields.name}
                          
                        />
                        <label>Names</label>
                    </div>
                    <div className="field-item">
                        <input
                            type="checkbox" 
                            id="gender" 
                            name="gender" 
                            checked={fields.gender}
                            onChange={handleChange}
                        />
                        <label>Gender</label>
                    </div>
                    <div className="field-item">
                        <input
                            type="checkbox" 
                            id="contact" 
                            name="contact" 
                            checked={fields.contact}
                            onChange={handleChange}
                        />
                        <label>Phone Number</label>
                    </div>
                    <div className="field-item">
                        <input
                            type="checkbox" 
                            id="email" 
                            name="email" 
                            checked={fields.email}
                            onChange={handleChange}
                        />
                        <label>Email</label>
                    </div>
                    <div className="field-item">
                        <input
                            type="checkbox" 
                            id="occupation" 
                            name="occupation" 
                            checked={fields.occupation}
                            onChange={handleChange}
                        />
                        <label>Occupation</label>
                    </div>
                    <div className="field-item">
                        <input
                            type="checkbox" 
                            id="profession" 
                            name="profession" 
                            checked={fields.profession}
                            onChange={handleChange}
                        />
                        <label>Profession</label>
                    </div>
                    <div className="field-item">
                        <input
                            type="checkbox" 
                            id="residence" 
                            name="residence" 
                            checked={fields.residence}
                            onChange={handleChange}
                        />
                        <label>Residence</label>
                    </div>
                    <div className="field-item">
                        <input
                            type="checkbox" 
                            id="hall" 
                            name="hall" 
                            checked={fields.hall}
                            onChange={handleChange}
                        />
                        <label>Hall of Attachment</label>
                    </div>
                    <div className="field-item">
                        <input
                            type="checkbox" 
                            id="reg_no" 
                            name="reg_no" 
                            checked={fields.reg_no}
                            onChange={handleChange}
                        />
                        <label>Registration Number</label>
                    </div>
                </div>
                <div className="model-footer">
                    <Button text="Cancel" id="info" onClick={onCancel} />
                    <Button   
                        text="Confirm"
                        onClick={onCancel} />
            
                </div>
            </div>            
        </div>
    )
}

export default PrintSelectionComponent