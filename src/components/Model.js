import React from 'react';
import FaceForm from '../components/ProfileForms/FaceFormComponent'
import BioForm from '../components/ProfileForms/BioFormComponent'
import RelationForm from '../components/ProfileForms/RelationComponent'
import Institution from '../components/ProfileForms/InstitutionFormComponent'
import Hobbies from '../components/ProfileForms/HobbiesFormComponent'
import Disability from '../components/ProfileForms/DisabilityFormComponent'

const Model = ({
  onCancel = () => {},
  onConfirm = () => {},
  inData,
  type
}) => {
  

  return (
    <>
        {type == "face" ? (
            <FaceForm 
                onCancel={onCancel}
                onConfirm={onConfirm}
                inData={inData}
            />
            ): type == "bio" ? (
            <BioForm 
                    onCancel={onCancel}
                    onConfirm={onConfirm}
                    inData={inData}
            />
            ) : type == "guardian" ? (
              <RelationForm 
                  onCancel={onCancel}
                  onConfirm={onConfirm}
                  inData={inData}
                  nature="guardian"            
              />
            ) : type == "kin" ? (
              (
                <RelationForm 
                    onCancel={onCancel}
                    onConfirm={onConfirm}
                    inData={inData}
                    nature="Next of Kin"            
                />
              )
            ) : type == "inst"  ?(
              (
                <Institution 
                    onCancel={onCancel}
                    onConfirm={onConfirm}
                    inData={inData}
                               
                />
              )
            ): type === "hobby" ? (
              <Hobbies 
                  onCancel={onCancel}
                  onConfirm={onConfirm}
                  inData={inData}
                             
              />
            ): type === "disability" ? (
                <Disability
                  onCancel={onCancel}
                  onConfirm={onConfirm}
                  inData={inData}
                 />
            ): (
              <Disability
                  onCancel={onCancel}
                  onConfirm={onConfirm}
                  inData={inData}
                 />
            )}
    </>
    
    
  );
};

export default Model;
