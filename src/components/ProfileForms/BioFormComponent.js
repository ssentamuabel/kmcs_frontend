import React, {useEffect, useState} from 'react'
import SplitString from '../splitStringToObjects '
import Input from '../InputComponet'
import Select from '../SelectComponent'
import Button from '../Button'
import '../../styles/components.css'
import '../../styles/common.css'
import { FaClock , FaUserCog, FaVenusMars, FaUbuntu} from 'react-icons/fa'
import { FaUserGear, FaLocationDot } from "react-icons/fa6";




const BioFormComponent = ({onCancel, onConfirm, inData})=>{

    const [formData, setFormData] = useState({
        gender: "",
        dob: "",
        home : "",
        tribe: "",
        hobby: "",
        healthIssue : "",
        language: "",
        hobbies: [],
        healthIssueList : [],
        languageList: [],        
        maritialStatus: ""
    })

    // POPULATE THE TABLE WITH THE DATA FROM THE PROFILE PAGE
    useEffect(()=>{
        if (inData){
            const {gender, dob, home_address, tribe, hobbies="", languages="", disability=""} = inData
            const languageList = languages ? languages.split("#"): [];
            const hobbyList = hobbies ? hobbies.split("#"): [];
            const IssueList = disability ? disability.split("#"): [];

            

            setFormData({
                gender: gender ? "Female": "Male" || "",
                dob: dob || "",
                home: home_address || "",
                languageList: languageList.map((lang, index) => ({ id: index, value: lang })),
                hobbies: hobbyList.map((hobby, index) => ({ id: index, value: hobby })),
                healthIssueList: IssueList.map((issue, index) => ({ id: index, value: issue })),
                tribe: tribe || "",
                maritialStatus: inData.married? "Married": "Single",
                language: "",
                hobby: "",
                healthIssue : ""

            })
        }
    },[inData])

    const handleChange = (e) =>{
        setFormData({
            ... formData,
            [e.target.name]: e.target.value
        })
    }

    const handleAddField = (field, listField) => {
        if (formData[field]) {
          setFormData({
            ...formData,
            [listField]: [...formData[listField], { id: formData[listField].length, value: formData[field] }],
            [field]: ""
          });
        }
      }
      const handleFieldChange = (e, listField, id) => {
        setFormData({
          ...formData,
          [listField]: formData[listField].map((item) =>
            item.id === id ? { ...item, value: e.target.value } : item
          )
        });
      };

    const handleChanges = ()=>{

        const newLanguages = formData.language ? [...formData.languageList, {id: formData.languageList.length, value:formData.language}] : formData.languageList
        const newHobbies = formData.hobby ? [...formData.hobbies, {id: formData.hobbies.length, value:formData.hobby}] : formData.hobbies
        const newHealthIssueList = formData.healthIssue ? [...formData.healthIssueList, {id: formData.healthIssueList.length, value:formData.healthIssue}] : formData.healthIssueList

        const langstring = newLanguages.map(item=>item.value.trim()).join('#')
        const hobbyString = newHobbies.map(item=>item.value.trim()).join('#') 
        const issueString = newHealthIssueList.map(item=>item.value.trim()).join('#')

        const updatedData ={
            gender: formData.gender == "Female" ? true : false,
            married: formData.maritialStatus === "Married" ? true: false,
            dob: formData.dob,
            home_address : formData.home,
            tribe: formData.tribe,
            languages: langstring,
            hobbies: hobbyString,
            disability : issueString
        }

        onConfirm(updatedData)
        // console.log(updatedData)
    }


    return (
        <div id = "alert-container">
            <div id="bio-form">
                <div>
                    <h4>Bio Data</h4>
                    <div className='form-inputs'>
                        <div className="form-item">
                            <Select
                               options = {[
                                {value:"Male", name : "Male"},
                                {value:"Female", name : "Female"},
                               ]}

                                name="gender"
                                placeholder="Gender"
                                defaultValue
                                value ={formData.gender}
                                label = "Choose your gender"
                                icon={<FaVenusMars />}
                                onChange = {handleChange}
                            />
                        </div>
                        <div className="form-item">
                            <Select
                               options = {[
                                {value:"Married", name : "Married"},
                                {value:"Single", name : "Single"},
                               ]}
                                name="maritialStatus"
                                placeholder="Maritial Status"
                                label = "Maritial Status"
                                value ={formData.maritialStatus}
                                defaultValue
                                icon={<FaUserCog />}
                                onChange = {handleChange}
                            />
                        </div>
                        <div className="form-item">
                            <Input
                                type = 'date'
                                name="dob"
                                placeholder="Date of birth"
                                icon={<FaClock />}
                                value={formData.dob}
                                onChange = {handleChange}
                            />
                        </div>
                        <div className="form-item">
                            <Input
                               name="home"
                                placeholder="Home Address"
                                icon={<FaLocationDot />}
                                value = {formData.home}
                                onChange = {handleChange}
                            />
                        </div>
                        <div className="form-item">
                            <Input
                               name="tribe"
                                placeholder="Tribe"
                                icon={<FaUbuntu />}
                                value={formData.tribe}
                                onChange = {handleChange}
                            />
                        </div>
                        {
                            formData.languageList.map((language, index) =>(
                                <div className="form-item" key = {language.id}>
                                    <Input 
                                        name={`language_ ${language.id}`}
                                        value={language.value}
                                        onChange ={(e)=>handleFieldChange(e, 'languageList', language.id)}
                                        placeholder = {`language_ ${index + 1}`}
                                        icon={<FaUserCog />}
                                    />
                                </div>
                            ))
                        }
                        <div className="form-item">
                            <Input                               
                                placeholder="Language"
                                name="language"
                                onChange={handleChange}
                                handleAddField={()=>{handleAddField('language', 'languageList')}}
                                value={formData.language}
                                icon={<FaUserCog />}
                                addbtn
                            />
                        </div>
                        {
                            formData.hobbies.map((hobby, index) =>(
                                <div className="form-item" key = {hobby.id}>
                                    <Input 
                                        name={`language_ ${hobby.id}`}
                                        value={hobby.value}
                                        onChange ={(e)=>handleFieldChange(e, 'hobbies', hobby.id)}
                                        placeholder = {`hobby_${index + 1}`}
                                        icon={<FaUserCog />}
                                    />
                                </div>
                            ))
                        }
                        <div className="form-item">
                            <Input                               
                                placeholder="Hobby"
                                name="hobby"
                                onChange={handleChange}
                                handleAddField={()=>{handleAddField('hobby', 'hobbies')}}
                                value={formData.hobby}
                                icon={<FaUserCog />}
                                addbtn
                            />
                        </div>
                        {
                            formData.healthIssueList.map((issue, index) =>(
                                <div className="form-item" key = {issue.id}>
                                    <Input 
                                        name={`issue_${issue.id}`}
                                        value={issue.value}
                                        onChange ={(e)=>handleFieldChange(e, 'healthIssueList', issue.id)}
                                        placeholder = {`issue_${index + 1}`}
                                        icon={<FaUserCog />}
                                    />
                                </div>
                            ))
                        }
                        <div className="form-item">
                            <Input                               
                                placeholder="Health Issue"
                                name="healthIssue"
                                onChange={handleChange}
                                handleAddField={()=>{handleAddField('healthIssue', 'healthIssueList')}}
                                value={formData.healthIssue}
                                icon={<FaUserCog />}
                                addbtn
                            />
                        </div>
                    </div>

                </div>
                <div className="form-footer">
                    <Button text="Submit" onClick={handleChanges} />
                    <Button text="Cancel"   onClick={onCancel} />
                </div>
            </div>

        </div>
    )
}

export default BioFormComponent