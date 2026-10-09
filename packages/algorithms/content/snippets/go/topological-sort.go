func topologicalSort(graph map[string][]string) []string {
    inDegree := map[string]int{}
    for node, neighbors := range graph {
        if _, ok := inDegree[node]; !ok {
            inDegree[node] = 0
        }
        for _, neighbor := range neighbors {
            inDegree[neighbor]++
        }
    }
    queue := []string{}
    for node, degree := range inDegree {
        if degree == 0 {
            queue = append(queue, node)
        }
    }
    order := []string{}
    for len(queue) > 0 {
        node := queue[0]
        queue = queue[1:]
        order = append(order, node)
        for _, neighbor := range graph[node] {
            inDegree[neighbor]--
            if inDegree[neighbor] == 0 {
                queue = append(queue, neighbor)
            }
        }
    }
    return order
}
