import React from 'react';
import Donation from '../Features/Donation';
import Event from '../Features/Event';
import News from '../Features/News';
import './Body.css';

const Body = () => {
  return (
    <div className="body">
      <h2>Our Key Features</h2>
      <div className="features">
        <Donation />
        <Event />
        <News />
      </div>
    </div>
  );
};

export default Body;
