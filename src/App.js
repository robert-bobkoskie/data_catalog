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
import Donuts from './pages/Donuts'; // Import the Donuts component
import LandingPage from './pages/LandingPage'; // Import the LandingPage component

function App() {
  return (
    <Router><div><Header /><Routes><Route exact path="/" element={<LandingPage />} /> {/* Set LandingPage as the default landing page */}
          <Route path="/home" element={<HomePage />} /><Route path="/about" element={<AboutPage />} /><Route path="/data" element={<EDFOraclePage />} /><Route path="/sql" element={<SQLPage />} /><Route path="/edf-ms-oracle" element={<EDFMSQueryPage />} /><Route path="/dashboards" element={<Delta_Dashboard />} /><Route path="/donuts" element={<Donuts />} /> {/* Corrected the path for Donuts component */}
          <Route path="*" element={<Navigate to="/" replace />} /> {/* Redirect unknown paths to LandingPage */}
        </Routes></div></Router>
  );
}

export default App;
