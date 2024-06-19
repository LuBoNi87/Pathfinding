// Funcție principală pentru algoritmul A*
export function astar(grid, startNode, finishNode) {
    const openSet = [];
    const closedSet = [];
    startNode.gCost = 0;
    startNode.heuristic = heuristic(startNode, finishNode);
     //Calculeaza costul pentru nodul de inceput
    startNode.fCost = startNode.gCost + startNode.heuristic;
    openSet.push(startNode);
  
    while (!!openSet.length) {
      // Alegem nodul cu cel mai mic cost estimat (f-cost)
      const currentNode = getLowestFcostNode(openSet);
      if (currentNode === finishNode) {
        return getNodesInShortestPathOrder(finishNode);
      }
      // Mutăm nodul curent din openSet în closedSet
      openSet.splice(openSet.indexOf(currentNode), 1);
      closedSet.push(currentNode);
      // Actualizăm vecinii nodului curent
      updateNeighbors(currentNode, grid, openSet, closedSet, finishNode);
    }
    // Dacă nu există cale posibilă
    return [];
  }
  
  // Funcție pentru a calcula costul euristic (h-cost)
  export function heuristic(nodeA, nodeB) {
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
  }
  
  // Funcție pentru a obține nodul din openSet cu cel mai mic f-cost
  function getLowestFcostNode(openSet) {
    let lowestFcostNode = openSet[0];
    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].fCost < lowestFcostNode.fCost) {
        lowestFcostNode = openSet[i];
      }
    }
    return lowestFcostNode;
  }
  
  // Funcție pentru a actualiza vecinii unui nod dat
  function updateNeighbors(currentNode, grid, openSet, closedSet, finishNode) {
    const neighbors = getNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      if (closedSet.includes(neighbor)) {
        continue; // Ignorăm vecinii care sunt deja în closedSet
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
  
  // Funcție pentru a obține vecinii unui nod dat
  function getNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isWall);
  }
  
  // Funcție pentru a calcula distanța între două noduri
  function getDistance(nodeA, nodeB) {
    return 1; // Costul de deplasare între noduri este 1 (ar putea fi diferit în alte implementări)
  }
  
  // Funcție pentru a obține drumul cel mai scurt
  function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  }
