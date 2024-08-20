import React, {useContext} from 'react'
import '../styles/components.css'
import '../styles/common.css'
import Select from './SelectComponent'
import { RightsContext } from '../contexts/RightsProvider'
import Input from './InputComponet'
import Button from './Button'

const TableComponent = ({columns, filter_data, table_data, memberClick})=>{

    const {rights} = useContext(RightsContext)

    return (      
            
            <div className="tabular-wrapper">
                {filter_data &&  (
                     <div className="filter-section">
                     <div className="add-button">
                         <Button text = "Add" />
                     </div>
                     <table>
                        <tbody>
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

                        </tbody>                         
                     </table>
                     <div className="table-search">
                         <Input />
                         <Button text = "Search" />
                     </div>
                 </div>
                )}
               
                <div className="table-container">
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
                                    rights.perm.type ? (                                       
                                        <tr key={member.id}>
                                            <td>{key}</td>
                                            <td onClick={()=>memberClick(member.id)} id="member-click">{member.sur_name + ' ' + member.first_name}</td>
                                            <td>{member.gender ? 'F': 'M'}</td>
                                            <td>{member.residence_address ? member.residence_address  : "Unknown"}</td>
                                            <td>{member.occupation ? member.occupation : member.proffession ? member.proffession : "Unknown"}</td>
                                            <td>{member.proffession ? member.proffession : member.occupation ? member.occupation : "Unknown"}</td>                                                                       
                                            <td>{member.user.email}</td>
                                        </tr>
                                    ):(
                                        <tr key={member.id}>
                                            <td>{key}</td>
                                            <td onClick={()=>memberClick(member.id)} id="member-click">{member.sur_name + ' ' + member.first_name}</td>
                                            <td>{member.gender ? 'F': 'M'}</td>
                                            <td>{member.reg_no ? member.reg_no : "Unknown"}</td>
                                            <td>{member.residence_address ? member.residence_address : member.hall_of_attachment ? member.hall_of_attachment : "Unknown"}</td>
                                            <td>{member.hall_of_attachment ? member.hall_of_attachment : "Unknown"}</td>                                                                         
                                            <td>{member.user.email}</td>
                                        </tr>
                                    )
                                    
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