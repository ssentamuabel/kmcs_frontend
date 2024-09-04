import React, {useState, useContext} from 'react'
import { RightsContext } from '../contexts/RightsProvider';
import Input from '../components/InputComponet'
// import "react-datepicker/dist/react-datepicker.css";

// import DatePicker from "react-datepicker";
// import {RightsContext} from '../contexts/RightsProvider'
// import PlacesAutocomplete, {
//     geocodeByAddress,
//     geocodeByPlaceId,
//     getLatLng,
//   } from 'react-places-autocomplete';
import '../styles/common.css'




const Dashboard = ()=>{
    const { rights } = useContext(RightsContext);
    
    const [startDate, setStartDate] = useState(new Date());
    

    return (
        <div className='container'>
           
            <h1>This is the Dashboard</h1>
            <div>
                <input aria-label="Date" type="date" />
               
            </div>
            <p>{startDate.toLocaleDateString()}</p>
           
        </div>
    )
}


export default Dashboard