import React, {useEffect, useState, useContext} from 'react'
import Button from '../components/Button'
import Alert from '../components/Alert'
import { RightsContext } from '../contexts/RightsProvider'
import Select from '../components/SelectComponent'
import '../styles/components.css'
import '../styles/common.css'
import Input from '../components/InputComponet'
import { CONFIG } from '../config'
import { FaLessThanEqual } from 'react-icons/fa6'

const UserRoleComponent = ({data, permissionOptions, loadUsers}) =>{

    const [users, setUsers] = useState([]);
    const [checkColumn, setCheckColumn] = useState(false);
    const [checkedItems, setCheckedItems] = useState([]);
    const [errorAlert, setErrorAlert] = useState(false)
    const [error, setError] = useState('')
    const [info, setInfo] = useState(false);
    const [infoMessage, setInfoMessage] = useState('')
    

    const {rights} = useContext(RightsContext)

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
                setInfoMessage("Role Changed");
                setInfo(true)
            }else{
                setError(`Something went wrong`);
                setErrorAlert(true);
            }
            
        }catch(error){
            setError(`Something went wrong ${error.message}`);
            setErrorAlert(true);
        }
    }

    const handleSearch = (e) =>{
        const value = e.target.value;        

        setUsers(filterByKeyword(data, value))
    }


    const submitUserChanges = async() =>{
       
        const users = checkedItems.map(item=>Number(item))
        // console.log(users)

        try{
            const response = await fetch(`${CONFIG.backend_url}/update_user_type/`, {
                method: 'POST',
                credentials: 'include',
                headers : {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({users: users, type : rights.perm.type})
                
            })
            if (response.ok){
                setInfoMessage("Users Updated");
                loadUsers()
                setInfo(true)
                setCheckColumn(false)
                
            }else{
                setError(`Something went wrong`);
                setErrorAlert(true);
            }
        }catch(error){
            setError(`Something went wrong ${error.message}`);
            setErrorAlert(true);
        }


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
            { 
                errorAlert && (<Alert 
                type='Error'
                message ={error}
                 onCancel={()=>{setErrorAlert(false)}}                     
                />)
             }
             { info && (<Alert 
                
                message ={infoMessage}
                onCancel={()=>{setInfo(false); }} 
                
                />)           
            }
                
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