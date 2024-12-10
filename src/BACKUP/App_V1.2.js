/* src/App.js */

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import './App.css';
import Header from './components/Header';
import AboutPage from './pages/AboutPage';
import EDFOraclePage from './pages/EDFOraclePage';
import SQLPage from './pages/SQLPage';
import EDFMSQueryPage from './pages/EDFMSQueryPage';
import Delta_Dashboard from './pages/DeltaDashboard';
import Conway from './pages/ConwaysGameLife';
import Snake from './pages/Snake';
import Donuts from './pages/Donuts';
import LandingPage from './pages/LandingPage'; // Import the LandingPage component

function App() {
  return (
    <Router basename="/data_catalog"><div><Header /><Routes>
	  <Route path="/about" element={<AboutPage />} />
	  <Route path="/data" element={<EDFOraclePage />} />
	  <Route path="/sql" element={<SQLPage />} />
	  <Route path="/edf-ms-oracle" element={<EDFMSQueryPage />} />
	  <Route path="/dashboards" element={<Delta_Dashboard />} />
	  <Route path="/conway" element={<Conway />} />
	  <Route path="/snake" element={<Snake />} />
      <Route path="/donuts" element={<Donuts />} />
	  <Route path="/landing" element={<LandingPage />} />                                 {/* Add the route for LandingPage */}
      <Route path="/src/pages/Donuts.css" element={<Navigate to="/landing" replace />} /> {/* Add a redirect route */}
      <Route path="*" element={<Navigate to="/landing" replace />} />                     {/* Set default route to LandingPage */}
      </Routes></div></Router>
  );
}

export default App;
