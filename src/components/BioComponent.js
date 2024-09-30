import {useEffect, useState, useContext} from 'react'
import Alert from '../components/Alert'
import BioForm from '../components/ProfileForms/BioFormComponent'
import { CONFIG } from '../config'
import '../styles/pages.css'
import { LuPenSquare } from 'react-icons/lu'
import { RightsContext } from '../contexts/RightsProvider'

const BioComponent = ({id, handleHobbyHealth}) =>{
    const [error, setError] = useState('')
    const [errorAlert, setErrorAlert] = useState(false)
    const [bio, setBio] = useState({})
    const [register, setRegister] = useState(false)
    const [loading, setLoading] = useState(true)
    const [gender, setGender] = useState('Gender')
    const [marital, setMarital] = useState("Single")

    const {rights} = useContext(RightsContext)


    useEffect(()=>{
        

        const getData = async() =>{
            try{
                
                const response = await fetch(`${CONFIG.backend_url}/member/${id}`, {
                    method : 'GET',
                    credentials: 'include', 
                    headers: {
                        'Content-Type' :'application/json'
                    }
                })

                const data =  await response.json()

                
                if (response.ok){
                    setBio(data)
                    setMarital(data.married ? 'Married' : 'Single');
                    setGender(data.gender ? 'Female' : 'Male');
                    handleHobbyHealth({hobby: data.hobbies, health: data.disability})
                    // console.log(data)
                   
                    
                }else{
                    setError(` ${data.detail}: try once again`)
                    setErrorAlert(true)
                }

            }catch(error){
                setError(error.message)
                setErrorAlert(true)
            }finally{
                setLoading(false)
            }
        }
        getData()
        
    }, [])

    const onCancel = ()=>{
        setRegister(false)
    }

    const onConfirm = (data) =>{
        // console.log(data)
        const updatedData = async()=>{

            try{
                
                const response = await fetch(`${CONFIG.backend_url}/member/${id}`, {
                    method : 'POST',
                    credentials: 'include', 
                    headers: {
                        'Content-Type' :'application/json'
                    },
                    body : JSON.stringify(data)
                })

                const res =  await response.json()

                if (response.ok){
                    setBio(res)
                                      
                    setMarital(res.married ? 'Married' : 'Single');
                    setGender(res.gender ? 'Female' : 'Male');
                    handleHobbyHealth({hobby: res.hobbies, health: res.disability})
                    console.log(res)
                    
                    
                }else{
                    console.log(res)
                    setError(` Something went wrong: try once again`)
                    setErrorAlert(true)
                }
                
                

            }catch(error){
                setError(error.message)
                setErrorAlert(true)
            }finally{
                setRegister(false)
            }
        }
        updatedData()
    }

    const openForm = () =>{
        setRegister(true)
    }

    if (loading) {
        return <div>Loading...</div>;
    }
    
    return (
        <>
            {register && 
                <BioForm
                    onCancel={onCancel}
                    onConfirm={onConfirm}
                    inData={bio}
                />
            }
            { 
                errorAlert && (<Alert 
                type='Error'
                message ={error}
                 onCancel={()=>{setErrorAlert(false)}}                     
                />)
            } 
            <div className="profile-item" id="second-item">
            {((rights.member_id == id) || rights.perm.info_3 >= 2) && (
                 <div className="edit-icon" onClick={openForm} ><LuPenSquare /></div>  
            )}
            
            <div className="details">
                
                <h4>{`${gender},  ${marital}` }</h4>
                <h4>{ bio.dob != null ? `Born at: ${bio.dob}`: 'Date of Birth'}</h4>
                <h4>{bio.home_address ? bio.home_address : "Home Address not given"}</h4>
                <h4>{bio.tribe ? bio.tribe : "Tribe not given"}</h4>
                <h4>{bio.languages? bio.languages.split('#').join(' | '): "No Languages Found"}</h4>
                
            </div>
        </div>
        </>
        

    )
}

export default BioComponent


























































































































































































































































































































