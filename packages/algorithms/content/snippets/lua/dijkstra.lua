local function dijkstra(graph, source)
    local dist = {}
    local done = {}
    for node in pairs(graph) do
        dist[node] = math.huge
    end
    dist[source] = 0
    for _ in pairs(graph) do
        local u
        for node, d in pairs(dist) do
            if not done[node] and (u == nil or d < dist[u]) then
                u = node
            end
        end
        if u == nil or dist[u] == math.huge then
            break
        end
        done[u] = true
        for v, w in pairs(graph[u]) do
            if dist[v] == nil or dist[u] + w < dist[v] then
                dist[v] = dist[u] + w
            end
        end
    end
    return dist
end
