/* AboutPage.css */

import React, { useState, useEffect, useRef } from 'react';
import './AboutPage.css';
import pcLogo from '../assets/images/PC+Logo.png';
import reactLogo from '../assets/images/React_Logo.png';
import pythonLogo from '../assets/images/Python_Logo.jfif';
import mongoLogo from '../assets/images/Mongo_Logo.png';
import oracleLogo from '../assets/images/Oracle_Logo.png';
import verticalPipe from '../assets/images/Verticle_Pipe.jpg';

function AboutPage() {
  const [moveDown, setMoveDown] = useState(false);
  const [moveQueryDown, setMoveQueryDown] = useState(false);
  const [queryResponse, setQueryResponse] = useState(false);
  const [httpResponse, setHttpResponse] = useState(false);
  const requestBoxRef = useRef(null);
  const reactPythonBoxRef = useRef(null);
  const mongoOracleBoxRef = useRef(null);
  const queryBoxRef = useRef(null);

  useEffect(() => {
    if (moveDown) {
      const requestBox = requestBoxRef.current;
      const reactPythonBox = reactPythonBoxRef.current;
      if (requestBox && reactPythonBox) {
        const requestBoxBottom = requestBox.getBoundingClientRect().bottom;
        const distance = requestBoxBottom - requestBox.offsetHeight + 10;
        requestBox.style.transform = `translateY(${distance}px)`;

        // Trigger the next movement after the first one completes
        setTimeout(() => {
          setMoveQueryDown(true);
        }, 1000); // Assuming 1s transition duration
      }
    }
  }, [moveDown]);

  useEffect(() => {
    if (moveQueryDown) {
      const queryBox = queryBoxRef.current;
      const mongoOracleBox = mongoOracleBoxRef.current;
      if (queryBox && mongoOracleBox) {
        const mongoOracleBoxTop = mongoOracleBox.getBoundingClientRect().top;
        const queryBoxTop = queryBox.getBoundingClientRect().top;
        const distance = mongoOracleBoxTop - queryBoxTop - queryBox.offsetHeight;
        queryBox.style.transform = `translateY(${distance}px)`;

        // Change text to "Query Response" and move back
        setTimeout(() => {
          setQueryResponse(true);
          setTimeout(() => {
            queryBox.style.transform = 'translateY(0)';
            setTimeout(() => {
              // Change text to "HTTP Response" and move back
              setHttpResponse(true);
              setTimeout(() => {
                const requestBox = requestBoxRef.current;
                if (requestBox) {
                  requestBox.style.transform = 'translateY(0)';
                  // Reset the process
                  setTimeout(() => {
                    setMoveDown(false);
                    setMoveQueryDown(false);
                    setQueryResponse(false);
                    setHttpResponse(false);
                  }, 1000); // Assuming 1s transition duration
                }
              }, 1000); // Assuming 1s transition duration
            }, 1000); // Assuming 1s transition duration
          }, 1000); // Assuming 1s transition duration
        }, 1000); // Assuming 1s transition duration
      }
    }
  }, [moveQueryDown]);

  const handleMouseEnterRequest = () => {
    setMoveDown(true);
  };

  return (
    <div className="about-page"><div className="about-text">About</div><div className="diagram"><div className="pc-logo" onMouseEnter={handleMouseEnterRequest}><img src={pcLogo} alt="PC Logo" /></div><div className="http-request-box" ref={requestBoxRef}><div className="http-request-text">{httpResponse ? 'HTTP Response' : 'HTTP Request'}</div></div><div className="pipe"><img src={verticalPipe} alt="Vertical Pipe" /></div><div className="box" ref={reactPythonBoxRef}><div className="box-label-left">Data Catalog</div><div className="box-content horizontal"><img src={reactLogo} alt="React Logo" /><img src={pythonLogo} alt="Python Logo" /></div></div><div className="query-box" ref={queryBoxRef}><div className="query-text">{queryResponse ? 'Query Response' : 'Query'}</div></div><div className="pipe"><img src={verticalPipe} alt="Vertical Pipe" /></div><div className="box" ref={mongoOracleBoxRef}><div className="box-label-left">EDF (Oracle)</div><div className="box-label-right">EDF MS (Mongo)</div><div className="box-content horizontal"><img src={oracleLogo} alt="Oracle Logo" /><img src={mongoLogo} alt="Mongo Logo" /></div></div></div></div>
  );
}

export default AboutPage;
