import React, {useEffect, useState, useContext} from 'react'
import Alert from '../components/Alert'
import { LuPenSquare } from 'react-icons/lu'
import { RightsContext } from '../contexts/RightsProvider'
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

    const {rights} = useContext(RightsContext)

    const handleClick = (id) =>{
        setInfoMsg(`You can add or edit in ${id}`)
        setInfo(true)
    }

    const getHobbyHealth = ({hobby, health}) =>{
        setHobby(hobby)
        setHealthIssue(health)
    }
     

    return ( 
        <div className="page-container">
            <div style={{width: '100%', position: 'relative'}} >
            { 
                info && (<Alert                 
                    message ={infoMsg}
                    onCancel={()=>{setInfo(false)}}                     
                />)
            } 
           {

            !(rights.member_id === user) && (
                <Button 
                    text ="back"
                    id="info"
                    onClick={onReturn}
                    style={{ marginBottom : 10 }}
                />)           
           }
            
            <div id="profile-container">
                <div  id="prof-svg">
                    <FaRegUser />                   
                </div>
                <Face  id={user} />
                {((rights.member_id == user) || rights.perm.info_3 > 0) && (
                <>
                    <Bio id={user} handleHobbyHealth = {getHobbyHealth} />
                    <Relation  id={user} />
                </>)}
               
                <Inst id={user} />
                <div className="profile-item">
                    {((rights.member_id == user) || rights.perm.info_2 >= 2) && (
                        <div className="edit-icon"  onClick={()=>handleClick("Bio Section")} ><LuPenSquare /></div>   
                    )}
                    
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
                {((rights.member_id == user) || rights.perm.info_3 > 0) && (
                
                    <div className="profile-item">
                        {((rights.member_id == user) || rights.perm.info_3 >= 2) && (
                            <div className="edit-icon" onClick={()=>handleClick("Bio Section")} ><LuPenSquare /></div> 
                        )}
              
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
                )}
               
            </div>
        </div>

        </div>         
    )
}

export default Profile