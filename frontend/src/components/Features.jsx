import React from 'react';
import { FaBolt, FaCheckCircle } from 'react-icons/fa';

const Features = () => {
  return (
    <div className="flex justify-center gap-4 p-4">
      <div className="bg-teal-600 text-white px-4 py-2 rounded-md flex items-center gap-2 font-semibold">
        <FaBolt /> 6 HOURS DELIVERY
      </div>
      <div className="bg-teal-600 text-white px-4 py-2 rounded-md flex items-center gap-2 font-semibold">
        <FaCheckCircle /> 100% GENUINE
      </div>
    </div>
  );
};

export default Features;
