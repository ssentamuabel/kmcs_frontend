import React, {useEffect, useState} from 'react'
import Input from '../InputComponet'
import Button from '../Button'
import SplitString from '../splitStringToObjects '
import {FaPlus} from 'react-icons/fa'

const HobbiesFormComponent = ({onCancel, onConfirm, inData})=>{
    const [formData, setFormData] = useState([])


    // POPULATE THE DATA FORM
    useEffect(()=>{
        if (inData){
            const ob = SplitString(inData, '|')

            setFormData(ob)
            // console.log(ob)
          
        }else{
            setFormData([{id: 1, value: ""}])
        }
    }, [inData])

    const handleAddField = () =>{
        setFormData([...formData, {id: formData.length +1 , value : ''}])
    }
    const handleFieldChange = (e, index) =>{
        const newFormData = [...formData];
        newFormData[index].value = e.target.value;
        setFormData(newFormData);
    }
    const handleSubmit = ()=>{
        

        const upadatedData = formData.map((item) =>item.value).join(' | ')
        onConfirm({data:upadatedData, id:'hobby'})
    }

    return (
        <div id="alert-container">
            <div id="hobbies-form">
                <div>
                    <h4>Hobbies</h4>
                    <div className="form-inputs">
                        {
                            formData.map((hobby, index) =>(
                                <div className="form-item" key={hobby.id}>
                                    <Input 
                                        value={hobby.value}
                                        name={`hobby_${hobby.id}`}
                                        onChange = {(e)=>handleFieldChange(e, index)}
                                        placeholder = "Hobby"
                                        
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
                    <Button text="Submit" onClick={handleSubmit}  />
                    <Button text="Cancel" onClick={onCancel} />
                </div>
            </div>

        </div>
    )
}

export default HobbiesFormComponent;