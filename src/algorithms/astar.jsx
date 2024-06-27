// astar.js

export function astar(grid, startNode, finishNode) {
  const openSet = [];
  const closedSet = [];
  const visitedNodesInOrder = [];
  startNode.gCost = 0;
  startNode.heuristic = heuristic(startNode, finishNode);
  startNode.fCost = startNode.gCost + startNode.heuristic; // Calculate fCost for the start node
  openSet.push(startNode);

  while (!!openSet.length) {
    // Choose the node with the lowest f-cost
    const currentNode = getLowestFcostNode(openSet);
    if (currentNode === finishNode) {
      return {
        visitedNodesInOrder,
        nodesInShortestPathOrder: getNodesInShortestPathOrder(finishNode),
      };
    }

    // Move the current node from openSet to closedSet
    openSet.splice(openSet.indexOf(currentNode), 1);
    closedSet.push(currentNode);
    visitedNodesInOrder.push(currentNode); // Track the visited node

    // Update neighbors of the current node
    updateNeighbors(currentNode, grid, openSet, closedSet, finishNode);
  }

  // If there's no possible path
  return {
    visitedNodesInOrder,
    nodesInShortestPathOrder: [],
  };
}

export function heuristic(nodeA, nodeB) {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}

function getLowestFcostNode(openSet) {
  let lowestFcostNode = openSet[0];
  for (let i = 1; i < openSet.length; i++) {
    if (openSet[i].fCost < lowestFcostNode.fCost) {
      lowestFcostNode = openSet[i];
    }
  }
  return lowestFcostNode;
}

function updateNeighbors(currentNode, grid, openSet, closedSet, finishNode) {
  const neighbors = getNeighbors(currentNode, grid);
  for (const neighbor of neighbors) {
    if (closedSet.includes(neighbor)) {
      continue; // Ignore neighbors that are already in closedSet
    }
    const tentativeGcost = currentNode.gCost + getDistance(currentNode, neighbor);
    if (!openSet.includes(neighbor) || tentativeGcost < neighbor.gCost) {
      neighbor.gCost = tentativeGcost;
      neighbor.heuristic = heuristic(neighbor, finishNode);
      neighbor.fCost = neighbor.gCost + neighbor.heuristic; // Calculate fCost for the neighbor
      neighbor.previousNode = currentNode;
      if (!openSet.includes(neighbor)) {
        openSet.push(neighbor);
      }
    }
  }
}

function getNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(neighbor => !neighbor.isWall);
}

function getDistance(nodeA, nodeB) {
  return 1; // Movement cost between nodes is 1 (this could vary in other implementations)
}

function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
