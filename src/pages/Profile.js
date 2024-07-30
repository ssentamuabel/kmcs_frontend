import React, {useEffect, useState} from 'react'
import Button from '../components/Button'
import '../styles/pages.css'
import {FaRegUser} from 'react-icons/fa'
import { LuPenSquare } from "react-icons/lu";
import Table from '../components/TableComponent'
import RegisterModel from '../components/Model'


const Profile = ({onReturn}) =>{
    const [face, setFace] = useState({})
    const [register, setRegister] = useState(false)
    const [bio, setBio] = useState({})
    const [guardian, setGuardian] = useState([])
    const [kin, setKin] = useState([])
    const [inst, setInst] = useState([])
    const [hobby, setHobby] = useState('')
    const [disability, setDisability] = useState('')
    


    useEffect(()=>{
        setFace({
            name : "Yusuf Ssentamu Abel",
            address : "Ntinda, Kampala, Uganda",
            contacts : "0704147754, 0789651684, 0767665000",
            proffession : "Software Developer | Business Man",
            skills : "Programming | System Design | Marketing"
        })
        setBio({
            gender: "Male, Married",
            dob: "Born at 21-04-2022",
            home : "Mpigi Katende",
            tribe: "Muganda",
            languages: "Luganda | English | Lusoga | Luyankole"
    
        })
    
        setGuardian([
            {id: 1, name: "Father: Kitenda Samuel 07896780"},
            { id: 2, name  : "Mother: Nattale Rossette 07896781"}
        ])
    
        setKin([
            {id: 1, name: "Wife: Nattale Rossette 07896781"},
            { id: 2, name  : "Sister: Nattale Rossette 07896781"},
            { id: 3, name  : "Friend: Kitenda Samuel 07896780"}
        ])
    
        setInst([
            {id: 1, name: "UACE: Katende Seconndary : Dormitory Prefect"},
            {id: 2, name: "UCE: Kibibi Seconndary : School Sheik"},
        ])
    
        setHobby("Reading | Dancing | Swimming | Farming")
    
    }, [])

    


    const handleProfileClick = (id)=>{
        
        setRegister(true)
    }



    return (
        <div style={{width: '100%', position: 'relative'}}>
            {register && <RegisterModel />}
            <Button 
                text ="back"
                onClick={onReturn}
                style={{ marginBottom : 10 }}
            />
            <div id="profile-container">
                <div  id="prof-svg">
                    <FaRegUser />                   
                </div>
                <div className="profile-item" id="first-item">  
                    <div className="edit-icon" onClick={()=>{handleProfileClick('face')}} ><LuPenSquare /></div>                 
                    <div className = "details">
                        <h4>{face.name}</h4>
                        <h4>{face.address}</h4>
                        <h4>{face.contacts}</h4>
                        <h4>{face.proffession}</h4>
                        <h4>{face.skills}</h4>
                    </div>           

                </div>
                <div className="profile-item" id="second-item">
                    <div className="edit-icon" onClick={()=>{handleProfileClick('bio')}} ><LuPenSquare /></div>   
                    <div className="details">
                        <h4>{bio.gender}</h4>
                        <h4>{bio.dob}</h4>
                        <h4>{bio.home}</h4>
                        <h4>{bio.tribe}</h4>
                        <h4>{bio.languages}</h4>
                        
                    </div>
                </div>
                <div className="profile-item">
                    <div className="edit-icon" onClick={()=>{handleProfileClick('guardian')}} ><LuPenSquare /></div>   
                    <div className="details">
                        <h4>Parents | Guardian</h4>
                        <div>
                            {guardian.length > 0 ? (
                                guardian.map((item)=>(
                                    <p key={item.id}>{item.name}</p>
                                ))
                            ): (
                                <p>No Parents | Guardian data found</p>
                            )}
                            
                        </div>
                        
                    </div>
                </div>
                <div className="profile-item">
                    <div className="edit-icon" onClick={()=>{handleProfileClick('kin')}} ><LuPenSquare /></div>   
                    <div className="details">
                        <h4>Next of Kin </h4>
                        <div>
                            {kin.length > 0 ? (
                                kin.map((item)=>(
                                    <p key={item.id}>{item.name}</p>
                                ))
                            ): (
                                <p>No Next of Kin  data found</p>
                            )}
                        </div>
                        
                    </div>
                </div>
                <div className="profile-item">
                    <div className="edit-icon" onClick={()=>{handleProfileClick('inst')}} ><LuPenSquare /></div>   
                    <div className="details">
                        <h4>Previous Inst </h4>
                        
                            <div>
                                {inst.length > 0 ? (
                                    inst.map((item)=>(
                                        <p key={item.id}>{item.name}</p>
                                    ))
                                ): (
                                    <p>No Next of Kin  data found</p>
                                )}
                            </div>
 
                
                        
                    </div>
                </div>
                <div className="profile-item">
                    <div className="edit-icon"  onClick={()=>{handleProfileClick('hobby')}} ><LuPenSquare /></div>   
                    <div className="details">
                        <h4>Hobbies </h4>
                        <div>
                            {hobby ? (
                                    <p>{hobby}</p>
                                ): (
                                    <p>No Hobby  data found</p>
                                )}
                        </div>
                        
                    </div>
                </div>
                <div className="profile-item">
                    <div className="edit-icon"  onClick={()=>{handleProfileClick('disability')}} ><LuPenSquare /></div>   
                    <div className="details">
                        <h4>Any Health Conditions </h4>
                        <div>
                            {disability ? (
                                    <p>{disability}</p>
                                ): (
                                    <p>No Hobby  data found</p>
                                )}
                        </div>
                        
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Profile