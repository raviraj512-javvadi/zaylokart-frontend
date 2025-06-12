import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const HeroSlider = () => {
  const images = [
    "/slider1.jpg",
    "/slider2.jpg",
    "/slider3.jpg",
    "/slider4.jpg"
  ];

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false
  };

  return (
    <div className="max-w-full overflow-hidden">
      <Slider {...settings}>
        {images.map((img, index) => (
          <div key={index}>
            <img src={img} alt={`slider-${index}`} className="w-full h-[300px] object-cover" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSlider;
