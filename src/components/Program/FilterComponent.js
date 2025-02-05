import React, {useState} from 'react'
import Button from '../Button'
import Input from '../InputComponet'
import Select from '../SelectComponent'
import '../../styles/common.css'

const FilterComponent = () =>{

    const today = new Date().toISOString().split("T")[0];
    const [date, setDate] = useState(today);


    const category_options = [
        {value: 'All', name :'All'},
        {value: 'Student', name :'Students'},
        {value: 'Alumnus', name :'Alumunus'}
    ]

    const program_options = [
        {value: 'All', name :'All'},
        {value: '1', name :'Male Quran '},
        {value: '2', name :'Family Darsu'},
        {value: '3', name :'Kachaayi'},
        {value: '4', name :'Quran Competition'},
        {value: '5', name :'Sports Gala'}
    ]

    return(
        <div className="report-table-filter">            
            <div className="filter-items">
                <div className="filter-item">
                    <p>Category</p>
                    <Select  
                         options={category_options}
                    />
                </div>
                <div className="filter-item">
                    <p>Program</p>
                    <Select 
                        options={program_options}
                    />
                </div>
                <div className="filter-item">
                    <p>From</p>
                    <Input 
                        type="date"
                        value={date}
                     />
                </div>
                <div className="filter-item">
                    <p>To</p>
                    <Input
                        type="date"
                        value={date}
                     />
                </div>
                <div className="filter-item">
                    <Button 
                        id="info"
                        text="Filter" 
                    />
                </div>

            </div>
            <div className="search-box">
                <Input
                    placeholder="Search........"
                />
            </div>
           
        </div>
    )
}


export default FilterComponent 