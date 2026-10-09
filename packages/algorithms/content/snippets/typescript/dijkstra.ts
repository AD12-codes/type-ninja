function dijkstra(
  graph: Record<string, Record<string, number>>,
  source: string
): Record<string, number> {
  const dist: Record<string, number> = { [source]: 0 };
  const frontier: [string, number][] = [[source, 0]];
  while (frontier.length > 0) {
    let best = 0;
    for (let i = 1; i < frontier.length; i++) {
      if (frontier[i][1] < frontier[best][1]) {
        best = i;
      }
    }
    const [node, d] = frontier[best];
    frontier.splice(best, 1);
    if (d > dist[node]) {
      continue;
    }
    const edges = Object.entries(graph[node] ?? {});
    for (const [neighbor, weight] of edges) {
      const candidate = d + weight;
      if (!(neighbor in dist) || candidate < dist[neighbor]) {
        dist[neighbor] = candidate;
        frontier.push([neighbor, candidate]);
      }
    }
  }
  return dist;
}
