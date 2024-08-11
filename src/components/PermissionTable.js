import React from 'react'
import Select from '../components/SelectComponent'
import Button from '../components/Button'
import '../styles/components.css'
import '../styles/common.css'

const PermissionTable = ({role}) =>{
    console.log(role)
    return (
        <div id="permission-table">            
            <div className="table-container" >
                <table>
                    <thead>
                        <tr>
                           
                            <th>Name</th>
                            <th>View</th>
                            <th>Edit</th>
                            <th>Add</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            
                            <td>info_1</td>
                            <td><input type='checkbox' /></td>
                            <td><input type='checkbox' /></td>
                            <td><input type='checkbox' /></td>
                            <td><input type='checkbox' /></td>
                        </tr>
                        <tr>
                            
                            <td>info_2</td>
                            <td><input type='checkbox' /></td>
                            <td><input type='checkbox' /></td>
                            <td><input type='checkbox' /></td>
                            <td><input type='checkbox' /></td>
                        </tr>
                        <tr>
  
                            <td>Program</td>
                            <td><input type='checkbox' /></td>
                            <td><input type='checkbox' /></td>
                            <td><input type='checkbox' /></td>
                            <td><input type='checkbox' /></td>
                        </tr>
                        <tr>
 
                            <td>Activity</td>
                            <td><input type='checkbox' /></td>
                            <td><input type='checkbox' /></td>
                            <td><input type='checkbox' /></td>
                            <td><input type='checkbox' /></td>
                        </tr>
                        <tr> 
                            <td>Sms</td>
                            <td><input type='checkbox' /></td>
                            <td><input type='checkbox' /></td>
                            <td><input type='checkbox' /></td>
                            <td><input type='checkbox' /></td>
                        </tr>
                        <tr> 
                            <td>Settings</td>
                            <td><input type='checkbox' /></td>
                            <td><input type='checkbox' /></td>
                            <td><input type='checkbox' /></td>
                            <td><input type='checkbox' /></td>
                        </tr>
                        <tr> 
                            <td>Permissions</td>
                            <td><input type='checkbox' /></td>
                            <td><input type='checkbox' /></td>
                            <td><input type='checkbox' /></td>
                            <td><input type='checkbox' /></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}


export default  PermissionTable