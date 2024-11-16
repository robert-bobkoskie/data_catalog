/* src/pages/LandingPage.js */

import React from 'react';

const LandingPage = () => {
  return (
    <div style={ padding: '20px', textAlign: 'center' }><h1 style={ fontSize: '2.5em', color: '#2c3e50' }>
        Welcome to a Cutting-Edge Prototype Data Analysis and Visualization Tool
      </h1><p style={ fontSize: '1.2em', color: '#34495e', lineHeight: '1.6em', marginTop: '20px' }>
        This website is a partial view of the frontend, part of a robust full-stack Python Flask backend that brokers REST API HTTP requests to Mongo and Oracle DB databases. By processing data to obtain metadata, it seamlessly passes the results back to the frontend through HTTP responses. The data is presented in clean, interactive tables, allowing users to drill down, interact, and download insights that are pivotal to understanding their products.
      </p><p style={ fontSize: '1.2em', color: '#34495e', lineHeight: '1.6em', marginTop: '20px' }>
        Most of the data is under Non-Disclosure Agreement (NDA). I have anonymized data to demonstrate some of the visualizations in the Dashboards page. The About page provides a high-level flow of the data pipeline. There is also a unique page that was my enticement of "virtual donuts" to a product team during one of my demos.
      </p><p style={ fontSize: '1.2em', color: '#34495e', lineHeight: '1.6em', marginTop: '20px' }>
        Explore our powerful features designed to enhance your data analysis experience:
      </p><ul style={ fontSize: '1.2em', color: '#34495e', lineHeight: '1.6em', textAlign: 'left', display: 'inline-block', marginTop: '20px' }><li>Interactive Data Tables: Filter, sort, and drill down into data effortlessly.</li><li>Comprehensive Visualization: Gain insights through dynamic charts and graphs.</li><li>Seamless Data Integration: Integrate with MongoDB and Oracle DB for comprehensive analysis.</li><li>Easy Data Download: Export data in various formats for offline analysis.</li><li>User-Friendly Interface: Navigate and find the data you need with ease.</li></ul><p style={ fontSize: '1.2em', color: '#34495e', lineHeight: '1.6em', marginTop: '20px' }>
        This prototype is a testament to our commitment to providing cutting-edge tools that empower you to make data-driven decisions. Dive in and explore the possibilities!
      </p></div>
  );
};

export default LandingPage;
