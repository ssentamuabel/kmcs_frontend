import React, {useContext} from 'react'
import { RightsContext } from '../contexts/RightsProvider';
import '../styles/components.css'
import '../styles/common.css'


const PrintableTable = ({fields,columns, table_data})=>{

    const { rights } = useContext(RightsContext);

    return (
        <div  style={{ padding: '2px' }}>
            <center>
            {rights.perm.type ? (
                        <div>
                            <h2 style={{padding: 0}}>Kyambogo University Muslim Alumni</h2>
                            <p style={{padding: 0}} >located at Nasse 8790. email:kyuma2021@gmail.com</p>
                        </div>
                        
                    ): (
                        <div>
                            <h2 style={{padding: 0}}>Kyambogo University Muslim Students Association</h2>
                            <p style={{padding: 0}} >Email:kyumsa00@gmail.com"</p>
                        </div>
                    )}
                    <h2>Members</h2>  
            </center> 
                     
           
            <div className="tabular-wrapper">
                
                <div className="table-container">
                    <table border="1" cellPadding="5" cellSpacing="0" style={{width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            
                            <tr>
                                {columns && columns.map((item, index)=>(
                                    <th key={index}>{item.name}</th>
                                ))}
                                
                            </tr>
                        </thead>
                        <tbody>
                            {table_data && table_data.length > 0 && columns ? (
                                    table_data.map((member, key) => (
                                    <tr key={member.id}>
                                        <td>{key + 1}</td>
                                        {fields.name && (
                                            <td >
                                                {member.sur_name + ' ' + member.first_name}
                                            </td>
                                        )}

                                        {
                                            fields.gender && (
                                                <td>{member.gender ? 'F' : 'M'}</td>
                                            )
                                        }

                                        {
                                            fields.contact && (
                                                <td>{member.user.contact}</td>
                                            )
                                        }
                                        {
                                            fields.course && !rights.perm.type && (
                                                <td>{member.course ? member.course : "Unknown"}</td>
                                            )
                                        }
                                        {
                                            fields.reg_no && !rights.perm.type && (
                                                <td>
                                                    {member.reg_no ? member.reg_no : "Not known"}
                                                </td>
                                            )
                                        }
                                        {
                                            fields.occupation && (
                                                <td>
                                                    {member.occupation ? member.occupation : member.proffession ? member.proffession : "Unknown"}
                                                </td>
                                            )
                                        }
                                        {
                                            fields.profession && (
                                                <td>
                                                    {member.proffession ? member.proffession : member.occupation ? member.occupation : "Unknown"}
                                                </td>
                                            )
                                        }

                                        {
                                            fields.email && (
                                                <td>{member.user.email}</td>
                                            )
                                        }

                                        {
                                            fields.hall && !rights.perm.type && (
                                                <td>
                                                    {member.hall_of_attachment ? member.hall_of_attachment : "Not known"}
                                                </td>
                                            )
                                        }

                                        {
                                            fields.residence && (
                                                <td>
                                                    {member.residence_address ? member.residence_address : "Not known"}
                                                </td>
                                            )
                                        }
                                        
                                    </tr>
                                    ))
                                ):(
                                    <tr>
                                        <td colSpan={7}>
                                               No data found                                     
                                        </td>
                                    </tr>
                                )}
                        </tbody>

                        {/* <tfoot>
                            <tr>
                                <td colspan="4">Ssentamu Abel (General Secretary): ....................</td>
                                
                                <td colspan="3">Ssentamu Yusuf (Chairman): ....................</td>
                            </tr>
                        </tfoot>  */}
                    </table>
                   
                </div>
            </div>  
            <div className="print-footer" style={{ display: 'flex', width: '100%', padding: '20px 0' }}>
                <div style={{ flex: 1, textAlign: 'left', marginRight: '2em' }}>
                    <p style={{margin: '0'}}>.........................</p>
                    <p><b>General Secretary</b></p>
                </div>
                <div style={{ flex: 1, textAlign: 'left', marginLeft: '2em' }}>
                    <p>.........................</p>
                    <p><b>Chairman</b></p>
                </div>
            </div>
  
        </div>
    )
}

export default PrintableTable