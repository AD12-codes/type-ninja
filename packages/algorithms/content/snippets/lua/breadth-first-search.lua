local function breadth_first_search(graph, start)
    local visited = { [start] = true }
    local queue = { start }
    local head = 1
    local order = {}
    while head <= #queue do
        local node = queue[head]
        head = head + 1
        table.insert(order, node)
        for _, neighbor in ipairs(graph[node] or {}) do
            if not visited[neighbor] then
                visited[neighbor] = true
                table.insert(queue, neighbor)
            end
        end
    end
    return order
end
