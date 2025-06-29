import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'; // Uses the react-icons library you have installed

const Rating = ({ value, text, color = '#f8e825' }) => {
  return (
    <div className="flex items-center">
      <span style={{ color }}>
        {value >= 1 ? <FaStar /> : value >= 0.5 ? <FaStarHalfAlt /> : <FaRegStar />}
      </span>
      <span style={{ color }}>
        {value >= 2 ? <FaStar /> : value >= 1.5 ? <FaStarHalfAlt /> : <FaRegStar />}
      </span>
      <span style={{ color }}>
        {value >= 3 ? <FaStar /> : value >= 2.5 ? <FaStarHalfAlt /> : <FaRegStar />}
      </span>
      <span style={{ color }}>
        {value >= 4 ? <FaStar /> : value >= 3.5 ? <FaStarHalfAlt /> : <FaRegStar />}
      </span>
      <span style={{ color }}>
        {value >= 5 ? <FaStar /> : value >= 4.5 ? <FaStarHalfAlt /> : <FaRegStar />}
      </span>
      
      {/* Display the review text next to the stars, if it exists */}
      {text && <span className="ml-2 text-sm text-gray-600">{text}</span>}
    </div>
  );
};

export default Rating;