function breadthFirstSearch(graph, start) {
  const visited = new Set([start]);
  const order = [];
  const queue = [start];
  let head = 0;
  while (head < queue.length) {
    const node = queue[head];
    head++;
    order.push(node);
    for (const neighbour of graph.get(node) ?? []) {
      if (!visited.has(neighbour)) {
        visited.add(neighbour);
        queue.push(neighbour);
      }
    }
  }
  return order;
}
