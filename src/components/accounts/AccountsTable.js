import { useEffect, useState } from "react";
import {
    FaEdit

} from 'react-icons/fa'



const AccountsTable = ({data, handleEdit}) =>{

    const [accounts, setAccounts] = useState([])

    useEffect(() =>{
        // console.log(data);
        setAccounts(data)
    }, [data])

    return (
        <div className="table-container"> 
            <table>
                <thead>
                    <tr>
                        <th>No</th>
                         <th>Account Type</th>
                        <th>Balance(UGx)</th>
                        <th>Code</th>                       
                        <th>Name</th>
                        <th>Description</th>
                        <th>Is_active</th>
                        <th>Created At</th>
                        <th>Actions</th>
                        
                    </tr>
                </thead>
                <tbody>
                    {accounts && accounts.length > 0 ? (
                        accounts.map((account, key)=>(
                            <tr key={account.id}>
                                <td>{key + 1}</td>
                                <td>{account.account_type}</td>
                                <td>{account.balance}</td>
                                <td>{account.code}</td>
                                <td>{account.name}</td>                                
                                <td>{account.description}</td>
                                <td>{account.is_active ? "Active": "InActive"}</td>
                                <td>{account.created_at}</td>
                                <td onClick={()=>handleEdit(account.id)}> <FaEdit   size={18}  /></td> 
                            </tr>
                        ))
                    ):(
                        <tr>
                            <td colSpan={8}>No Account</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default AccountsTable;