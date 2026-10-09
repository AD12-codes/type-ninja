def depth_first_search(graph, node, visited = [], seen = {})
  return visited if seen[node]
  seen[node] = true
  visited << node
  graph.fetch(node, []).each do |neighbor|
    depth_first_search(graph, neighbor, visited, seen)
  end
  visited
end
