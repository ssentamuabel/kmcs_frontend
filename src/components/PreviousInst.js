import {useEffect, useState} from 'react'
import PreviousInstForm from '../components/ProfileForms/InstitutionFormComponent'
import { LuPenSquare } from 'react-icons/lu'


const PreviousInst = ({id}) => {
    const [inst, setInst] = useState([])
    const [loading, setLoading] = useState(true)
    const [register, setRegister] = useState(false)


    useEffect(() => {

        const getData = async()=>{
            try{

                const response = await fetch(`https://127.0.0.1:8000/member_inst/${id}`, {
                    method: 'GET',
                    credentials: 'include', 
                    headers : {
                        'Content-Type': 'application/json'
                    }
                })
                const data = await response.json()
                if (response.ok){
                    // console.log(data)
                    setInst(data)
                }else{
                    console.log("Something happened")
                }
            }catch(error){
                console.log(error.message)
            }finally{
               setLoading(false)
            }
        }

        getData()
        
        
    }, [])

    const openForm =()=>{
        setRegister(true)
    }
    const onCancel = () =>{
        setRegister(false)
    }
    const onConfirm = () =>{
        setRegister(false)
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
             {register && 
                <PreviousInstForm
                    onCancel={onCancel}
                    onConfirm={onConfirm}
                    inData={inst}
                />
            }
            <div className="profile-item">
                <div className="edit-icon" onClick={openForm} ><LuPenSquare /></div>   
                <div className="details">
                    <h4>Previous Inst </h4>
                    
                        <div>
                            {inst.length > 0 ? (
                                inst.map((item)=>(
                                    <p key={item.id}>{`${item.award} : ${item.name} : ${item.duration}`}</p>
                                ))
                            ): (
                                <p>No   data found</p>
                            )}
                        </div>

            
                    
                </div>
            </div>
        </>
        
    )
}

export default PreviousInst