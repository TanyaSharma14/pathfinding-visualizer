 Pathfinding Visualizer

An interactive web-based **Pathfinding Visualizer** built to demonstrate how classic
graph traversal and shortest-path algorithms work using real-time animations.

This project focuses on making core Data Structures and Algorithms concepts visual,
intuitive, and interactive instead of abstract.

 Features

- Interactive grid-based interface
- User-defined **Start** and **End** nodes
- Click-to-toggle **walls/obstacles**
- Smooth animated visualization
- Adjustable animation speed
- Execution statistics after each run
- Clean and modern UI

 Algorithms Implemented

Dijkstra’s Algorithm
- Guarantees the shortest path
- Explores nodes based on minimum distance
- Implemented with uniform edge weights

 Breadth-First Search (BFS)
- Explores nodes level by level
- Produces shortest path in unweighted graphs
- Faster but less flexible than Dijkstra

 A* (A-Star) Algorithm
- Uses Manhattan distance as heuristic
- More efficient than Dijkstra in most cases
- Combines cost-so-far with estimated distance

 How to Use

1. Open the application
2. Click on any cell to place the **Start** node
3. Click another cell to place the **End** node
4. Click remaining cells to add or remove **walls**
5. Select an algorithm from the dropdown
6. Click **Visualize Path**
7. Observe:
   - 🔵 Blue cells → Visited nodes
   - 🟡 Yellow cells → Shortest path
8. View execution statistics below the grid
 Execution Statistics

After each visualization, the following metrics are displayed:
- Number of nodes visited
- Length of the shortest path
- Time taken to compute the path

 Tech Stack

- **HTML5**
- **CSS3**
- **Vanilla JavaScript**
- **GitHub Pages** (Deployment)

No external libraries or frameworks were used.



Learning Outcomes

- Practical understanding of graph algorithms
- Visualization of algorithmic behavior
- DOM manipulation and event handling
- UI state management
- Algorithm comparison in real time





