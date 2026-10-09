function depthFirstSearch(
  graph: Record<string, string[]>,
  start: string
): string[] {
  const visited = new Set<string>();
  const order: string[] = [];
  const visit = (node: string): void => {
    visited.add(node);
    order.push(node);
    for (const neighbor of graph[node] ?? []) {
      if (!visited.has(neighbor)) {
        visit(neighbor);
      }
    }
  };
  visit(start);
  return order;
}
