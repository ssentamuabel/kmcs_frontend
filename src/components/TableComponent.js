import React from 'react'
import '../styles/components.css'
import '../styles/common.css'
import Select from './SelectComponent'
import Input from './InputComponet'
import Button from './Button'

const TableComponent = ({columns, filter_data, table_data, memberClick})=>{


    return (      
            
            <div id="tabular-wrapper">
                {filter_data &&  (
                     <div id="filter-section">
                     <div id="add-button">
                         <Button text = "Add" />
                     </div>
                     <table>
                         <tr>
                             {
                                 filter_data.map((item,index)=>(
                                     <td key={index}>
                                         <p key={index}> {item.name}:</p>
                                         <Select
                                         options={item.options}
                                         label={item.label}                                   
                                         /> 
                                     </td>
                                     
                                 ))
                             }                                                                               
                             
                             <td>
                               
                                 <Button text = "filter" />
                             </td>
                         </tr>
                     </table>
                     <div id="table-search">
                         <Input />
                         <Button text = "Search" />
                     </div>
                 </div>
                )}
               
                <div id="table-container">
                    <table>
                        <thead>
                            <tr>
                                {columns && columns.map((item, index)=>(
                                    <th key={index}>{item.name}</th>
                                ))}
                                
                            </tr>
                        </thead>
                        <tbody>
                            {table_data ? (
                                table_data.map((member, key)=>(
                                    <tr key={member.id}>
                                        <td>{key}</td>
                                        <td onClick={memberClick} id="member-click">{member.sur_name + ' ' + member.first_name}</td>
                                        <td>{member.gender ? 'F': 'M'}</td>
                                        <td>{member.reg_no ? member.reg_no : "Unknown"}</td>
                                        <td>{member.hall_of_attachment ? member.hall_of_attachment : "Nanziri_"}</td>
                                        <td>{member.user.contact}</td>                               
                                        <td>{member.user.email}</td>
                                    </tr>
                                ))
                            ): (
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

export default  TableComponent