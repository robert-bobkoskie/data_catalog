/* EDFOraclePage.js */

import React from 'react';
import coffeePot from '../assets/images/signature_05.gif';

const EDFOraclePage = () => {
  return (
    <div style={styles.container}><h1 style={styles.text}>Under Non-Disclosure</h1><img
        src={coffeePot}
        alt="Coffee Pot"
        style={styles.image}
      /></div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center'
  },
  text: {
    marginBottom: '20px'
  },
  image: {
    maxWidth: '100%',
    height: 'auto'
  }
};

export default EDFOraclePage;
