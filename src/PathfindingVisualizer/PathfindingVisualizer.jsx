import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';
import { astar, heuristic } from '../algorithms/astar';
import './Navbar.css'; // Import the Navbar.css file for styling
import Navbar from './Navbar'; // Import the Navbar component
import './PathfindingVisualizer.css';

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      isRunning: false,
      START_NODE: { row: 10, col: 15 }, // Initialize start node
      FINISH_NODE: { row: 10, col: 35 }, // Initialize finish node
    };
  }
  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }
  handleMouseDown(row, col) {
    if (this.state.isRunning) return; // Prevent adding walls while algorithm is running
    if (this.isStartNode(row, col)) {
      this.setState({
        mouseIsPressed: true,
        movingStartNode: true,
      });
    } else if (this.isFinishNode(row, col)) {
      this.setState({
        mouseIsPressed: true,
        movingFinishNode: true,
      });
    } else {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
    }
  }
  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed || this.state.isRunning) return;
    if (this.state.movingStartNode) {
      const newGrid = moveStartNode(this.state.grid, row, col);
      this.setState({ grid: newGrid, START_NODE: { row, col } });
    } else if (this.state.movingFinishNode) {
      const newGrid = moveFinishNode(this.state.grid, row, col);
      this.setState({ grid: newGrid, FINISH_NODE: { row, col } });
    } else {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
    }
  }
  handleMouseUp = () => {
    this.setState({
      mouseIsPressed: false,
      movingStartNode: false,
      movingFinishNode: false,
    });
  };
  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    this.setState({ isRunning: true }); // Set isRunning to true before animating
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }
  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
      this.setState({ isRunning: false }); // Set isRunning to false after animation completes
    }
}
  visualizeDijkstra() {
    if (this.state.isRunning) return;
    this.clearPath();
    let {grid} = this.state;
    let { START_NODE, FINISH_NODE } = this.state;
    START_NODE = grid[START_NODE.row][START_NODE.col];
    FINISH_NODE = grid[FINISH_NODE.row][FINISH_NODE.col];
    const visitedNodesInOrder = dijkstra(grid, START_NODE, FINISH_NODE);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(FINISH_NODE);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }
  visualizeAStar() {
    if (this.state.isRunning) return;
    this.clearPath();
    let { grid } = this.state;
    let { START_NODE, FINISH_NODE } = this.state;
    START_NODE = grid[START_NODE.row][START_NODE.col];
    FINISH_NODE = grid[FINISH_NODE.row][FINISH_NODE.col];
    const { visitedNodesInOrder, nodesInShortestPathOrder } = astar(grid, START_NODE, FINISH_NODE); // Apelarea algoritmului A*
    this.animateAStar(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  animateAStar(visitedNodesInOrder, nodesInShortestPathOrder) {
    this.setState({ isRunning: true }); // Set isRunning to true before animating
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  resetGrid() {
    if (this.state.isRunning) return;
    const newGrid = this.state.grid.map((row) =>
      row.map((node) => {
        const newNode = {
          ...node,
          distance: Infinity,
          isVisited: false,
          isWall: false,
          previousNode: null,
        };
        if (!newNode.isStart && !newNode.isFinish) {
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node';
        } else if (newNode.isStart) {
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-start';
        } else if (newNode.isFinish) {
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-finish';
        }
        return newNode;
      })
    );
    this.setState({ grid: newGrid });
  }

  clearPath() {
    if (this.state.isRunning) return;
    const newGrid = this.state.grid.slice();
    for (const row of newGrid) {
      for (const node of row) {
        const newNode = {
          ...node,
          isVisited: false,
          distance: Infinity,
          previousNode: null,
        };
        if (node.isStart) {
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-start';
        } else if (node.isFinish) {
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-finish';
        } else if (!node.isWall) {
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node';
        }
        row[node.col] = newNode;
      }
    }
    this.setState({ grid: newGrid });
  }

  isStartNode(row, col) {
    return row === this.state.START_NODE.row && col === this.state.START_NODE.col;
  }

  isFinishNode(row, col) {
    return row === this.state.FINISH_NODE.row && col === this.state.FINISH_NODE.col;
  }

  render() {
    const { grid, mouseIsPressed } = this.state;
    return (
      <div className="pathfinding-visualizer">
        {/* Transmite functia visualizeDijkstra ca proprietate */}
        <Navbar visualizeDijkstra={() => this.visualizeDijkstra()} 
          visualizeAStar={() => this.visualizeAStar()}
          resetGrid={() => this.resetGrid()}
          clearPath={() => this.clearPath()}
          />
          <div className='grid-container'>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      row={row}
                      isStart={isStart}
                      isFinish={isFinish}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                      onMouseUp={() => this.handleMouseUp()}
                      gCost={node.gCost}
                      hCost={heuristic(node, node.isFinish)}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
        </div>
      </div>
    );
  }
}
const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};
const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === 10 && col === 15,
    isFinish: row === 10 && col === 35,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};
const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice()
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const moveStartNode = (grid, row, col) => {
  const newGrid = grid.slice();
  const currentStartNode = findStartNode(newGrid);
  if (currentStartNode) {
    newGrid[currentStartNode.row][currentStartNode.col].isStart = false;
  }
  newGrid[row][col].isStart = true;
  return newGrid;
};

const moveFinishNode = (grid, row, col) => {
  const newGrid = grid.slice();
  const currentFinishNode = findFinishNode(newGrid);
  if (currentFinishNode) {
    newGrid[currentFinishNode.row][currentFinishNode.col].isFinish = false;
  }
  newGrid[row][col].isFinish = true;
  return newGrid;
};

const findStartNode = (grid) => {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col].isStart) {
        return { row, col };
      }
    }
  }
  return null;
};

const findFinishNode = (grid) => {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col].isFinish) {
        return { row, col };
      }
    }
  }
  return null;
};

