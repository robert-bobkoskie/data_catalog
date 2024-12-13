import React, { useState, useEffect } from 'react';
import './Donuts.css';
import donutImage from '../assets/images/donuts.jpg';
import coffeeImage from '../assets/images/coffee.jpg';
import coffeePot from '../assets/images/Coffee_Pot.gif';
import handOpen from '../assets/images/hands_open.png';
import handClap from '../assets/images/hands_clap.png';

const Donuts = () => {
  const [coffeeCups, setCoffeeCups] = useState([]);
  const [floatingCups, setFloatingCups] = useState([]);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const handleScreenClick = () => {
    const nextId = coffeeCups.length;

    setFloatingCups((prevCups) => [
      ...prevCups,
      { id: nextId }
    ]);

    setTimeout(() => {
      setFloatingCups((prevCups) => prevCups.filter((cup) => cup.id !== nextId));
      setCoffeeCups((prevCups) => [
        ...prevCups,
        { id: nextId }
      ]);
    }, 2000);
  };

  const handleMouseMove = (event) => {
    const { clientX: x, clientY: y } = event;
    const tooltipY = y + 20; // Tooltip appears 20px from the top

    setTooltipPosition({ x, y: tooltipY });

    const donutsContent = document.querySelector('.donuts-content');
    const tooltipElement = document.querySelector('.donuts-tooltip');

    if (donutsContent && tooltipElement) {
      const rect = donutsContent.getBoundingClientRect();
      const isWithinContent = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

      if (isWithinContent) {
        donutsContent.classList.add('has-hand-cursor');
        tooltipElement.classList.add('donuts-visible');
        setIsTooltipVisible(true);
      } else {
        donutsContent.classList.remove('has-hand-cursor');
        tooltipElement.classList.remove('donuts-visible');
        setIsTooltipVisible(false);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="donuts-container">
      <div className="donuts-header">
        <h1 className="h1-text">Donuts and Coffee</h1>
      </div>
      <div className="donuts-content" onClick={handleScreenClick}>
        <img src={coffeePot} alt="Coffee Pot" className="donuts-coffee-pot" />
        <img src={donutImage} alt="Donut" className="donuts-donut-image" />
        <div className="donuts-coffee-cups-container">
          {coffeeCups.map(({ id }) => (
            <div key={id} className="donuts-coffee-cup">
              <img src={coffeeImage} alt="Coffee" className="donuts-coffee-image" />
            </div>
          ))}
        </div>
        {floatingCups.map(({ id }) => (
          <div key={id} className="donuts-floating-cup">
            <img src={coffeeImage} alt="Coffee" className="donuts-coffee-image" />
          </div>
        ))}
        <div className={`donuts-tooltip ${isTooltipVisible ? 'donuts-visible' : ''}`} style={{ top: `${tooltipPosition.y}px`, left: `${tooltipPosition.x}px` }}>
          Clap for coffee
        </div>
      </div>
    </div>
  );
};

export default Donuts;
