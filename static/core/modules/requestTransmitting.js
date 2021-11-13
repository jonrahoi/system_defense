/*
* Graph traversal functions to be used by components when forwarding requests
* after they have been processed
*/


var fastestNeighbor = (speeds, visited) => {
    // create a default value for shortest
    let fastest = null;
    
    // for each node in the distances object
    for (let connection in speeds) {
        // if no node has been assigned to shortest yet
        // or if the current node's distance is smaller than the current shortest
        let currentIsFastest =
        fastest === null || speeds[connection] < (speeds[fastest]);
        
        // and if the current node is in the unvisited set
        if (currentIsFastest && !visited.includes(connection)) {
            // update shortest to be the current node
            fastest = connection;
        }
    }
    return fastest;
};

export var findNetworkPath = (network, currComponent, destComponent) => {
    

    // track distances from the start node using a hash object
    let speeds = {};
    let neighbors = network.get(currComponent);
    speeds[destComponent] = "Infinity";
    speeds = Object.assign(speeds, Object.keys(neighbors).reduce((acc, x) => { acc[x] = neighbors[x].latency; return acc; }, {}));
    
    // track paths using a hash object
    let parents = { endNode: null };
    for (let child in neighbors) {
        parents[child] = currComponent;
    }
    
    // collect visited nodes
    let visited = [];
    // find the nearest node
    let node = fastestNeighbor(speeds, visited);
    
    // for that node:
    while (node) {
        // find its distance from the start node & its child nodes
        let connection = speeds[node];
        let childrenConnections = network.get(node); 
        
        // for each of those child nodes:
        for (let child in childrenConnections) {
            
            // make sure each child node is not the start node
            if (String(child) === String(currComponent)) {
                continue;
            } else {
                // save the distance from the start node to the child node
                let newSpeed = connection + childrenConnections[child].latency;
                // if there's no recorded distance from the start node to the child node in the distances object
                // or if the recorded distance is shorter than the previously stored distance from the start node to the child node
                if (!speeds[child] || speeds[child] > newSpeed) {
                    // save the distance to the object
                    speeds[child] = newSpeed;
                    // record the path
                    parents[child] = node;
                } 
            }
        }  
        // move the current node to the visited set
        visited.push(node);
        // move to the nearest neighbor node
        node = fastestNeighbor(speeds, visited);
    }
    
    // using the stored paths from start node to end node
    // record the shortest path
    let shortestPath = [destComponent];
    let parent = parents[destComponent];
    while (parent) {
        shortestPath.push(parent);
        parent = parents[parent];
    }
    shortestPath.reverse();

    // console.log(network);
    // console.log(shortestPath);
    // console.log(speeds);
    // console.log(currComponent);
    // console.log(destComponent);

    //this is the shortest path
    if (shortestPath.length > 1 && speeds[destComponent] !== 'Infinity') { 
        let nextID = shortestPath[1];
        return neighbors[nextID];
    }
};

export default findNetworkPath;