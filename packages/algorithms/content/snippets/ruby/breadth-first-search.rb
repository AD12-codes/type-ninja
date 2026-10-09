def breadth_first_search(graph, start)
  visited = [start]
  seen = { start => true }
  queue = [start]
  until queue.empty?
    node = queue.shift
    graph.fetch(node, []).each do |neighbor|
      next if seen[neighbor]
      seen[neighbor] = true
      visited << neighbor
      queue << neighbor
    end
  end
  visited
end
