import {useEffect, useState, useContext} from 'react'
import { RightsContext } from '../contexts/RightsProvider'
import RelationForm from '../components/ProfileForms/RelationComponentForm'
import { LuPenSquare } from 'react-icons/lu'
import { FaBedPulse } from 'react-icons/fa6'
import { CONFIG } from '../config'

const RelationComponent = ({id}) =>{
    const [relation, setRelation] = useState([])
    const [friend, setFriends] = useState([])
    const [loading, setLoading] = useState(true)
    const [register, setRegister] = useState(false)
    const [registerFriend, setRegisterFriend] = useState()
    const [activeData, setActiveData] = useState([])   
    const [load, setLoad] = useState(false)


    const {rights} = useContext(RightsContext)

    useEffect(() =>{

        const getData = async() =>{
            try {
                
                const response = await fetch(`${CONFIG.backend_url}/member/relation/${id}`, {
                    method: 'GET',
                    credentials: 'include', 
                    headers : {
                        'Content-Type': 'application/json'
                    }
                })
                const data = await response.json()
                if (response.ok){
                    // console.log(data)
                    const nok = data.filter((item)=>item.type)
                    const guardian = data.filter((item)=>!item.type)
                    setRelation(guardian)
                    setFriends(nok)
                }else{
                    console.log("Something happened")
                }
            } catch (error) {
                console.log(error.message)
            }finally{
                setLoading(false)
            }
        }

        getData()
        
    }, [load])

   

    const onCancel = () =>{
        setRegister(false)
        setRegisterFriend(false);
    }

    const onConfirm = (data) =>{
       
        const updateData = async () => {
            try {
                for (const item of data) {
                   
                    const response = await fetch(`${CONFIG.backend_url}/member/relation/${id}`, {
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
                      
                    } else {
                        console.log(response);
                    }
                }
               
                
            } catch (error) {
                console.log(error.message);
            } finally {
                
                setRegister(false);
                setRegisterFriend(false);
                setLoad(!load)
            }
        };
    
        updateData();
    }
    
    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <>
            {register && 
                <RelationForm
                    onCancel={onCancel}
                    onConfirm={onConfirm}
                    inData={relation}
                    nature ="Parent | Guardian"
                />
            }
             {registerFriend && 
                <RelationForm
                    onCancel={onCancel}
                    onConfirm={onConfirm}
                    inData={friend}
                    state= {true}
                     nature ="Next of Kin | Friend"
                />
            }
            <div className="profile-item">
                {((rights.member_id == id) || rights.perm.info_3 >= 2) && (
                    <div className="edit-icon" onClick={()=>setRegister(true)}  ><LuPenSquare /></div>   
                )}                    
                <div className="details">
                    <h4>Parents | Guardian</h4>
                    <div>
                        {relation.length > 0 ? (
                            relation.map((item, index)=>(
                                <p key={index}>{`${item.relation} : ${item.name}: ${item.contact}`}</p>
                            ))
                        ): (
                            <p>No data found</p>
                        )}
                        
                    </div>
                    
                </div>
            </div>
            <div className="profile-item">
                {((rights.member_id == id) || rights.perm.info_3 >= 2) && (
                    <div className="edit-icon"  onClick={()=>setRegisterFriend(true)} ><LuPenSquare /></div>   
                )}    
                <div className="details">
                    <h4>Next of Kin | Friends</h4>
                    <div>
                        {friend.length > 0 ? (
                            friend.map((item)=>(
                               
                                <p key={item.id}>{`${item.relation} : ${item.name}: ${item.contact}`}</p>
                                
                                
                            ))
                        ): (
                            <p>No data found</p>
                        )}
                        
                    </div>
                    
                </div>
            </div>
        </>
    )
}

export default RelationComponent