/* App.js */

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import './App.css';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import EDFOraclePage from './pages/EDFOraclePage';
import SQLPage from './pages/SQLPage';
import EDFMSQueryPage from './pages/EDFMSQueryPage';
import Delta_Dashboard from './pages/Delta_Dashboard';
import Donuts from './pages/Donuts';
import LandingPage from './pages/LandingPage'; // Import the LandingPage component

function App() {
  return (
    <Router><div><Header /><Routes><Route exact path="/" element={<HomePage />} /><Route path="/about" element={<AboutPage />} /><Route path="/data" element={<EDFOraclePage />} /><Route path="/sql" element={<SQLPage />} /><Route path="/edf-ms-oracle" element={<EDFMSQueryPage />} /><Route path="/dashboards" element={<Delta_Dashboard />} /><Route path="/donuts" element={<Donuts />} /><Route path="/landing" element={<LandingPage />} /> {/* Add the route for LandingPage */}
          <Route path="/src/pages/Donuts.css" element={<Navigate to="/landing" replace />} /> {/* Add a redirect route */}
          <Route path="*" element={<Navigate to="/" replace />} /> {/* Add a default route */}
        </Routes></div></Router>
  );
}

export default App;
