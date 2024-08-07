import {useEffect, useState} from 'react'
import { LuPenSquare } from 'react-icons/lu'

const RelationComponent = ({id}) =>{
    const [relation, setRelation] = useState([])

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
                <div className="edit-icon"  ><LuPenSquare /></div>   
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
                <div className="edit-icon" ><LuPenSquare /></div>   
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