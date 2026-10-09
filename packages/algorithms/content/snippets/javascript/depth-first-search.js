function depthFirstSearch(graph, start) {
  const visited = new Set();
  const order = [];
  const visit = (node) => {
    visited.add(node);
    order.push(node);
    for (const neighbour of graph.get(node) ?? []) {
      if (!visited.has(neighbour)) {
        visit(neighbour);
      }
    }
  };
  visit(start);
  return order;
}
