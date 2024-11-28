import React from 'react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import './FundraiserTile.css';

const FundraiserTile = ({ fundraiser }) => {
  return (
    <div className="fundraiser-tile">
      <h3>{fundraiser.title}</h3>
      <p>{fundraiser.description}</p>
      <p><strong>Goal:</strong> ${fundraiser.goalAmount}</p>
      <p><strong>Collected:</strong> ${fundraiser.collectedAmount}</p>

      {/* Link to the individual fundraiser page */}
      <Link to={`/fundraiser/${fundraiser._id}`} className="view-fundraiser-link">
        View Fundraiser
      </Link>
    </div>
  );
};

export default FundraiserTile;
