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
    <div className="landing-container">
      <h1 className="landing-header">Welcome to My Data Analysis and Visualization Tool</h1>
      <p className="landing-text">
        This website showcases the front-end development of a full-stack data visualization tool. The React.js front-end is integrated with a Python Flask backend that:
      </p>
      <p className="landing-text indented-text">
        Brokers REST API HTTP requests to Mongo and Oracle databases, processes data to aggregate and obtain metadata, and returns the results to the front-end. The data is presented in clean, interactive tables where users can drill down and download insights.
      </p>
      <p className="landing-text">
        The About page provides a high-level overview of the data pipeline.
      </p>
      <div className="button-container">
        <button className="button" onClick={() => handleButtonClick('/about')}>About</button>
      </div>
      <p className="landing-text">
        Enjoy virtual donuts and coffee during demos to promote collaboration:
      </p>
      <div className="button-container">
        <img src={donut} alt="Donut" className="donut" onClick={handleDonutClick} />
      </div>
      <p className="landing-text">
        For added fun, play some games by clicking on your favorite Greek letter:
      </p>
      <div className="greek-container">
        <span className="greek" onClick={() => handleGreekClick('/tetris')}>&#x0398;</span>
        <span className="greek" onClick={() => handleGreekClick('/dejarik')}>&#x0394;</span>
        <span className="greek" onClick={() => handleGreekClick('/snake')}>&#x03A3;</span>
        <span className="greek" onClick={() => handleGreekClick('/conway')}>&#x0393;</span>
      </div>
      <p className="landing-text">
        This website demonstrates the use of a modern, component-based front-end framework for data visualization through dashboards, charts, and tables. While most data is under a Non-Disclosure Agreement (NDA), anonymized datasets are used for validating front-end dashboards. A demo of the data visualization can be viewed here:
      </p>
      <div className="button-container">
        <button className="button" onClick={() => handleButtonClick('/dashboards')}>Dashboards</button>
      </div>
      <p className="landing-text">
        Users can interact with elements by clicking, and by right-clicking and dragging to draw a selection box over a plot to display aggregated counts.
      </p>
    </div>
  );
};

export default LandingPage;
