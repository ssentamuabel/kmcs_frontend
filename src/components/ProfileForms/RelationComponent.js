import React, {useEffect, useState} from 'react';
import '../../styles/components.css';
import SplitString from '../splitStringToObjects '
import '../../styles/common.css';
import Button from '../Button';
import Select from '../SelectComponent';
import Input from '../InputComponet'
import humanRelations from '../../relations';
import {FaPlus} from 'react-icons/fa';


const RelationComponent = ({onCancel, onConfirm, inData, nature}) => {
    const [formData, setFormData] = useState([]);


    // POPULATE THE FORM DATA 
    useEffect(()=>{
        if (inData.length === 0){
            setFormData([
                    { id: 1, name: '', relation: '', contact: '' }
                ]
            )
        }else{
            const newFormData = inData.map((item, index) => ({
                id: index + 1,
                name: SplitString(item.name, ':')[1].value,
                relation: SplitString(item.name, ':')[0].value,
                contact: SplitString(item.name, ':')[2].value,
                db_id: item.id
            }));
            setFormData(newFormData);
            // console.log(newFormData)

        }

    }, [inData])
    
    const handleFieldChange = (e, index, field) => {
        const newFormData = [...formData];
        newFormData[index][field] = e.target.value;
        setFormData(newFormData);
    }

    const handleAddField = () => {
        setFormData([...formData, { id: formData.length + 1, name: '', relation: '', contact: '' }]);
    }

    const handleSubmit = () => {
       
        // CONSTRUCT STRINGS FOR THE DATA       
        const updatedData = [];

        formData.map((item) =>(
            updatedData.push({id: item.db_id? item.db_id: '',  name: ` ${item.relation}: ${item.name}:  ${item.contact}` })
            
        ))

        // SUBMIT THE DATA TO THE PROFILE PAGE
        const id = nature == 'guardian' ? 'guardian' : 'kin'

        onConfirm({data:updatedData, id:id})

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
                                        placeholder="Parent Name"
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
                <div id="model-footer">
                    <Button text="Submit" onClick={handleSubmit} />
                    <Button text="Cancel" onClick={onCancel} />
                </div>
            </div>
        </div>
    )
}

export default RelationComponent;
