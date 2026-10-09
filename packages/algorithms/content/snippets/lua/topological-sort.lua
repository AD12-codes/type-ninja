local function topological_sort(graph)
    local in_degree = {}
    for node, neighbors in pairs(graph) do
        in_degree[node] = in_degree[node] or 0
        for _, v in ipairs(neighbors) do
            in_degree[v] = (in_degree[v] or 0) + 1
        end
    end
    local queue = {}
    local total = 0
    for node, degree in pairs(in_degree) do
        total = total + 1
        if degree == 0 then
            table.insert(queue, node)
        end
    end
    local order = {}
    local head = 1
    while head <= #queue do
        local u = queue[head]
        head = head + 1
        table.insert(order, u)
        for _, v in ipairs(graph[u] or {}) do
            in_degree[v] = in_degree[v] - 1
            if in_degree[v] == 0 then
                table.insert(queue, v)
            end
        end
    end
    if #order ~= total then
        return nil
    end
    return order
end
