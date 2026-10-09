fun breadthFirstSearch(
    graph: Map<String, List<String>>,
    start: String
): List<String> {
    val visited = mutableListOf(start)
    val seen = hashSetOf(start)
    val queue = ArrayDeque<String>()
    queue.addLast(start)
    while (queue.isNotEmpty()) {
        val node = queue.removeFirst()
        for (neighbor in graph[node] ?: emptyList()) {
            if (seen.add(neighbor)) {
                visited.add(neighbor)
                queue.addLast(neighbor)
            }
        }
    }
    return visited
}
