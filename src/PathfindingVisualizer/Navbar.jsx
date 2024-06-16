import React from 'react';
import './Navbar.css';

const Navbar = ({ visualizeDijkstra }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <a href="YOUR_URL_HERE" className="navbar-link">Pathfinding Visualizer</a>
      </div>
      <div className="navbar-center">
        <button
          className="button-visualize"
          onClick={() => visualizeDijkstra()}
        >
          Visualize Algorithm
        </button>
      </div>
    </nav>
  );
};

export default Navbar;