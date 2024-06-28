import React from 'react';
import './Navbar.css';

const Navbar = ({ visualizeDijkstra, visualizeAStar, resetGrid, clearPath }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <a href="https://luboni87.github.io/Pathfinding/" className="navbar-link">Pathfinding Visualizer</a>
      </div>
      <div className="navbar-center">
        <button
          className="button-visualize"
          onClick={() => visualizeDijkstra()}
        >
          Visualize Dijkstra
        </button>
        <button
          className="button-visualize"
          onClick={() => visualizeAStar()}
        >
          Visualize A*
        </button>
      </div>
      <div className="navbar-right">
        <button 
          className="button-reset" onClick={resetGrid}
          >
          Clear Board
        </button>
        <button 
          className="button-reset" onClick={clearPath}
          >
          Clear Path
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
