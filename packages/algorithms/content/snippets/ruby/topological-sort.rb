def topological_sort(graph)
  in_degree = Hash.new(0)
  graph.each_key { |node| in_degree[node] = 0 }
  graph.each_value do |neighbors|
    neighbors.each { |neighbor| in_degree[neighbor] += 1 }
  end
  queue = in_degree.keys.select { |node| in_degree[node].zero? }
  order = []
  until queue.empty?
    node = queue.shift
    order << node
    graph.fetch(node, []).each do |neighbor|
      in_degree[neighbor] -= 1
      queue << neighbor if in_degree[neighbor].zero?
    end
  end
  order.length == in_degree.length ? order : []
end
