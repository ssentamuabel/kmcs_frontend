import React, { useEffect, useState, useContext } from 'react';
import { RightsContext } from '../../contexts/RightsProvider';
import '../../styles/components.css';
import '../../styles/common.css';
import Input from '../InputComponet';
import Select from '../SelectComponent'
import Button from '../Button';
import { FaLocationDot } from "react-icons/fa6";
import { FaUserGear } from "react-icons/fa6";
import {
  

  FaPhoneAlt,
  FaUserTag,
  FaUserGraduate,
  FaBriefcase,
} from 'react-icons/fa';

const FaceFormComponent = ({ onCancel, onConfirm, inData }) => {

  const {rights} = useContext(RightsContext)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    sur_name: "",
    first_name: "",
    other_name: "",
    address: "",
    contact: "",
    occupation: "",
    profession: "",
    hall:"",
    skills: "",
    contacts: [],
    skillsList: [],
   
  });

  const hall_options = [
	{value: 'Kulubya', name :'Kulubya'},
	{value: 'Pearl', name :'Pearl'},
	{value: 'Mandella', name :'Mandella'},
	{value: 'North Hall', name :'North Hall'},
	{value: 'Nanziri', name :'Nanziri'}
]

  useEffect(() => {
    if (inData) {
      const { phone_numbers = [], skills = "" } = inData;
      const skillsList = skills ? skills.split('#') : [];

	//   console.log(inData)
      

      setFormData({
        sur_name: inData.sur_name || "",
        first_name: inData.first_name || "",
        other_name: inData.other_name || "",
		hall: inData.hall_of_attachment || "",
        address: inData.residence_address || "",
        contact: "",  // Set the latest contact in the input field
        occupation: inData.occupation || "",
        profession: inData.proffession || "",
        skills: "",
        contacts: phone_numbers.map((contact) => ({
          ...contact,
          isNew: false,  // Mark existing contacts
        })),
        skillsList: skillsList.map((skill, index) => ({ id: index, value: skill })),
        
      });
    }
  }, [inData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddContact = () => {
    if (formData.contact) {
      setFormData({
        ...formData,
        contacts: [
          ...formData.contacts,
          {id: null,   number: formData.contact, isNew: true } // Add new contact with no ID
        ],
        contact: "" // Reset the input field
      });
    }
  };

  const handleAddField = (field, listField) => {
    if (formData[field]) {
      setFormData({
        ...formData,
        [listField]: [
          ...formData[listField],
          { id: formData[listField].length, value: formData[field] } // Add new field with no ID
        ],
        [field]: "" // Reset the input field
      });
    }
  };

  const handleFieldChange = (e, listField, id) => {
    setFormData({
      ...formData,
      [listField]: formData[listField].map((item) =>
        item.id === id ? { ...item, value: e.target.value } : item
      ),
    });
  };

  const handleChanges = () => {
    const { contact, contacts, skills, skillsList} = formData;

	 // Add new contact if there is a value
	 const newContacts = contact ? [
		...contacts,
		{ id: null, number: contact , isNew:true} // Add new contact with no ID
	  ] : contacts;
    const newSkillsList = skills ? [...skillsList, { id: skillsList.length, value: skills }] : skillsList;
    const skillString = newSkillsList.map(item => item.value).join('#');
    
	if (!validateAddress(formData.address)) {
		return;
	}

    const updatedData = {
      sur_name: formData.sur_name,
      first_name: formData.first_name,
      other_name: formData.other_name,
      hall_of_attachment: formData.hall,
      residence_address: formData.address,
      phone_numbers: newContacts.map(contact => {
		// Conditionally include 'id' if it's not null
		return contact.isNew
		  ? { number: contact.number, type: 0 } // New contact without id
		  : { number: contact.number, id: contact.id, type: 0 }; // Existing contact with id
	  }),
      occupation: formData.occupation,
      proffession: formData.profession,
      skills: skillString,
     
    };

    onConfirm(updatedData);
	// console.log(updatedData)
  };


  const validateAddress = (address) =>{

	const reg = /^\s*[^,]+(\s+[^,]+)*(\s*,\s*[^,]+(\s+[^,]+)*){0,2}\s*$/

	if (reg.test(address)){
		setError('')
		return true;
	}

	setError('"village, district, Country" is the desired address')

	return false;

  }



  return (
    <div id="alert-container">
      <div id="face-form">
        <div>
          <h4>Face Data</h4>
          <div className="form-inputs">
            <div className="form-item">
              <Input
                name="sur_name"
                value={formData.sur_name}
                onChange={handleChange}
                placeholder="Sur name"
                icon={<FaUserTag />}
              />
            </div>
            <div className="form-item">
              <Input
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="First name"
                icon={<FaUserTag />}
              />
            </div>
            <div className="form-item">
              <Input
                name="other_name"
                value={formData.other_name}
                onChange={handleChange}
                placeholder="Other names"
                icon={<FaUserTag />}
              />
            </div>
            {formData.contacts.map((contact, index) => (
              <div className="form-item" key={contact.id}>
                <Input
                  name={`contact_${contact.id}`}
                  value={contact.number}
                  onChange={(e) => handleFieldChange(e, 'contacts', contact.id)}
                  placeholder={`Contact ${index + 1}`}
                  icon={<FaPhoneAlt />}
                />
              </div>
            ))}
            <div className="form-item">
              <Input
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                addbtn
                handleAddField={handleAddContact}
                placeholder="Other Contact"
                icon={<FaPhoneAlt />}
              />
            </div>
            <div className="form-item">
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder=" village, District, Country"
                icon={<FaLocationDot />}
				error={error}
              />
            </div>
            {rights.perm.type ? (
              <>
                <div className="form-item">
					<Input
						name="occupation"
						value={formData.occupation}
						onChange={handleChange}
						placeholder="Occupation"
						icon={<FaBriefcase />}
					/>
                </div>
				<div className="form-item">
					<Input
						name="profession"
						value={formData.profession}
						onChange={handleChange}
						placeholder="Profession"
						icon={<FaUserGraduate />}
					/>
				</div>
            	</>): (
					<div className="form-item">
						<Select 
                            options = {hall_options}
                            name="hall"
                            label="Hall of Attachment"
							defaultValue
                            value={formData.hall}
                            icon = {<FaBriefcase />}
                            onChange={handleChange}
                           
                         />
                	</div>
				)}
           
            
            {formData.skillsList.map((skill, index) => (
              <div className="form-item" key={skill.id}>
                <Input
                  name={`skill_${skill.id}`}
                  value={skill.value}
                  onChange={(e) => handleFieldChange(e, 'skillsList', skill.id)}
                  placeholder={`Skill ${index + 1}`}
                  icon={<FaUserGear />}
                />
              </div>
            ))}
            <div className="form-item">
              <Input
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                addbtn
                handleAddField={() => handleAddField('skills', 'skillsList')}
                placeholder="Other Skill"
                icon={<FaUserGear />}
              />
            </div>
            
          </div>
        </div>
        <div className="model-footer">
			<Button text="Cancel" id="info" onClick={onCancel} />
          <Button text="Submit" onClick={handleChanges} />
         
        </div>
      </div>
    </div>
  );
};

export default FaceFormComponent;
