import { useEffect, useState } from "react";
import {
    FaEdit,
    FaInfoCircle

} from 'react-icons/fa'



const FinanceTable = ({data, handleEdit}) =>{

    const [entries, setEntries] = useState([])

    useEffect(() =>{
        console.log(data);
        setEntries(data)
    }, [data])

    return (
        <div className="table-container"> 
            <table>
                <thead>
                    <tr>
                        <th>No</th>
                         <th>Date</th>
                        <th>Reference</th>
                        <th>Description</th>                       
                        <th>Posted</th>
                        <th>Created_by</th>
                        <th>Amount</th>
                        <th>More</th>
                        <th>Edit</th>
                        
                        
                    </tr>
                </thead>
                <tbody>
                    {entries && entries.length > 0 ? (
                        entries.map((entry, key)=>(
                            <tr key={entry.id}>
                                <td>{key + 1}</td>
                                <td>{entry.date}</td>
                                <td>{entry.reference}</td>
                                <td>{entry.description}</td>
                                <td>{entry.is_posted ? "Posted": "Not Posted"}</td>
                                <td>{entry.created_by}</td>
                                <td>{entry.amount}</td>                             
                                <td onClick={()=>handleEdit(entry.id)}> <FaEdit   size={18}  /></td>
                                <td > <FaInfoCircle   size={18}  /></td> 
                            </tr>
                        ))
                    ):(
                        <tr>
                            <td colSpan={8}>No Entries</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default FinanceTable;