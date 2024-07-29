import React from 'react'
import Button from '../components/Button'
import '../styles/pages.css'
import {FaRegUser} from 'react-icons/fa'
import Table from '../components/TableComponent'

const Profile = ({onReturn}) =>{
    return (
        <div style={{width: '100%'}}>
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
                    <div className = "details">
                        <h4>Yusuf Ssentamu Abel</h4>
                        <h4>Ntinda, Kampala, Uganda</h4>
                        <h4>0704147754, 0789651684, 0767665000</h4>
                        <h4>Software Developer | Business Man</h4>
                        <h4>Programming | System Design | Marketing</h4>
                    </div>           

                </div>
                <div className="profile-item" id="second-item">
                    <div className="details">
                        <h4>Male, Married</h4>
                        <h4>Born at 21-04-2022</h4>
                        <h4>Mpigi Katende</h4>
                        <h4>Muganda</h4>
                        <h4>Luganda | English | Lusoga | Luyankole</h4>
                        
                    </div>
                </div>
                <div className="profile-item">
                    <div className="details">
                        <h4>Parents | Guardian</h4>
                        <div>
                            <div>Father: Kitenda Samuel 07896780 </div>
                            <div>Mother: Nattale Rossette 07896781</div>
                        </div>
                        
                    </div>
                </div>
                <div className="profile-item">
                    <div className="details">
                        <h4>Next of Kin </h4>
                        <div>
                            <div>Wife: Nattale Rossette 07896781</div>
                            <div>Sister: Kitenda Samuel 07896780 </div>
                            <div>Friend: Nattale Rossette 07896781</div>
                        </div>
                        
                    </div>
                </div>
                <div className="profile-item">
                    <div className="details">
                        <h4>Previous Inst </h4>
                        <div>
                            <div>
                                <div>Katende Seconndary</div>
                                <div>UACE</div>
                                <div>School represenatitive</div>
                            </div>
                            <div>
                                <p>Kibibi Seconndary</p>
                                <p>UCE</p>
                                <p>School Sheik</p>
                            </div>
                            
                        </div>
                        
                    </div>
                </div>
                <div className="profile-item">
                    <div className="details">
                        <h4>Any Disability </h4>
                        <div>
                           None
                        </div>
                        
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Profile