import React from 'react'
import Button from '../components/Button'
import Select from '../components/SelectComponent'
import '../styles/components.css'
import '../styles/common.css'
import Input from '../components/InputComponet'

const UserRoleComponent = ({data, permissionOptions}) =>{


    console.log(data)

    const handleRoleChange = async(e, id) =>{
        const value = e.target.value
        console.log(`permision_id : ${value}`);
        console.log(`user_id : ${id}`);
        console.log(permissionOptions)
        

        const newUser = data.filter((member)=>(member.id === id))

        
        console.log({...newUser[0], role_id: value})
       
        try{

            const response = await fetch(`https://127.0.0.1:8000/user/${id}`, {
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
  
    return (
        <div className="tabular-wrapper">
                
                <div className="filter-section">
                    <div className="add-button">
                        <Button text = "Add User" />
                    </div>
                    
                    <div className="table-search">
                        <Input />
                        <Button text = "Search" />
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
                            </tr>
                           
                        </thead>
                        <tbody>
                            {data ? (
                                data.map((item, key) =>(
                                    <tr key={item.id}>
                                        <td>{key}</td>
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