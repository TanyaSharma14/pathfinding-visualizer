 const ROWS = 15;
    const COLS = 20;
    const gridElement = document.getElementById("grid");
    const visualizeBtn = document.getElementById("visualizeBtn");
    const resetBtn = document.getElementById("resetBtn");
    const algoSelect = document.getElementById("algoSelect");
    const speedSlider = document.getElementById("speed");
    const statsElement = document.getElementById("stats");
    const visitedCountElement = document.getElementById("visitedCount");
    const pathLengthElement = document.getElementById("pathLength");
    const timeElapsedElement = document.getElementById("timeElapsed");
    
    let grid = [];
    let startNode = null;
    let endNode = null;
    let placementStage = 0;
    let isRunning = false;
    let visitedNodesCount = 0;
    let startTime = 0;
    
    function createGrid() {
      gridElement.innerHTML = "";
      grid = [];
      for (let r = 0; r < ROWS; r++) {
        const row = [];
        for (let c = 0; c < COLS; c++) {
          const div = document.createElement("div");
          div.classList.add("node");
          div.addEventListener("click", () => handleNodeClick(r, c, div));
          gridElement.appendChild(div);
          row.push({
            row: r,
            col: c,
            distance: Infinity,
            prev: null,
            isWall: false,
            element: div,
            heuristic: 0
          });
        }
        grid.push(row);
      }
    }
    
    function handleNodeClick(r, c, div) {
      if (isRunning) return;
      
      const node = grid[r][c];
      if (placementStage === 0) {
        startNode = node;
        div.classList.add("start");
        placementStage = 1;
      } 
      else if (placementStage === 1) {
        endNode = node;
        div.classList.add("end");
        placementStage = 2;
      } 
      else {
        if (node === startNode || node === endNode) return;
        node.isWall = !node.isWall;
        div.classList.toggle("wall");
      }
    }
    
    function clearPath() {
      visitedNodesCount = 0;
      statsElement.classList.remove("active");
      grid.flat().forEach(n => {
        n.distance = Infinity;
        n.prev = null;
        n.heuristic = 0;
        n.element.classList.remove("visited", "path");
      });
    }
    
    function getNeighbors(node) {
      const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
      return dirs
        .map(([dr, dc]) => grid[node.row + dr]?.[node.col + dc])
        .filter(n => n && !n.isWall);
    }
    
    function heuristic(node, end) {
      return Math.abs(node.row - end.row) + Math.abs(node.col - end.col);
    }
    
    async function dijkstra() {
      clearPath();
      startTime = Date.now();
      startNode.distance = 0;
      const unvisited = grid.flat();
      
      while (unvisited.length) {
        unvisited.sort((a, b) => a.distance - b.distance);
        const current = unvisited.shift();
        
        if (current.distance === Infinity) break;
        
        if (current !== startNode && current !== endNode) {
          current.element.classList.add("visited");
          visitedNodesCount++;
        }
        
        await delay();
        
        if (current === endNode) {
          await drawPath(current);
          return;
        }
        
        for (const n of getNeighbors(current)) {
          const dist = current.distance + 1;
          if (dist < n.distance) {
            n.distance = dist;
            n.prev = current;
          }
        }
      }
      showStats(0);
    }
    
    async function bfs() {
      clearPath();
      startTime = Date.now();
      startNode.distance = 0;
      const queue = [startNode];
      
      while (queue.length) {
        const current = queue.shift();
        
        if (current !== startNode && current !== endNode) {
          current.element.classList.add("visited");
          visitedNodesCount++;
        }
        
        await delay();
        
        if (current === endNode) {
          await drawPath(current);
          return;
        }
        
        for (const n of getNeighbors(current)) {
          if (n.distance === Infinity) {
            n.distance = current.distance + 1;
            n.prev = current;
            queue.push(n);
          }
        }
      }
      showStats(0);
    }
    
    async function astar() {
      clearPath();
      startTime = Date.now();
      startNode.distance = 0;
      startNode.heuristic = heuristic(startNode, endNode);
      
      const openSet = [startNode];
      const closedSet = new Set();
      
      while (openSet.length) {
        openSet.sort((a, b) => (a.distance + a.heuristic) - (b.distance + b.heuristic));
        const current = openSet.shift();
        
        if (closedSet.has(current)) continue;
        closedSet.add(current);
        
        if (current !== startNode && current !== endNode) {
          current.element.classList.add("visited");
          visitedNodesCount++;
        }
        
        await delay();
        
        if (current === endNode) {
          await drawPath(current);
          return;
        }
        
        for (const n of getNeighbors(current)) {
          if (closedSet.has(n)) continue;
          
          const tentativeDistance = current.distance + 1;
          if (tentativeDistance < n.distance) {
            n.distance = tentativeDistance;
            n.heuristic = heuristic(n, endNode);
            n.prev = current;
            if (!openSet.includes(n)) {
              openSet.push(n);
            }
          }
        }
      }
      showStats(0);
    }
    
    async function drawPath(node) {
      const path = [];
      let cur = node.prev;
      
      while (cur && cur !== startNode) {
        path.push(cur);
        cur = cur.prev;
      }
      
      for (const n of path) {
        n.element.classList.add("path");
        await delay();
      }
      
      showStats(path.length);
    }
    
    function showStats(pathLen) {
      const timeElapsed = Date.now() - startTime;
      visitedCountElement.textContent = visitedNodesCount;
      pathLengthElement.textContent = pathLen;
      timeElapsedElement.textContent = timeElapsed + "ms";
      statsElement.classList.add("active");
    }
    
    function delay() {
      const speed = 101 - speedSlider.value;
      return new Promise(res => setTimeout(res, speed));
    }
    
    function resetAll() {
      if (isRunning) return;
      startNode = null;
      endNode = null;
      placementStage = 0;
      createGrid();
      statsElement.classList.remove("active");
    }
    
    visualizeBtn.onclick = async () => {
      if (!startNode || !endNode) {
        alert("⚠️ Please place Start and End nodes first!");
        return;
      }
      
      if (isRunning) return;
      
      isRunning = true;
      visualizeBtn.disabled = true;
      
      const algo = algoSelect.value;
      if (algo === "bfs") await bfs();
      else if (algo === "astar") await astar();
      else await dijkstra();
      
      isRunning = false;
      visualizeBtn.disabled = false;
    };
    
    resetBtn.onclick = resetAll;
    createGrid();
