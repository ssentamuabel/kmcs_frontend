import React, {useContext, useEffect, useState} from 'react'
import '../styles/components.css'
import '../styles/common.css'
import Select from './SelectComponent'
import { RightsContext } from '../contexts/RightsProvider'
import AutoComplete from './AutoCompleteInputComponent'
import Input from './InputComponet'
import Button from './Button'
import { courses } from '../courses'

const TableComponent = ({columns,  table_data, memberClick})=>{

    const {rights} = useContext(RightsContext)
    const [studentsData, setStudentsData] = useState([])
    const [courseCode, setCourseCode] = useState('')
    const [load, setLoad] = useState('false')
    const [entry, setEntry] = useState('')
    const [alumniFilter, setAlumniFilter] = useState([])
 

    

    useEffect(() => {
        // console.log(table_data)
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
        }else {
            setAlumniFilter(table_data)
        }
    }, [table_data, rights.perm.type, load]);
    

    const hall_options = [
        {value: '1', name: 'Kulubya'},
        {value: '2', name: 'Pearl'},
        {value: '3', name: 'Nanziri'},
        {value: '4', name: 'North Hall'}
    ]


    const handleFilter = () =>{
        // console.log(courseCode)
        // console.log(entry)

        if (rights.perm.type){
            const filteredData = table_data.filter((item) =>{
                if (courseCode && entry){
                    return item.reg_no.split('_')[2] === courseCode &&  item.reg_no.split('_')[0] === entry;
                }else if (courseCode){
                    return item.reg_no.split('_')[2] === courseCode;
                }else if (entry){
                    return  item.reg_no.split('_')[0] === entry;
                }
                return item
                
            })
    
            setAlumniFilter(filteredData)
        }else {
            const filteredData = studentsData.filter((item) =>{
                if (courseCode && entry){
                    return item.reg_no.split('_')[2] === courseCode &&  item.reg_no.split('_')[0] === entry;
                }else if (courseCode){
                    return item.reg_no.split('_')[2] === courseCode;
                }else if (entry){
                    return  item.reg_no.split('_')[0] === entry;
                }
                return item
                
            })

            setStudentsData(filteredData);
        }
        
       
    }


    const handleSearch = (e) =>{
       const value = e.target.value;

        if (rights.perm.type){
            
            setAlumniFilter(filterByKeyword(alumniFilter, value))
        }else{
            
            setStudentsData(filterByKeyword(studentsData, value))
            
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
                ${item.sur_name} 
                ${item.first_name} 
                ${item.other_name} 
                ${item.reg_no} 
                ${item.occupation || ''} 
                ${item.proffession || ''} 
                ${item.hall_of_attachment || ''} 
                ${item.residence_address || ''}                 
                ${item.user.contact} 
                ${item.user.email} 
                
            `.toLowerCase();
    
            // Check if the keyword is found within the combined string
            return combinedString.includes(lowerKeyword);
        });
    }

   
    

    return (      
        <div className="page-container">
            <div className="tabular-wrapper">
                  
                     <div className="filter-section">
                     <div className="add-button">
                         <Button text = "Send Message" />
                     </div>
                     <table>
                        <tbody>
                            <tr>
                               <td>
                                    Entry: 
                                    <Input 
                                        text ="Entry ie 11, 12, 13..."
                                        onChange = {(e)=>{setEntry(e.target.value); setLoad(!load)}}
                                        placeholder ="Entry turn"
                                     />
                               </td>                                                                          
                                
                                {/* {!rights.perm.type ? (
                                  <td>
                                      Hall: 
                                      <Select
                                          options={hall_options}
                                          label="Filter Hall"                                   
                                      />
                                  </td>
                                ):(<td></td>)} */}
                              
                                <td>
                                    Course:
                                    <AutoComplete                                    
                                        setValue={(code)=>setCourseCode(code)}
                                   
                                />
                                </td>
                                <td>
                                
                                    <Button 
                                        text = "filter"
                                        onClick={handleFilter} />
                                </td>
                            </tr>

                        </tbody>                         
                     </table>
                     <div className="table-search">
                        <Input  
                            placeholder=" Search by key word"
                            onChange = {handleSearch}
                        />
                         
                     </div>
                 </div>
            
               
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
                                alumniFilter ? (
                                    alumniFilter.map((member, key) =>(
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
                                                <td>{key +1}</td>
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