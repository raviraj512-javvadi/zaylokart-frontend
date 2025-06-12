import React from 'react';

const Hero = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-brand-gray text-center py-20 md:py-28 my-8">
        <h1 className="text-4xl md:text-6xl font-extrabold text-brand-dark tracking-tighter mb-4">Style Redefined</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Discover curated collections that blend modern trends with timeless comfort. Unmissable deals await.</p>
        <button className="bg-brand-dark text-white font-bold py-3 px-10 text-lg hover:bg-brand-accent transition-colors duration-300">
          EXPLORE THE COLLECTION
        </button>
      </div>
    </div>
  );
};

export default Hero;