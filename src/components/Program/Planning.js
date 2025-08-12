import React from 'react'
import '../../styles/components.css'
import Select from '../SelectComponent'
import Button from '../Button'

import BudgetTable from './BudgetTable'

const Planning = () =>{

    const program_options = [
        {value: '1', name :'Male Quran '},
        {value: '2', name :'Family Darsu'},
        {value: '3', name :'Kachaayi'},
        {value: '4', name :'Quran Competition'},
        {value: '5', name :'Sports Gala'}
    ]

    const data = [
        {"no":1, "item": "Sugar", "desc": "Kg", "qty": 6, "unit_cost": 300, "total_cost": 1800}, 
        {"no":2, "item": "Soap", "desc": "Box", "qty": 6, "unit_cost": 3000, "total_cost": 18000}, 
        {"no":3, "item": "Cooking Oil", "desc": "ltr", "qty": 8, "unit_cost": 1300, "total_cost": 19900}, 
        {"no":4, "item": "Sugar", "desc": "Kg", "qty": 6, "unit_cost": 300, "total_cost": 1800}, 
        {"no":5, "item": "Sugar", "desc": "Kg", "qty": 6, "unit_cost": 300, "total_cost": 1800}, 
        {"no":6, "item": "Sugar", "desc": "Kg", "qty": 6, "unit_cost": 300, "total_cost": 1800}, 
        {"no":7, "item": "Sugar", "desc": "Kg", "qty": 6, "unit_cost": 300, "total_cost": 1800}, 
        {"no":8, "item": "Sugar", "desc": "Kg", "qty": 6, "unit_cost": 300, "total_cost": 1800}, 
    ]

    const columns = [
        { name: "no", label: "#" },
        { name: "item", label: "Item" },
        { name: "desc", label: "Unit measure" },
        { name: "qty", label: "Quantity" },
        { name: "unit_cost", label: "Unit Cost" },
        { name: "total_cost", label: "Total Cost" },
    ]

    return(
        <div id="planning-section">      
            <div className="top">
                <Select 
                    options = {program_options}
                    label = "Program"                  
                    name="program"             
                />
                <Button text="Create" id="info" />
            </div>
            <div className="program-details">
                <div className="details">
                    <div className="details-info">
                        <div>
                            Name: <span>Family Darsu</span>
                        </div>
                        <div>
                            Venue: <span>Masjid Aisha</span>
                        </div>
                        <div>
                            From: <span>4:45pm</span>
                        </div>
                        <div>
                            To: <span>6:45pm</span>
                        </div>
                        <div>
                            Rate: <span>Weekly</span>
                        </div>
                        <div>
                            Charge: <span>Imaam</span>
                        </div>
                    </div>
                    <div id="activity-button">
                        <Button text="Create Activity"  />
                    </div>
                </div>
                <div className="program-costs">
                    <BudgetTable 
                        columns={columns}
                        data={data}
                    />
                </div>
            </div>           
            
        </div>
    )
}

export default Planning