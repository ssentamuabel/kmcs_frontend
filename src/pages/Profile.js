import React, {useEffect, useState} from 'react'
import Alert from '../components/Alert'
import { LuPenSquare } from 'react-icons/lu'
import '../styles/pages.css'
import Button from '../components/Button'
import {FaRegUser} from 'react-icons/fa'
import Face from '../components/FaceComponent'
import Bio from '../components/BioComponent'
import Relation from '../components/RelationComponent'
import Inst from '../components/PreviousInst'



const Profile = ({onReturn, user}) =>{
    const [hobby, setHobby] = useState('')
    const [healthIssue, setHealthIssue] = useState('')
    const [infoMsg, setInfoMsg] = useState('')
    const [info, setInfo] = useState(false)

    const handleClick = (id) =>{
        setInfoMsg(`You can add or edit in ${id}`)
        setInfo(true)
    }

    const getHobbyHealth = ({hobby, health}) =>{
        setHobby(hobby)
         setHealthIssue(health)
    }
     

    return (       
        <div style={{width: '100%', position: 'relative'}} >
            { 
                info && (<Alert                 
                    message ={infoMsg}
                    onCancel={()=>{setInfo(false)}}                     
                />)
            } 
            <Button 
                text ="back"
                onClick={onReturn}
                style={{ marginBottom : 10 }}
            />
            <div id="profile-container">
                <div  id="prof-svg">
                    <FaRegUser />                   
                </div>
                <Face  id={user} />
                <Bio id={user} handleHobbyHealth = {getHobbyHealth} />
                <Relation  id={user} />
                <Inst id={user} />
                <div className="profile-item">
                    <div className="edit-icon"  onClick={()=>handleClick("First Section")} ><LuPenSquare /></div>   
                    <div className="details">
                        <h4>Hobbies </h4>
                        <div>
                            {hobby ? (
                                    <p>{hobby.split('#').join(' | ')}</p>
                                ): (
                                    <p>No   data found</p>
                                )}
                        </div>
                        
                    </div>
                </div>
                <div className="profile-item">
                    <div className="edit-icon"  ><LuPenSquare /></div>   
                    <div className="details">
                        <h4>Any Health Conditions </h4>
                        <div>
                            {healthIssue ? (
                                    <p>{healthIssue.split('#').join(' | ')}</p>
                                ): (
                                    <p>No  data found</p>
                                )}
                        </div>
                        
                    </div>
                    
                </div>
            </div>
        </div>
        
    )
}

export default Profile