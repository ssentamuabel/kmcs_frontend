import React from 'react'
import Filter from './FilterComponent';
import Table from './ReportTable';


const Report = () =>{
    return(
        <div id="report-section">
            <Filter />
            <Table />
        </div>
    )
}

export default Report