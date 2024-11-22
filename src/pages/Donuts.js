/* Donuts.js */

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

  const handleScreenClick = () => {
    const nextId = coffeeCups.length;

    // Add new floating cup animation
    setFloatingCups((prevCups) => [
      ...prevCups,
      { id: nextId }
    ]);

    // Remove floating cup after animation and then add to grid
    setTimeout(() => {
      setFloatingCups((prevCups) => prevCups.filter((cup) => cup.id !== nextId));
      setCoffeeCups((prevCups) => [
        ...prevCups,
        { id: nextId }
      ]);
    }, 2000); // Match the duration of the CSS animation

    // Change cursor to clapping hands on click
    document.body.style.cursor = `url(${handClap}), auto`;
    setTimeout(() => {
      document.body.style.cursor = `url(${handOpen}), auto`;
    }, 200); // Duration of the clapping animation
  };

  const handleMouseMove = (event) => {
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    document.body.style.cursor = `url(${handOpen}), auto`;
  }, []);

  return (
    <div className="donuts-container" onClick={handleScreenClick}><img
        src={coffeePot}
        alt="Coffee Pot"
        className="coffee-pot"
      /><img
        src={donutImage}
        alt="Donut"
        className="donut-image"
      /><div className="coffee-cups-container">
        {coffeeCups.map(({ id }) => (
          <div key={id} className="coffee-cup"><img
              src={coffeeImage}
              alt="Coffee"
              className="coffee-image"
            /></div>
        ))}
      </div>
      {floatingCups.map(({ id }) => (
        <div key={id} className="floating-cup"><img
            src={coffeeImage}
            alt="Coffee"
            className="coffee-image"
          /></div>
      ))}
      <div
        className="tooltip"
        style={{ top: `${tooltipPosition.y}px`, left: `${tooltipPosition.x}px` }}
      >
        Clap for coffee
      </div></div>
  );
};

export default Donuts;
