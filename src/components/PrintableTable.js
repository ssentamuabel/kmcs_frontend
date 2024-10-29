import '../styles/common.css'






const PrintableTable = ({columns, table_data})=>{
    return (
        <div  style={{ padding: '10px' }}>
            <h2>Custom Printable Table</h2>
            <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        {columns && columns.map((item, index)=>(
                            <th key={index}>{item.name}</th>
                        ))}
                            
                    </tr>
                </thead>
                <tbody>
                    {
                        table_data
                    }
                
                </tbody>
            </table>
        </div>
    )
}

export default PrintableTable