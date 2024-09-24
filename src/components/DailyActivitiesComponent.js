import React, { useState } from 'react';
import '../styles/components.css'; 

const DailyActivityComponent = () => {
  const [activeDay, setActiveDay] = useState(null);

  const days = [
    { day: ' Monday', activity: 'Men Quran, Ladies Haraqa',  details: 'Details for Monday'},
    { day: 'Tuesday', activity: 'Men Quran, Ladies Haraqa', details: 'Details for Tuesday' },
    { day: 'Wednesday', activity: 'Men Quran, Ladies Haraqa', details: 'Details for Wednesday' },
    { day: 'Thursday',activity: 'Men Quran, Ladies Haraqa',  details: 'Details for Thursday' },
    { day: 'Friday',activity: 'Men Quran, Ladies Haraqa', details: 'Details for Friday' },
    { day: 'Saturday', activity: 'Men Quran, Ladies Haraqa',  details: 'Details for Saturday' },
    { day: 'Sunday', activity: 'Men Quran, Ladies Haraqa',  details: 'Details for Sunday' },
  ];

  const toggleDay = (index) => {
    setActiveDay(activeDay === index ? null : index); // Toggle the clicked day
  };

  return (
        <div className="day-container">
            <div className="day-list">
            {days.map((item, index) => (
                <div
                key={index}
                className={`day-item ${activeDay === index ? 'active' : ''}`}
                onClick={() => toggleDay(index)}
                >
                {item.day}
                </div>
            ))}
            </div>
            <div className="day-details-container">
            {activeDay !== null ? (
                <div className="day-details">
                {days[activeDay].details}
                </div>
            ) : (
                <div className="day-details-placeholder">
                Select a day to see the details
                </div>
            )}
            </div>
    </div>
  );
};

export default DailyActivityComponent;
