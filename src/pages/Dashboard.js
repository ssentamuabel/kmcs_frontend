import React, {useState, useContext} from 'react'
import { RightsContext } from '../contexts/RightsProvider';
// import {RightsContext} from '../contexts/RightsProvider'
// import PlacesAutocomplete, {
//     geocodeByAddress,
//     geocodeByPlaceId,
//     getLatLng,
//   } from 'react-places-autocomplete';
import '../styles/common.css'




const Dashboard = ()=>{
    const { rights } = useContext(RightsContext);
    

    

    return (
        <div className='container'>
           
            <h1>This is the Dashboard</h1>
            <div>
                <p>lat: {rights.name}</p>
                

            </div>
           
        </div>
    )
}


export default Dashboard