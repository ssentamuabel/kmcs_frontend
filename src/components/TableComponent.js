import React, {useContext, useEffect, useState} from 'react'
import '../styles/components.css'
import '../styles/common.css'
import Alert from './Alert'
import { RightsContext } from '../contexts/RightsProvider'
import AutoComplete from './AutoCompleteInputComponent'
import Input from './InputComponet'
import SendSms from './SendSmsComponent'
import BulkEmails from './BulkEmailsComponent'
import PrintableTable from './PrintableTable'
import PrintSelectionDialogue from './PrintSelectionComponent'
import Button from './Button'
import { courses } from '../courses'

const TableComponent = ({columns,  table_data, memberClick})=>{

    const {rights} = useContext(RightsContext)
    const [studentsData, setStudentsData] = useState([])
    const [smsDialogue, setSmsDialogue] = useState(false)
    const [emailDialogue, setEmailDialogue] = useState(false)
    const [courseCode, setCourseCode] = useState('')
    const [info, setInfo]= useState(false)
    const [printSelection, setPrintSelection]= useState(false);
    const [smsRes, setSmsRes] = useState('')
    const [load, setLoad] = useState(false)
    const [isLoading, setIsLoading]= useState(true)
    const [entry, setEntry] = useState('')
    const [alumniFilter, setAlumniFilter] = useState([])
    const [printFields, setPrintFields]= useState({})
    const [printColumns, setPrintColumns] = useState({})
    const [print, setPrint] = useState(false)


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
            setAlumniFilter(table_data);            
        }           
    }, [table_data, rights.perm.type, load]);
    

    // New useEffect to monitor alumniFilter or studentsData changes
    useEffect(() => {
        if (rights.perm.type && alumniFilter.length > 0) {
        setIsLoading(false); // Set isLoading to false after alumniFilter is populated
        } else if (!rights.perm.type && studentsData.length > 0) {
        setIsLoading(false); // Set isLoading to false after studentsData is populated
        }
    }, [alumniFilter, studentsData, rights.perm.type]);



    const handleFilter = () =>{
 
        const course = courses.find(
            (course) =>
              course.day === courseCode ||course.eve === courseCode
        );

        if (rights.perm.type){
            const filteredData = table_data.filter((item) =>{
                if (courseCode && entry){
                    return (item.reg_no.split('_')[2] === course.day ||item.reg_no.split('_')[2] === course.eve) &&  item.reg_no.split('_')[0] === entry;
                }else if (courseCode){
                    return (item.reg_no.split('_')[2] === course.day ||item.reg_no.split('_')[2] === course.eve);
                }else if (entry){
                    return  item.reg_no.split('_')[0] === entry;
                }
                return item
                
            })
    
            setAlumniFilter(filteredData)
        }else {
            const filteredData = studentsData.filter((item) =>{
                if (courseCode && entry){
                    return (item.reg_no.split('_')[2] === course.day ||item.reg_no.split('_')[2] === course.eve) &&  item.reg_no.split('_')[0] === entry;
                }else if (courseCode){
                    return (item.reg_no.split('_')[2] === course.day ||item.reg_no.split('_')[2] === course.eve);
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


    // Function to get the selected fields and submit them for printing
    const onFieldSelection = (fields)=>{
        setPrintFields(fields);
        const columns = [];
        const labels = {
            no: "No",
            name: "Name",
            gender: "Gender",
            contact: "Phone Number",
            course: "Course",
            reg_no: "Reg_no",    
            occupation: "Occupation",
            profession: "Profession",
            email: "Email",
            hall: "Hall of Attachment",
            residence: "Residence"
        }
        Object.entries(fields).forEach(([key, value], index)=>{
            if (value){
                columns.push({ id: index + 1, name: labels[key] });
            }
        })
        setPrintColumns(columns);
        setPrintSelection(false);
        setPrint(true);  // This triggers the effect to call handlePrint        
    }


    // useEffect to handle printing when print state is true
    useEffect(() => {
        if (print) {
            handlePrint();
            setPrint(false); // Reset the print state after printing
        }
    }, [print]);



    // Updated handlePrint function
    const handlePrint = () => {
        const printableElement = document.getElementById('printablediv');
        
        if (!printableElement) {
            console.warn("Printable element not found in the DOM");
            return;
        }
        
        const printContents = printableElement.innerHTML;
        const newWindow = window.open('', '_blank');

        if (newWindow) {
            newWindow.document.open();
            newWindow.document.write(`
                <html>
                    <head>
                        <title>KMCS</title>
                    </head>
                    <body onload="window.print(); window.close();">
                        ${printContents}
                    </body>
                </html>
            `);
            newWindow.document.close();
        }
    };

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
             {
                printSelection && (
                    <PrintSelectionDialogue                         
                        onCancel = {()=>{setPrintSelection(false)}}
                        onConfirm={onFieldSelection}
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
                                        text = "Print"
                                        onClick={()=>setPrintSelection(true)}
                                    />
                                    <Button 
                                        id="info"
                                        text = "Send Emails"  
                                        onClick={()=>setEmailDialogue(true)}                             
                                    />
                                    <Button 
                                        id="info"
                                        text = "Send Sms"
                                        onClick={openMessage}
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
                                
                                alumniFilter && alumniFilter.length > 0 && !isLoading ? (
                                    alumniFilter.map((member, key) => (
                                        <tr key={member.id}>
                                            <td>{key + 1}</td>
                                            <td onClick={() => memberClick(member.id)} id="member-click">
                                                {member.sur_name + ' ' + member.first_name}
                                            </td>
                                            <td>{member.gender ? 'F' : 'M'}</td>
                                            <td>{member.residence_address ? member.residence_address : "Unknown"}</td>
                                            <td>
                                                {member.occupation ? member.occupation : member.proffession ? member.proffession : "Unknown"}
                                            </td>
                                            <td>
                                                {member.proffession ? member.proffession : member.occupation ? member.occupation : "Unknown"}
                                            </td>
                                            <td>{member.user.email}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7}>{ isLoading && (
                                            <b>Wait as data is loading............</b>
                                           
                                            )}                                           
                                        </td>
                                    </tr>
                                )
                            ) : (
                                studentsData && studentsData.length > 0 && !isLoading ? (
                                    studentsData.map((member, key) => (
                                        <tr key={member.id}>
                                            <td>{key + 1}</td>
                                            <td onClick={() => memberClick(member.id)} id="member-click">
                                                {member.sur_name + ' ' + member.first_name}
                                            </td>
                                            <td>{member.gender ? 'F' : 'M'}</td>
                                            <td>{member.course ? member.course : "Unknown"}</td>
                                            <td>
                                                {member.residence_address ? member.residence_address : member.hall_of_attachment ? member.hall_of_attachment : "Unknown"}
                                            </td>
                                            <td>{member.hall_of_attachment ? member.hall_of_attachment : "Unknown"}</td>
                                            <td>{member.user.email}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7}>{ isLoading && (
                                            <b>Wait as data is loading............</b>
                                           
                                            )}                                           
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>

                        {/* <tfoot>
                            <tr>
                                <td colspan="7">Total: 600</td>
                            </tr>
                        </tfoot> */}
                    </table>
                   
                    
                </div>
                {print && <div id="printablediv"  >                        
                    <PrintableTable fields={printFields} table_data={rights.perm.type? alumniFilter : studentsData} columns={printColumns}  />
                </div>  }
                
            </div>      

        </div>                    
              
    )
}

export default  TableComponent
