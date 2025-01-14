import React, {useEffect, useState} from 'react'
import Button from '../components/Button'
import Select from '../components/SelectComponent'
import RemoveItem from '../RemoveItemInArray'
import '../styles/components.css'
import '../styles/common.css'
import Input from '../components/InputComponet'
import { CONFIG } from '../config'

const UserRoleComponent = ({data, permissionOptions}) =>{

    const [users, setUsers] = useState([]);
    const [checkColumn, setCheckColumn] = useState(false);

    const [selectedMembers, setSelectedMembers] = useState([]);
    const [checkedItems, setCheckedItems] = useState([]);

    useEffect(() =>{
        setUsers(data)
    }, [data])



    // console.log(data)
    const handleRoleChange = async(e, id) =>{
        const value = e.target.value    
        const newUser = data.filter((member)=>(member.id === id))

        try{

            const response = await fetch(`${CONFIG.backend_url}/user/${id}`, {
                method: 'POST',
                credentials: 'include',
                headers : {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({...newUser[0], role_id : value})
                
            })
            if (response.ok){
                const res = await response.json()
                console.log(res)
            }else{
                console.log("Something happened")
            }
        }catch(error){
            console.log("Something went wrong")
        }
    }

    const handleSearch = (e) =>{
        const value = e.target.value;        

        setUsers(filterByKeyword(data, value))

    }


    const submitUserChanges = () =>{
        console.log(checkedItems);
    }


    const handleClick = (e) =>{
       
        const value = e.target.value;

        if (checkedItems.includes(value)){            
            const items = checkedItems.filter(item=>item !== value)
            setCheckedItems(items);
        }else{
            setCheckedItems([...checkedItems, value]);
        }
       
    }


    const  filterByKeyword =(data, keyword)  =>{

        if (!keyword.trim()) {
            return data; // Return the original array if no keyword is provided
        }
        // Convert the keyword to lowercase for case-insensitive search
        const lowerKeyword = keyword.toLowerCase();
    
        return data.filter(item => {
            // Combine all searchable fields into a single string
            const combinedString = `
                ${item.contact} 
                ${item.email}          
            `.toLowerCase();
    
            // Check if the keyword is found within the combined string
            return combinedString.includes(lowerKeyword);
        });
    }
  
    return (
        <div className="tabular-wrapper">
                
                <div className="filter-section">
                    <div className="add-button">
                        <Button 
                            id="info" 
                            text = "Add User" 
                        />
                        {
                            checkColumn ? (
                                <Button 
                                   
                                    text = "Confirm User" 
                                    style={{marginLeft:'1em'}}
                                    onClick={submitUserChanges}
                                />
                            ) : (
                                <Button 
                                    id="info" 
                                    text = "Update Users" 
                                    style={{marginLeft:'1em'}}
                                    onClick={()=>setCheckColumn(true)}
                                />
                            )
                        }
                        
                    </div>
                    
                    <div className="table-search">
                        <Input 
                            placeholder="Search by key word"
                            onChange = {handleSearch}
                         />
                       
                    </div>
                </div>
                
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Contact</th>
                                <th>Role</th>
                                <th>Email</th>
                                {checkColumn && (<th>Select</th>)}
                                
                            </tr>
                           
                        </thead>
                        <tbody>
                            {data ? (
                                users.map((item ,index) =>(
                                    <tr key={item.id }>
                                        <td>{index +1 }</td>
                                        <td>{item.contact ? item.contact : ""}</td>
                                        <td>
                                            <Select                                                 
                                                options = {permissionOptions}
                                                label = "Role"
                                                defaultValue
                                                name={item.id}
                                                value ={item.permission_name ? item.permission_name: ""}
                                                onChange = {(e)=>handleRoleChange(e, item.id)}
                                            />
                                        </td>
                                        {/* <td>{item.permission_name ? item.permission_name: ""}</td> */}
                                        <td>{item.email ? item.email : ""}</td>
                                        {checkColumn && (
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    value={item.id}
                                                    checked={checkedItems.includes(item.id.toString())}
                                                    onChange={handleClick}
                                                />
                                            </td>
                                        )}
                                        
                                    </tr>
                                ))
                            ):(
                                <tr>
                                    <td colspan="7">No data Found </td>
                                </tr>
                            )}
                            
                            
                            
                        </tbody>
                        {/* <tfoot>
                            <tr>
                                <td colspan="7">Total: 600</td>
                            </tr>
                        </tfoot> */}
                    </table>
                </div>
            </div>        
    )
}

export default UserRoleComponent