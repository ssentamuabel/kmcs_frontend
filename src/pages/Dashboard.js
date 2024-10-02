import React, {useState, useContext} from 'react'
import { RightsContext } from '../contexts/RightsProvider';
import Carousel from '../components/CarouselComponent'
import Daily from '../components/DailyActivitiesComponent'
import { Pie } from 'react-chartjs-2';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import '../styles/common.css'
import '../styles/components.css'


// Register the required components
ChartJS.register(ArcElement, Tooltip, Legend);




const Dashboard = ()=>{
    const { rights } = useContext(RightsContext);
    
    const data = {
        labels: [ 'Male', 'Female'],
        datasets: [
          {
            label: 'Number',
            data: [700, 600],
            backgroundColor: [
              '#074734',
              '#115BFB',
              
            ],
            borderColor: [
              '#F4F9FD',
              '#F4F9FD',
              
            ],
            borderWidth: 2,
          },
        ],
      };
      
      const options = {
        responsive: true, // Set to false if you want to control dimensions via props or CSS
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Total Records',
          },
        },
      };

    return (
        <div className='page-container'>
            <div id="dashboard-wrapper">
                <div id ="events-section">
                    {/* <Carousel /> */}
                </div>
                <div id="bottom-section">
                    <div id="stat">
                        <Pie 
                            data={data}
                            options={options}
                            style={{
                                maxWidth: '350px',
                                maxHeight: '350px',
                                 // Center the chart
                              }}
                         />
                    </div>
                    <div id="daily-activities">
                        <h4>Daily Programs</h4>
                        <Daily />
                    </div>
                   
                </div>

            </div>
           

        </div>
    )
}


export default Dashboard