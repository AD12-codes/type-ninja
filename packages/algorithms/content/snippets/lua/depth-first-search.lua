local function depth_first_search(graph, node, visited, order)
    visited = visited or {}
    order = order or {}
    visited[node] = true
    table.insert(order, node)
    for _, neighbor in ipairs(graph[node] or {}) do
        if not visited[neighbor] then
            depth_first_search(graph, neighbor, visited, order)
        end
    end
    return order
end
