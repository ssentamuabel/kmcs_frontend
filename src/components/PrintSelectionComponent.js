import React, { useState, useContext } from 'react';
import { RightsContext } from '../contexts/RightsProvider';
import '../styles/components.css';
import '../styles/common.css';
import Button from './Button';

const PrintSelectionComponent = ({ onCancel, onConfirm }) => {
    const { rights } = useContext(RightsContext);

    const initialFields = {
        no: true,
        name: true,
        gender: false,
        contact: false,
        course: false,
        reg_no: false,     
        occupation: false,
        profession: false,
        email: false,
        hall: false,
        residence: false
    };

    const [fields, setFields] = useState(initialFields);

    const handleChange = (e) => {
        setFields({
            ...fields,
            [e.target.name]: e.target.checked
        });
    };

    const allFields = {
        name: "Names",
        gender: "Gender",
        contact: "Phone Number",
        course: "Course",
        reg_no: "Registration Number",    
        occupation: "Occupation",
        profession: "Profession",
        email: "Email",
        hall: "Hall of Attachment",
        residence: "Residence"
    };

    // Filter fields based on rights.perm.type
    const filteredFields = Object.keys(allFields).filter(field => {
        if (rights.perm.type) {
            return field !== 'course' && field !== 'reg_no' && field !== 'hall';
        } else {
            return field !== 'occupation' && field !== 'profession';
        }
    });

    const confirmPrint = () => {
        
        onConfirm(fields);
    };

    return (
        <div className="dialogue-container">
            <div className="field-selection-dialogue">
                <h4>Select the fields to print</h4>
                <div className="fields">
                    {filteredFields.map((field, index) => (
                        <div key={index} className="field-item">
                            <input
                                type="checkbox"
                                id={field}
                                name={field}
                                checked={fields[field]}
                                onChange={handleChange}
                            />
                            <label>{allFields[field]}</label>
                        </div>
                    ))}
                </div>
                <div className="model-footer">
                    <Button text="Cancel" id="info" onClick={onCancel} />
                    <Button
                        text="Confirm"
                        onClick={confirmPrint}
                        
                    />
                </div>
            </div>
        </div>
    );
};

export default PrintSelectionComponent;
