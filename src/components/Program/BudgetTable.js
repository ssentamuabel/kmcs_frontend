import React, { useState, useEffect } from 'react'
import Input from '../InputComponet'
import EditableInput from '../EditableInput';


const BudgetTable = ({ columns, data }) => {

    const [name, setName] = useState('Sugar');
    const [budgetData, setBudgetData] = useState([])


    useEffect(() => {
        console.log(data)
        setBudgetData(data)
        
    }, [data])



    const handleInputChange  = (newvalue) =>{
        console.log(newvalue)
    }


    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        {columns && columns.length > 0 ? (
                            columns.map((col, index) => (
                                <th key={index}>{col.label}</th>
                            ))
                        ) : (<th colSpan="100%">No column data is provided</th>)}

                    </tr>
                </thead>
                <tbody>

                    {
                        budgetData && budgetData.length > 0 ? (

                            budgetData.map((entry) => (
                                <tr key={entry.no}>
                                    {columns.map((col, colId) => (
                                        <EditableInput
                                            key={colId}
                                            initialValue={entry[col.name]}
                                            onSave={(newvalue)=>handleInputChange(newvalue)}

                                        />
                                    ))}

                                </tr>

                            ))


                        ) : (<td colSpan="100%">No column data is provided</td>)
                    }



                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="5">Total</td>
                        <td>900000</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}

export default BudgetTable;