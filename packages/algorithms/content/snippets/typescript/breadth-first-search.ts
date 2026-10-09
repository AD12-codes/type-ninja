function breadthFirstSearch(
  graph: Record<string, string[]>,
  start: string
): string[] {
  const visited = new Set<string>([start]);
  const order: string[] = [];
  const queue: string[] = [start];
  for (let head = 0; head < queue.length; head++) {
    const node = queue[head];
    order.push(node);
    for (const neighbor of graph[node] ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return order;
}
