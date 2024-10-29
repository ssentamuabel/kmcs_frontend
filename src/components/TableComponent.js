import React, {useContext, useEffect, useState, useRef} from 'react'
import '../styles/components.css'
import Alert from './Alert'
import { RightsContext } from '../contexts/RightsProvider'
import AutoComplete from './AutoCompleteInputComponent'
import Input from './InputComponet'
import SendSms from './SendSmsComponent'
import BulkEmails from './BulkEmailsComponent'
import PrintableTable from './PrintableTable'
import Button from './Button'
import { courses } from '../courses'



import { useReactToPrint } from 'react-to-print'

const TableComponent = ({columns,  table_data, memberClick})=>{

    const {rights} = useContext(RightsContext)
    const [studentsData, setStudentsData] = useState([])
    const [smsDialogue, setSmsDialogue] = useState(false)
    const [emailDialogue, setEmailDialogue] = useState(false)
    const [courseCode, setCourseCode] = useState('')
    const [info, setInfo]= useState(false)
    const [smsRes, setSmsRes] = useState('')
    const [load, setLoad] = useState(false)
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



    const openMessage = () =>{
        
        setSmsDialogue(true)
    }
    const onSmsCancel = ()=>{
        setSmsDialogue(false)
    }

    const onSmsSend = (message) =>{
        setSmsRes(message)
        setSmsDialogue(false)
        setInfo(true)
        
    }

    const onEmailSend = (message) =>{
        setSmsRes(message)
        setEmailDialogue(false)
        setInfo(true)
    }


    const handlePrint = () => {
        const printContents = document.getElementById('printablediv').innerHTML;
        const newWindow = window.open('', '_blank'); // Open a new blank window or tab
    
        if (newWindow) {
            // Write the HTML content to the new window
            newWindow.document.open();
            newWindow.document.write(`
                <html>
                    <head>
                        <title>Print</title>
                        <style>
                            /* Add your printable styling here if necessary */
                            body { font-family: Arial, sans-serif; padding: 20px; }
                            table { width: 100%; border-collapse: collapse; }
                            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                        </style>
                    </head>
                    <body onload="window.print(); window.close();">
                        ${printContents}
                    </body>
                </html>
            `);
            newWindow.document.close(); // Close the document to trigger the loading
        }
    };
    

  

    return (      
        <div className="page-container">
            {
                smsDialogue && (
                <SendSms 
                    onSend ={onSmsSend}
                    onCancel = {onSmsCancel}
                    recipients = {rights.perm.type? alumniFilter: studentsData}
                 />
                )

            }
             {
                emailDialogue && (
                <BulkEmails 
                    onSend ={onEmailSend}
                    onCancel = {()=>setEmailDialogue(false)}
                    recipients = {rights.perm.type? alumniFilter: studentsData}
                 />
                )

            }
            {
                info && (
                    <Alert 
                        message = {smsRes}
                        onCancel = {()=>{setSmsRes('');setInfo(false)}}
                    />
                )
            }
            <div className="tabular-wrapper">
                  
                     <div className="filter-section">
                     <div className="add-button">
                        {
                            rights.perm.messages >= 4 && (
                                <>
                                    <Button 
                                        id="info"
                                        text = "Send Emails"  
                                        onClick={()=>setEmailDialogue(true)}                             
                                    />
                                    {/* <Button 
                                        id="info"
                                        text = "Send Sms"
                                        onClick={openMessage}
                                    /> */}
                                    <Button 
                                        id="info"
                                        text = "Print"
                                        onClick={handlePrint}
                                    />
                                </>
                                
                            )
                        }
                        
                     </div>
                     <table id="filter-table">
                        <tbody>
                            <tr>
                               <td>
                                    Entry: 
                                    <Input 
                                     
                                        onChange = {(e)=>{setEntry(e.target.value); setLoad(!load)}}
                                        placeholder ="Entry ie 11, 12, 13...n"
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
                                        id="info"
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
                    <div id="printablediv"  >
                        <PrintableTable  />
                    </div>
                    
                    
                </div>
            </div>      

        </div>                    
              
    )
}

export default  TableComponent