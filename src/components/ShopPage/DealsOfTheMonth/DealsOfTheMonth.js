import "./DealsOfTheMonth.css"
import React, { useState, useEffect } from 'react';
import deal1 from "../../../images/deal1.jpg"
import deal2 from "../../../images/deal2.jpg"
import deal3 from "../../../images/deal3.jpg"



const DealsOfTheMonth = () => {

  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 6,
    minutes: 5,
    seconds: 30
  });

  const deals = [
    {
      image: deal1,
      label: "Spring Sale",
      discount: "30% OFF"
    },
    {
      image: deal2,
      label: "Summer Collection",
      discount: "25% OFF"
    },
    {
      image: deal3,
      label: "New Arrivals",
      discount: "20% OFF"
    }
  ];

  const navigate = (direction) => {
    setCurrentSlide((prev) => (prev + direction + deals.length) % deals.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const CountdownItem = ({ value, label }) => (
    <div className="countdown-item">
      <div className="countdown-value">
        {String(value).padStart(2, '0')}
      </div>
      <div className="countdown-label">{label}</div>
    </div>
  );

  return (
      <div className="deals">
        <div className="deals-container">
          <div className="deals-left-content">
            <h2>Deals Of The Month</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis ultrices sollicitudin aliquam sem. Scelerisque duis ultrices sollicitudin</p>
            <button>Buy Now</button>
            <h3><strong>Hurry, Before It’s Too Late!</strong></h3>
            <div className="countdown-container">
              <CountdownItem value={timeLeft.days} label="Days" />
              <CountdownItem value={timeLeft.hours} label="Hr" />
              <CountdownItem value={timeLeft.minutes} label="Mins" />
              <CountdownItem value={timeLeft.seconds} label="Sec" />
          </div>
          </div>
          <div className="deals-right-content">
          <div className="slider-wrapper">
              <div 
                className="slider-track"
                style={{ transform: `translateX(-${currentSlide * 330}px)` }}
              >
                {deals.map((deal, index) => (
                  <div key={index} className="slide">
                    <img src={deal.image} alt={deal.label} />
                    <div className="slide-content">
                      <div className="slide-label">{deal.label}</div>
                      <div className="slide-discount">{deal.discount}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="slider-buttons">
              <button className="nav-button" onClick={() => navigate(-1)}>❮</button>
              <button className="nav-button" onClick={() => navigate(1)}>❯</button>
            </div>

            <div className="dots-container">
              {deals.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${currentSlide === index ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
  )
}

export default DealsOfTheMonth








