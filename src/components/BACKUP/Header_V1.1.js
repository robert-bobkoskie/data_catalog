/* src/components/Header.js */

import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import logo from '../assets/images/ATT_Business_2.png';
import donut from '../assets/images/donut.jpg';

function Header() {
  const [showLadder, setShowLadder] = useState(false);
  const dataLinkRef = useRef(null);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    // window.open("https://www.business.att.com/", "_blank");
	navigate('/landing');
  };

  const handleDonutClick = () => {
    navigate('/donuts'); // Navigate to the Donuts page
  };

  const handleCharacterClick = () => {
    // window.open("https://robert-bobkoskie.github.io/react_flowers/", "_blank");
	navigate('/conway');
  };

  return (
    <header className="header">
		<img src={logo} alt="Logo" className="logo" onClick={handleLogoClick} />
		<nav className="nav-left">
		  <ul><li><Link to="/dashboards">Dashboards</Link></li>
		  <li
            ref={dataLinkRef}
            onMouseEnter={() => setShowLadder(true)}
            onMouseLeave={() => setShowLadder(false)}
          >
		  <Link to="#">Data</Link>
            {showLadder && (
              <div className="ladder-display">
				<Link to="/data" className="dropdown-item">• EDF (Oracle)</Link>
				<Link to="/edf-ms-oracle" className="dropdown-item">• EDF MS (Mongo)</Link>
			  </div>
            )}
          </li>
		  <li><Link to="/sql">SQL</Link></li>
		  </ul></nav><nav className="nav-right">
		  <ul>
		    <li><span className="greek" onClick={handleCharacterClick}>&#x03A3;</span></li>
            <li><img src={donut} alt="Donut" className="donut" onClick={handleDonutClick} /></li>
		    <li><Link to="/about">About</Link></li>
		  </ul>
		</nav>
	</header>
  );
}

export default Header;
