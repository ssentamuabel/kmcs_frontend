import {useEffect, useState, useContext} from 'react'
import { RightsContext } from '../contexts/RightsProvider'
import PreviousInstForm from '../components/ProfileForms/InstitutionFormComponent'
import { LuPenSquare } from 'react-icons/lu'
import { CONFIG } from '../config'


const PreviousInst = ({id}) => {
    const [inst, setInst] = useState([])
    const [loading, setLoading] = useState(true)
    const [register, setRegister] = useState(false)


    const {rights} = useContext(RightsContext)


    useEffect(() => {

        const getData = async()=>{
            try{

                const response = await fetch(`${CONFIG.backend_url}/member_inst/${id}`, {
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
    const onConfirm = (data) => {
        setInst([])
        const updateData = async () => {
            try {
                for (const item of data) {
                    const response = await fetch(`${CONFIG.backend_url}/member_inst/${id}`, {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(item),
                    });
    
                    if (response.ok) {
                        const res = await response.json();
                        console.log(res);
                        setInst((prevInst) => [...prevInst, res]); // Append the new institution data to the list
                    } else {
                        console.log(response);
                    }
                }
            } catch (error) {
                console.log(error.message);
            } finally {
                setRegister(false);
            }
        };
    
        updateData();
    };
    

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
                {((rights.member_id == id) || rights.perm.info_2 >= 2) && (
                    <div className="edit-icon" onClick={openForm} ><LuPenSquare /></div>   
                )} 
               
                <div className="details">
                    <h4>Previous Inst </h4>
                    
                        <div>
                            {inst.length > 0 ? (
                                inst.map((item)=>(
                                    
                                    <p key={item.id}>{` ${item.since}: ${item.name} : ${item.award} : ${item.to} `}</p>
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