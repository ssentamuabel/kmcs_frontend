import React, { useEffect, useState } from 'react';
import '../../styles/components.css';
import '../../styles/common.css';
import Button from '../Button';
import Select from '../SelectComponent';
import Input from '../InputComponet';
import awards from '../../awards';
import { FaPlus } from 'react-icons/fa';

const InstitutionFormComponent = ({ onCancel, onConfirm, inData }) => {
    const [formData, setFormData] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    // Populate the form data
    useEffect(() => {
        if (Array.isArray(inData) && inData.length === 0) {
            setFormData([
                { id: '0#', award: '', name: '', since: '', to: '', isNew: true }
            ]);
        } else if (Array.isArray(inData)) {
            setFormData(inData);
        }else {
            setFormData([]); // Fallback to an empty array if inData is not an array
        }
    }, [inData]);

    const handleFieldChange = (e, index, field) => {
        const newFormData = [...formData];
        newFormData[index][field] = e.target.value;
        setFormData(newFormData);
    }

    const handleAddField = () => {
        setFormData([...formData, { id: formData.length + '#', name: '', award: '', since: '', to: '', isNew: true }]);
    }
    const handleSubmit = () => {
        setIsLoading(true)
        const cleanedData = formData.map((inst) => {
            const { isNew, since, to, ...rest } = inst;
    
            // Convert the since and to fields to Date objects and format as YYYY-MM-DD
            const sinceDate = new Date(since).toISOString().split('T')[0];
            const toDate = new Date(to).toISOString().split('T')[0];
    
            if (isNew) {
                // Remove the id for new entries
                const { id, ...newInst } = rest;
                return {
                    ...newInst,
                    since: sinceDate,
                    to: toDate,
                };
            } else {
                // Keep the id for existing entries
                return {
                    ...rest,
                    since: sinceDate,
                    to: toDate,
                };
            }
        });
    
        // console.log(cleanedData);
    
        onConfirm(cleanedData);
    }
    
    

    return (
        <div id="alert-container">
            <div id="inst-form">
                <div>
                    <h4>Previous Institution</h4>
                    <div className="form-inputs">
                        {
                            formData.map((inst, index) => (
                                <div className="form-item" key={index}>
                                    <Input
                                        value={inst.name}
                                        name={`row_${index}`}
                                        onChange={(e) => handleFieldChange(e, index, 'name')}
                                        placeholder="Institution Name"
                                    />
                                    <Select
                                        options={awards}
                                        value={inst.award ? inst.award : "Award " }
                                        defaultValue
                                        name="award"
                                        onChange={(e) => handleFieldChange(e, index, 'award')}
                                        
                                    />
                                    <Input
                                        value={inst.since}
                                        name="since"
                                        type='date'
                                        aria-label="Date"
                                        onChange={(e) => handleFieldChange(e, index, 'since')}
                                        placeholder="Start Date"
                                    />
                                    <Input
                                        value={inst.to}
                                        name="to"
                                        type='date'
                                        aria-label="Date"
                                        onChange={(e) => handleFieldChange(e, index, 'to')}
                                        placeholder="End Date"
                                    />
                                </div>
                            ))
                        }
                        <div className="form-item">
                            <span onClick={handleAddField}><FaPlus /></span> Add more
                        </div>
                    </div>
                </div>
                <div className="model-footer">
                    <Button text="Cancel"  id="info" onClick={onCancel} />
                    <Button 
                        text={isLoading ? 'Wait...' : 'Submit'}
                        disabled={isLoading}
                        onClick={handleSubmit} 
                    />
                  
                </div>
            </div>
        </div>
    )
}

export default InstitutionFormComponent;
