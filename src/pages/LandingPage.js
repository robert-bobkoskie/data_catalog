/* src/pages/LandingPage.js */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import donut from '../assets/images/donut_11.png';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleDonutClick = () => {
    navigate('/donuts');
  };

  const handleGreekClick = (path) => {
    navigate(path);
  };

  const handleButtonClick = (path) => {
    navigate(path);
  };

  return (
    <div className="landing-landing-container">
      <h1 className="landing-landing-header">Welcome to My Data Analysis and Visualization Tool</h1>
      <p className="landing-landing-text">
        This website showcases the use of a modern, component-based front-end framework for data visualization through dashboards, charts, and tables. While most data is under a Non-Disclosure Agreement (NDA), anonymized datasets are used for validating front-end dashboards. A demo of the data visualization can be viewed here:
      </p>
      <div className="landing-button-text-container">
        <button className="landing-button" onClick={() => handleButtonClick('/dashboards')}>Dashboards</button>
        <p className="landing-landing-text">
          Users can interact with elements by clicking, and by right-clicking and dragging to draw a selection box over a plot to display aggregated counts.
        </p>
      </div>
      <p className="landing-landing-text">
        The front-end development for the Dashboards page is part of a full-stack data visualization tool in production. The React.js front-end is integrated with a Python Flask backend that:
      </p>
      <p className="landing-landing-text landing-indented-text">
        Brokers REST API HTTP requests to Mongo and Oracle databases, processes data to aggregate and obtain metadata, and returns the results to the front-end. The data is presented in clean, interactive tables where users can drill down and download insights.
      </p>
      <p className="landing-landing-text">
        The About page provides a high-level overview of the data pipeline.
      </p>
      <div className="landing-button-container">
        <button className="landing-button" onClick={() => handleButtonClick('/about')}>About</button>
      </div>
      <p className="landing-landing-text">
        Enjoy virtual donuts and coffee during demos to promote collaboration:
      </p>
      <div className="landing-button-container">
        <img src={donut} alt="Donut" className="landing-donut" onClick={handleDonutClick} />
      </div>
      <p className="landing-landing-text">
        For added fun, play some games by clicking on your favorite Greek letter:
      </p>
      <div className="landing-greek-container">
        <span className="landing-greek" onClick={() => handleGreekClick('/tetris')}>&#x0398;</span>
        <span className="landing-greek" onClick={() => handleGreekClick('/dejarik')}>&#x0394;</span>
        <span className="landing-greek" onClick={() => handleGreekClick('/snake')}>&#x03A3;</span>
        <span className="landing-greek" onClick={() => handleGreekClick('/conway')}>&#x0393;</span>
      </div>
    </div>
  );
};

export default LandingPage;
