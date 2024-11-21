/* AboutPage.js */

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
  const [visibleTextBox, setVisibleTextBox] = useState(1); // Track the visible text box
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
        const distance = requestBoxBottom - requestBox.offsetHeight - 45;
        requestBox.style.transform = `translateY(${distance}px)`;

        // Trigger the next movement after the first one completes
        setTimeout(() => {
          setMoveQueryDown(true);
          setVisibleTextBox(2); // Show the second text box
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
        const distance = mongoOracleBoxTop - queryBoxTop - queryBox.offsetHeight + 150;
        queryBox.style.transform = `translateY(${distance}px)`;

        // Change text to "Query Response" and move back
        setTimeout(() => {
          setQueryResponse(true);
          setVisibleTextBox(3); // Show the third text box
          setTimeout(() => {
            queryBox.style.transform = 'translateY(0)';
            setTimeout(() => {
              // Change text to "HTTP Response" and move back
              setHttpResponse(true);
              setVisibleTextBox(4); // Show the fourth text box
              setTimeout(() => {
                const requestBox = requestBoxRef.current;
                if (requestBox) {
                  requestBox.style.transform = 'translateY(0)';
                }
              }, 1000); // Assuming 1s transition duration
            }, 1000); // Assuming 1s transition duration
          }, 1000); // Assuming 1s transition duration
        }, 1000); // Assuming 1s transition duration
      }
    }
  }, [moveQueryDown]);

  const handleMouseEnterRequest = () => {
    // Reset to show only the first text box
    setVisibleTextBox(1);
    // Move both boxes back to their original positions
    const requestBox = requestBoxRef.current;
    const queryBox = queryBoxRef.current;
    if (requestBox && queryBox) {
      requestBox.style.transform = 'translateY(0)';
      queryBox.style.transform = 'translateY(0)';
    }
    // Reset the state variables
    setMoveDown(false);
    setMoveQueryDown(false);
    setQueryResponse(false);
    setHttpResponse(false);
    // Start the process again
    setTimeout(() => {
      setMoveDown(true);
    }, 100); // Small delay to allow reset
  };

  return (
    <div className="about-page"><div className="about-text">About</div><div className="main-div"><div className="diagram"><div className="pc-logo" onMouseEnter={handleMouseEnterRequest}><img src={pcLogo} alt="PC Logo" /></div><div className="http-request-box" ref={requestBoxRef}><div className="http-request-text">{httpResponse ? 'HTTP Response' : 'HTTP Request'}</div></div><div className="query-box" ref={queryBoxRef}><div className="query-text">{queryResponse ? 'Query Response' : 'Query'}</div></div><div className="pipe"><img src={verticalPipe} alt="Vertical Pipe" /></div><div className="box" ref={reactPythonBoxRef}><div className="box-label-left">Data Catalog</div><div className="box-content horizontal"><img src={reactLogo} alt="React Logo" /><img src={pythonLogo} alt="Python Logo" /></div></div><div className="pipe"><img src={verticalPipe} alt="Vertical Pipe" /></div><div className="box" ref={mongoOracleBoxRef}><div className="box-label-left">EDF (Oracle)</div><div className="box-label-right">EDF MS (Mongo)</div><div className="box-content horizontal"><img src={oracleLogo} alt="Oracle Logo" /><img src={mongoLogo} alt="Mongo Logo" /></div></div></div><div className="side-text-boxes"><div className={`text-box ${visibleTextBox >= 1 ? 'visible' : ''}`}>
            Initialize a demo flow by hovering over the PC icon, representing users on this app hosted with React.js.
          </div><div className={`text-box ${visibleTextBox >= 2 ? 'visible' : ''}`}>
            User input is translated into HTTP request methods using a REST API, which are sent to the backend process using Python Flask.
          </div><div className={`text-box ${visibleTextBox >= 3 ? 'visible' : ''}`}>
            Flask queries databases of record (Oracle SQL, NoSQL MongoDB). The backend processes aggregate and transform data into metadata.
          </div><div className={`text-box ${visibleTextBox >= 4 ? 'visible' : ''}`}>
            The Flask backend packages the data into an HTTP response, and the frontend renders the data into a visually approachable format, providing insights for the user.
          </div></div></div></div>
  );
}

export default AboutPage;
