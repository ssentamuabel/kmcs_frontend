import React, {useEffect, useState} from 'react'
import '../styles/components.css'
import '../styles/common.css'
import { CONFIG } from '../config'

const PrintableTable = ({columns, table_data})=>{

   



    return (
        <div  style={{ padding: '2px' }}>
            <center>
                <div>
                    <h2 style={{padding: 0}}>Kyambogo University Muslim Students Association</h2>
                    <p style={{padding: 0}} >located at Nasse 8790. email:kyuma2021@gmail.com</p>
                </div>
            </center>            
           
            <div className="tabular-wrapper">
                
                <div className="table-container">
                    <table border="1" cellPadding="5" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                {columns && columns.map((item, index)=>(
                                    <th key={index}>{item.name}</th>
                                ))}
                                
                            </tr>
                        </thead>
                        <tbody>
                            {table_data && table_data.length > 1 ? (
                                    table_data.map((member, key) => (
                                    <tr key={member.id}>
                                        <td>{key + 1}</td>
                                        <td >
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
                    <p style={{margin: '0'}}>Ssentamu Abel: .........................</p>
                    <p><b>General Secretary</b></p>
                </div>
                <div  style={{ width: '45%', textAlign: 'left' }}>
                    <p>Ssentamu Yusuf: .........................</p>
                    <p><b>Chairman</b></p>
                </div>
            </div>
  
        </div>
    )
}

export default PrintableTable