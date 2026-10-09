function topologicalSort(graph) {
  const indegree = new Map();
  for (const node of graph.keys()) {
    indegree.set(node, 0);
  }
  for (const neighbours of graph.values()) {
    for (const neighbour of neighbours) {
      const degree = indegree.get(neighbour) ?? 0;
      indegree.set(neighbour, degree + 1);
    }
  }
  const queue = [];
  for (const [node, degree] of indegree) {
    if (degree === 0) {
      queue.push(node);
    }
  }
  const order = [];
  let head = 0;
  while (head < queue.length) {
    const node = queue[head];
    head++;
    order.push(node);
    for (const neighbour of graph.get(node) ?? []) {
      indegree.set(neighbour, indegree.get(neighbour) - 1);
      if (indegree.get(neighbour) === 0) {
        queue.push(neighbour);
      }
    }
  }
  if (order.length !== indegree.size) {
    throw new Error("graph has a cycle");
  }
  return order;
}
