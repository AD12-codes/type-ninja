fun depthFirstSearch(
    graph: Map<String, List<String>>,
    node: String,
    visited: MutableList<String> = mutableListOf(),
    seen: HashSet<String> = hashSetOf()
): List<String> {
    if (!seen.add(node)) return visited
    visited.add(node)
    for (neighbor in graph[node] ?: emptyList()) {
        depthFirstSearch(graph, neighbor, visited, seen)
    }
    return visited
}
