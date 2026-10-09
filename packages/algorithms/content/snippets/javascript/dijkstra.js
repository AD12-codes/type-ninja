function dijkstra(graph, source) {
  const distances = new Map();
  for (const node of graph.keys()) {
    distances.set(node, Number.POSITIVE_INFINITY);
  }
  distances.set(source, 0);
  const queue = [[0, source]];
  while (queue.length > 0) {
    const [distance, node] = queue.shift();
    if (distance > distances.get(node)) {
      continue;
    }
    for (const [neighbour, weight] of graph.get(node)) {
      const candidate = distance + weight;
      if (candidate < distances.get(neighbour)) {
        distances.set(neighbour, candidate);
        insertSorted(queue, [candidate, neighbour]);
      }
    }
  }
  return distances;
}

function insertSorted(queue, entry) {
  let index = queue.length;
  while (index > 0 && queue[index - 1][0] > entry[0]) {
    index--;
  }
  queue.splice(index, 0, entry);
}
