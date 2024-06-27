import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';
import { astar, heuristic } from '../algorithms/astar';
import './Navbar.css'; // Import the Navbar.css file for styling
import Navbar from './Navbar'; // Import the Navbar component
import './PathfindingVisualizer.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;
export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
  }
  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }
  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }
  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }
  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }
  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
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
    }
}
  visualizeDijkstra() {
    this.clearPath();
    let {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }
  visualizeAStar() {
    this.clearPath();
    let { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const { visitedNodesInOrder, nodesInShortestPathOrder } = astar(grid, startNode, finishNode); // Apelarea algoritmului A*
    this.animateAStar(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  animateAStar(visitedNodesInOrder, nodesInShortestPathOrder) {
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
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
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

