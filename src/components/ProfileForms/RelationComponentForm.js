import React, {useEffect, useState} from 'react';
import '../../styles/components.css';
import '../../styles/common.css';
import Button from '../Button';
import Select from '../SelectComponent';
import Input from '../InputComponet'
import humanRelations from '../../relations';
import {FaPlus} from 'react-icons/fa';


const RelationComponentForm = ({onCancel, onConfirm, inData, nature, state}) => {
    const [formData, setFormData] = useState([]);


    // POPULATE THE FORM DATA 
    useEffect(()=>{
        if (Array.isArray(inData) && inData.length === 0){
            setFormData([
                    { id: '0#', name: '', relation: '', contact: '' , isNew: true }
                ]
            )
        }else if (Array.isArray(inData)) {
           
            setFormData(inData);
            // console.log(newFormData)
        }else {
            setFormData([])
        }

    }, [inData])
    
    const handleFieldChange = (e, index, field) => {
        const newFormData = [...formData];
        newFormData[index][field] = e.target.value;
        setFormData(newFormData);
    }

    const handleAddField = () => {
        setFormData([...formData, { id: formData.length + '#', name: '', relation: '', contact: '', isNew: true }]);
    }

    const handleSubmit = () => {
        const cleanedData = formData.map((relation) => {
            const { isNew, ...rest } = relation;
    
            if (isNew) {
                const { id, ...newRelation } = rest;
                
                return state? {...newRelation, type: 1}: newRelation; // Return newRelation for new items
            }
    
            return state? {...rest, type: 1}: rest; // Return the original object if isNew is false
        });
    
        console.log(cleanedData);
        onConfirm(cleanedData)
    }


 
    

    return (
        <div id="alert-container">
            <div id="relation-form">
                <div>
                    <h4>{nature}</h4>
                    <div className="form-inputs">
                        {
                            formData.map((guardian, index) =>(
                                <div className="form-item" key={guardian.id}>
                                    <Input 
                                        value={guardian.name}
                                        name={`row_${guardian.id}`}
                                        onChange={(e)=>handleFieldChange(e, index, 'name')}
                                        placeholder="Name "
                                        defaultValue
                                        
                                    />
                                    <Select 
                                        options={humanRelations}
                                        value={guardian.relation}
                                        name="relation"
                                        defaultValue
                                        onChange={(e)=>handleFieldChange(e, index, 'relation')}
                                        label="Choose the relationship"
                                    />
                                    <Input 
                                        value={guardian.contact}
                                        name="contact"
                                        onChange={(e)=>handleFieldChange(e, index, 'contact')}
                                        placeholder="Phone number"
                                    />                          
                                </div>
                            ))
                        }
                        <div className="form-item">
                            <span onClick={handleAddField}><FaPlus /></span>                         
                        </div>
                    </div>
                </div>
                <div className="model-footer">
                    <Button text="Cancel" id="info" onClick={onCancel} />
                    <Button text="Submit" onClick={handleSubmit} />
                    
                </div>
            </div>
        </div>
    )
}

export default RelationComponentForm;
