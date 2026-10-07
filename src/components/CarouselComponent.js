import React, { useState } from 'react';
 // Ensure you add your styles here
import '../styles/components.css'
// import image1 from '../images/nature.jpg'
// import image2 from '../images/conference.jpg'
// import image3 from '../images/image3.jpg'
// import image4 from '../images/quran.jpg'
// import image5 from '../images/sports.jpg'

const CarouselCompoent = () => {
  // State to keep track of the currently selected item
  const [activeIndex, setActiveIndex] = useState(0);

  // Carousel items data
//   const carouselItems = [
//     { id: 1, imgSrc: image1, altText: 'Image 1', title: 'Kapuchworwa Caravan', description: 'This tiime round the Caravan is to be held in Kapchorwa. A fee of 70000 is needed, blankets and personal  higeine materails. We are expected to spend 3 days contact person:0789651698' },
//     { id: 2, imgSrc: image2, altText: 'Image 2' , title: 'Sisters Conference', description: 'This tiime round the Caravan is to be held in Kapchorwa. A fee of 70000 is needed, blankets and personal  higeine materails. We are expected to spend 3 days contact person:0789651698' },
//     { id: 3, imgSrc: image3, altText: 'Image 3', title: 'Skilling Session', description: 'This tiime round the Caravan is to be held in Kapchorwa. A fee of 70000 is needed, blankets and personal  higeine materails. We are expected to spend 3 days contact person:0789651698' },
//     { id: 4, imgSrc: image4, altText: 'Image 4' , title: 'Quranic Competition', description: 'This tiime round the Caravan is to be held in Kapchorwa. A fee of 70000 is needed, blankets and personal  higeine materails. We are expected to spend 3 days contact person:0789651698' },
//     { id: 5, imgSrc: image5, altText: 'Image 5', title: 'Sports Gallah', description: 'This tiime round the Caravan is to be held in Kapchorwa. A fee of 70000 is needed, blankets and personal  higeine materails. We are expected to spend 3 days contact person:0789651698' },
//   ];

  return (
    <div className="carousel-container">
      {/* {carouselItems.map((item, index) => (
        <div
          key={item.id}
          className={`carousel-item ${activeIndex === index ? 'large' : ''}`}
          onClick={() => setActiveIndex(index)}
          style={{ backgroundImage: `url(${item.imgSrc})` }} // Set the background image
        >
           <div className="carousel-text">
            <h2>{item.title}</h2>
            <p className="description">{item.description}</p>
            <div className="footer">
                <p>Masjid Aisha</p>
                <p>02-Aug-2023: 11:00am - 12:00pm </p>
            </div>
          </div>
        </div>
      ))} */}
    </div>
  );
};

export default CarouselCompoent;
