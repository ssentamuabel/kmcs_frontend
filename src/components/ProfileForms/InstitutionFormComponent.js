import React, {useEffect, useState} from 'react';
import '../../styles/components.css';
import '../../styles/common.css';
import Button from '../Button';
import Select from '../SelectComponent';
import Input from '../InputComponet'
import awards from '../../awards';
import {FaPlus} from 'react-icons/fa';


const RelationComponent = ({onCancel, onConfirm, inData}) => {
    const [formData, setFormData] = useState([]);


    // POPULATE THE FORM DATA 
    useEffect(()=>{
        if (inData.length === 0){
            setFormData([
                    { id: 1, award: '', name: '', duration: '' }
                ]
            )
        }else{
            
            setFormData(inData);
            // console.log(newFormData)

        }

    }, [inData])
    
    const handleFieldChange = (e, index, field) => {
        const newFormData = [...formData];
        newFormData[index][field] = e.target.value;
        setFormData(newFormData);
    }

    const handleAddField = () => {
        setFormData([...formData, {id: formData.length, name: '', award: '', duration: '', isNew:true }]);
    }

    const handleSubmit = () => {
       
        

        console.log(formData)
    }

    return (
        <div id="alert-container">
            <div id="inst-form">
                <div>
                    <h4>Previous Institution</h4>
                    <div className="form-inputs">
                        {
                            formData.map((inst, index) =>(
                                <div className="form-item" key={inst.award}>
                                    <Input 
                                        value={inst.name}
                                        name={`row_${inst.award}`}
                                        onChange={(e)=>handleFieldChange(e, index, 'name')}
                                        placeholder="Institution Name"
                                        defaultValue
                                        
                                    />
                                    <Select 
                                        options={awards}
                                        value={inst.award}
                                        name="award"
                                        defaultValue
                                        onChange={(e)=>handleFieldChange(e, index, 'award')}
                                        label="Choose  the Award"
                                    />
                                    <Input 
                                        value={inst.duration}
                                        name="duration"
                                        onChange={(e)=>handleFieldChange(e, index, 'duration')}
                                        placeholder="Time Period"
                                    />                          
                                </div>
                            ))
                        }
                        <div className="form-item">
                            <span onClick={handleAddField}><FaPlus /></span>                         
                        </div>
                    </div>
                </div>
                <div id="model-footer">
                    <Button text="Submit" onClick={handleSubmit} />
                    <Button text="Cancel" onClick={onCancel} />
                </div>
            </div>
        </div>
    )
}

export default RelationComponent;
