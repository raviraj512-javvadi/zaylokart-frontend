import React from 'react';

const Banner = () => {
  return (
    <div className="bg-orange-300 p-10 flex justify-between items-center">
      <div>
        <h2 className="text-white text-4xl font-bold">UP TO 50% OFF</h2>
        <h3 className="text-white text-5xl font-bold mt-2">SALE</h3>
        <button className="mt-4 bg-yellow-400 text-black px-4 py-2 rounded font-bold">
          SHOP NOW
        </button>
      </div>
      <img
        src="https://img.icons8.com/emoji/96/handbag-emoji.png"
        alt="Handbag"
        className="w-32 h-32"
      />
    </div>
  );
};

export default Banner;
