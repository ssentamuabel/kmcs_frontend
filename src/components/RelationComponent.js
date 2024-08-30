import {useEffect, useState, useContext} from 'react'
import { RightsContext } from '../contexts/RightsProvider'
import { LuPenSquare } from 'react-icons/lu'

const RelationComponent = ({id}) =>{
    const [relation, setRelation] = useState([])
    const {rights} = useContext(RightsContext)

    useEffect(() =>{
        setRelation([
            {id: 1, name: "Wife: Nattale Rossette:07896781"},
            { id: 2, name  : "Sister: Nattale Rossette : 07896781"},
            { id: 3, name  : "Friend: Kitenda Samuel : 07896780"}
        ])
    }, [])
    
    return (
        <>
            <div className="profile-item">
                {((rights.member_id == id) || rights.perm.info_3 >= 2) && (
                    <div className="edit-icon"  ><LuPenSquare /></div>   
                )}                    
                <div className="details">
                    <h4>Parents | Guardian</h4>
                    <div>
                        {relation.length > 0 ? (
                            relation.map((item)=>(
                                <p key={item.id}>{item.name}</p>
                            ))
                        ): (
                            <p>No data found</p>
                        )}
                        
                    </div>
                    
                </div>
            </div>
            <div className="profile-item">
                {((rights.member_id == id) || rights.perm.info_3 >= 2) && (
                    <div className="edit-icon"  ><LuPenSquare /></div>   
                )}    
                <div className="details">
                    <h4>Parents | Guardian</h4>
                    <div>
                        {relation.length > 0 ? (
                            relation.map((item)=>(
                                <p key={item.id}>{item.name}</p>
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