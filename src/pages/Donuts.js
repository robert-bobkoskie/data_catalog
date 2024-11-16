/* Donuts.js */

import React, { useState } from 'react';
import './Donuts.css';
import donutImage from '../assets/images/donuts.jpg';
import coffeeImage from '../assets/images/coffee.jpg';
import coffeePot from '../assets/images/Coffee_Pot.gif';

const Donuts = () => {
  const [coffeeCups, setCoffeeCups] = useState([]);
  const [floatingCups, setFloatingCups] = useState([]);

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
  };

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
    </div>
  );
};

export default Donuts;
