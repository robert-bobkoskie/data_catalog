/* src/pages/LandingPage.js */

import React from 'react';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container"><h1 className="landing-header">Welcome to a Prototype Data Analysis and Visualization Tool</h1><p className="landing-text">
        This website is a partial view of the frontend as part of a full-stack Python Flask backend that brokers REST API HTTP requests to Mongo and Oracle DB databases, processes data to obtain metadata, and passes the results back to the frontend in HTTP responses. The data is presented to the user in clean tables in the front-end where the user can interact, drill down, and download data that provides insight into their product.
      </p><p className="landing-text">
        Most of the data is under Non-Disclosure Agreement (NDA). I have anonymized data to demonstrate some of the visualizations in the Dashboards page. The About page provides a high-level flow of the data pipeline. There is also a unique page that was my enticement of "virtual donuts" to a product team during one of my demos.
      </p><p className="landing-text">
        A user can interact with elements on the page by clicking, and by right-clicking and dragging to draw a selection box over a plot to display aggregated counts over that domain.
      </p></div>
  );
};

export default LandingPage;
