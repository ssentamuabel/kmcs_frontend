import React from 'react'
import '../../styles/components.css'
import Select from '../SelectComponent'
import Button from '../Button'
import Input from '../InputComponet'

const Planning = () =>{

    const program_options = [
        {value: '1', name :'Male Quran '},
        {value: '2', name :'Family Darsu'},
        {value: '3', name :'Kachaayi'},
        {value: '4', name :'Quran Competition'},
        {value: '5', name :'Sports Gala'}
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
                   <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <td>No</td>
                                    <td>Item</td>
                                    <td>Qty</td>
                                    <td>Unit cost</td>
                                    <td>Total cost</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>
                                        <Input />
                                    </td>
                                    <td>
                                        <Input />
                                    </td>
                                    <td>
                                        <Input />
                                    </td>
                                    <td>
                                        <Input />
                                    </td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>Sugar</td>
                                    <td>2 kg</td>
                                    <td>4500</td>
                                    <td>9000</td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>Sugar</td>
                                    <td>2 kg</td>
                                    <td>4500</td>
                                    <td>9000</td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>Sugar</td>
                                    <td>2 kg</td>
                                    <td>4500</td>
                                    <td>9000</td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>Sugar</td>
                                    <td>2 kg</td>
                                    <td>4500</td>
                                    <td>9000</td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>Sugar</td>
                                    <td>2 kg</td>
                                    <td>4500</td>
                                    <td>9000</td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>Sugar</td>
                                    <td>2 kg</td>
                                    <td>4500</td>
                                    <td>9000</td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>Sugar</td>
                                    <td>2 kg</td>
                                    <td>4500</td>
                                    <td>9000</td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>Sugar</td>
                                    <td>2 kg</td>
                                    <td>4500</td>
                                    <td>9000</td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>Sugar</td>
                                    <td>2 kg</td>
                                    <td>4500</td>
                                    <td>9000</td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>Sugar</td>
                                    <td>2 kg</td>
                                    <td>4500</td>
                                    <td>9000</td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>Sugar</td>
                                    <td>2 kg</td>
                                    <td>4500</td>
                                    <td>9000</td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>Sugar</td>
                                    <td>2 kg</td>
                                    <td>4500</td>
                                    <td>9000</td>
                                </tr>

                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="4">Total</td>
                                    <td>900000</td>
                                </tr>
                            </tfoot>
                        </table>
                   </div>
                </div>
            </div>           
            
        </div>
    )
}

export default Planning