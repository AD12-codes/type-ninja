func depthFirstSearch(
    graph map[string][]string, start string,
) []string {
    visited := map[string]bool{}
    order := []string{}
    var visit func(node string)
    visit = func(node string) {
        visited[node] = true
        order = append(order, node)
        for _, neighbor := range graph[node] {
            if !visited[neighbor] {
                visit(neighbor)
            }
        }
    }
    visit(start)
    return order
}
