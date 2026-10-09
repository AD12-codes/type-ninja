function topologicalSort(
  graph: Record<string, string[]>
): string[] {
  const inDegree: Record<string, number> = {};
  for (const node of Object.keys(graph)) {
    inDegree[node] ??= 0;
    for (const neighbor of graph[node]) {
      inDegree[neighbor] = (inDegree[neighbor] ?? 0) + 1;
    }
  }
  const nodes = Object.keys(inDegree);
  const queue = nodes.filter((node) => inDegree[node] === 0);
  const order: string[] = [];
  for (let head = 0; head < queue.length; head++) {
    const node = queue[head];
    order.push(node);
    for (const neighbor of graph[node] ?? []) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }
  return order;
}
