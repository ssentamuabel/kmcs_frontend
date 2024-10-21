import React , {useRef}from 'react'
import { useReactToPrint } from 'react-to-print';
import '../styles/common.css'

const Messages = () =>{
    return (
        <div className="page-container">
            <h3>Messages Page</h3>
        </div>
    )
}

// const Messages = React.forwardRef((ref)=>{
    
    
//     return (
//         <div ref={ref} style={{ padding: '20px' }}>
//             <h2>Custom Printable Table</h2>
//             <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
//                 <thead>
//                 <tr>
//                     <th>Name</th>
//                     <th>Age</th>
//                     <th>Email</th>
//                 </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         <td>Ssentamu Abel</td>
//                         <td>25</td>
//                         <td>abel@sents.com</td>
//                     </tr>
//                     <tr>
//                         <td>Ssentamu Abel</td>
//                         <td>25</td>
//                         <td>abel@sents.com</td>
//                     </tr>
//                     <tr>
//                         <td>Ssentamu Abel</td>
//                         <td>25</td>
//                         <td>abel@sents.com</td>
//                     </tr>
                
//                 </tbody>
//             </table>
//         </div>
//     )
// })

export default Messages