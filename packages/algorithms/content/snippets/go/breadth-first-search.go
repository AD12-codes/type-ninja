func breadthFirstSearch(
    graph map[string][]string, start string,
) []string {
    visited := map[string]bool{start: true}
    order := []string{}
    queue := []string{start}
    for len(queue) > 0 {
        node := queue[0]
        queue = queue[1:]
        order = append(order, node)
        for _, neighbor := range graph[node] {
            if !visited[neighbor] {
                visited[neighbor] = true
                queue = append(queue, neighbor)
            }
        }
    }
    return order
}
