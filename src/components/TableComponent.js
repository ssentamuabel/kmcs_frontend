import React, {useContext, useEffect, useState} from 'react'
import '../styles/components.css'
import '../styles/common.css'
import Select from './SelectComponent'
import { RightsContext } from '../contexts/RightsProvider'
import Input from './InputComponet'
import Button from './Button'
import { courses } from '../courses'

const TableComponent = ({columns, filter_data, table_data, memberClick})=>{

    const {rights} = useContext(RightsContext)
    const [studentsData, setStudentsData] = useState([])

    useEffect(() => {
        if (!rights.perm.type) {
          // Create a new array with the updated data
          const updatedStudentsData = table_data.map((item) => {
            const course = courses.find(
              (course) =>
                course.day === item.reg_no.split('_')[2] ||
                course.eve === item.reg_no.split('_')[2]
            );
      
            // Return the new item with the course name added
            return { ...item, course: course ? course.name : '' };
          });
      
          // Update the state with the new data
          setStudentsData(updatedStudentsData);
        }
      }, [table_data, rights.perm.type, courses]);
      
    

    return (      
        <div className="page-container">
            <div className="tabular-wrapper">
                {filter_data &&  (
                     <div className="filter-section">
                     <div className="add-button">
                         <Button text = "Send Message" />
                     </div>
                     <table>
                        <tbody>
                            <tr>
                                {
                                    filter_data.map((item,index)=>(
                                        <td key={index+1}>
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
                            {rights.perm.type ? (
                                table_data ? (
                                    table_data.map((member, key) =>(
                                        !(member.id === rights.member_id) && (
                                            <tr key={member.id}>
                                                <td>{key +1}</td>
                                                <td onClick={()=>memberClick(member.id)} id="member-click">{member.sur_name + ' ' + member.first_name}</td>
                                                <td>{member.gender ? 'F': 'M'}</td>
                                                <td>{member.residence_address ? member.residence_address  : "Unknown"}</td>
                                                <td>{member.occupation ? member.occupation : member.proffession ? member.proffession : "Unknown"}</td>
                                                <td>{member.proffession ? member.proffession : member.occupation ? member.occupation : "Unknown"}</td>                                                                       
                                                <td>{member.user.email}</td>
                                            </tr>
                                        )
                                        
                                    ))
                                ) : (<tr > <td colSpan={7}></td> </tr>)
                            ): (
                                studentsData ? (
                                    studentsData.map((member, key) =>(
                                        !(member.id === rights.member_id) && (
                                            <tr key={member.id}>
                                                <td>{key}</td>
                                                <td onClick={()=>memberClick(member.id)} id="member-click">{member.sur_name + ' ' + member.first_name}</td>
                                                <td>{member.gender ? 'F': 'M'}</td>
                                                <td>{member.course ? member.course : "Unknown"}</td>
                                                <td>{member.residence_address ? member.residence_address : member.hall_of_attachment ? member.hall_of_attachment : "Unknown"}</td>
                                                <td>{member.hall_of_attachment ? member.hall_of_attachment : "Unknown"}</td>                                                                         
                                                <td>{member.user.email}</td>
                                            </tr>
                                        )
                                        
                                    )) 
                                    
                                ):(<tr > <td colSpan={7}>No data Found</td> </tr>)
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

        </div>                    
              
    )
}

export default  TableComponent