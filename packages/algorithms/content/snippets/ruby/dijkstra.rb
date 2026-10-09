def dijkstra(graph, source)
  dist = Hash.new(Float::INFINITY)
  dist[source] = 0
  queue = [[0, source]]
  until queue.empty?
    current_dist, node = queue.shift
    next if current_dist > dist[node]
    graph.fetch(node, []).each do |neighbor, weight|
      new_dist = current_dist + weight
      next unless new_dist < dist[neighbor]
      dist[neighbor] = new_dist
      index = queue.bsearch_index { |d, _| d >= new_dist }
      queue.insert(index || queue.length, [new_dist, neighbor])
    end
  end
  dist
end
