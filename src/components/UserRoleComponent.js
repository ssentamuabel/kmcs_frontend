import React from 'react'
import Button from '../components/Button'
import Select from '../components/SelectComponent'
import '../styles/components.css'
import '../styles/common.css'
import Input from '../components/InputComponet'

const UserRoleComponent = ({data}) =>{

  
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
                                        <td>{item.permission_name ? item.permission_name: ""}</td>
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