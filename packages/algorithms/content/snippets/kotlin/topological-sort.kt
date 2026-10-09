fun topologicalSort(
    graph: Map<String, List<String>>
): List<String> {
    val inDegree = mutableMapOf<String, Int>()
    for (node in graph.keys) inDegree[node] = 0
    for (neighbors in graph.values) {
        for (neighbor in neighbors) {
            inDegree[neighbor] = (inDegree[neighbor] ?: 0) + 1
        }
    }
    val queue = ArrayDeque<String>()
    for ((node, degree) in inDegree) {
        if (degree == 0) queue.addLast(node)
    }
    val order = mutableListOf<String>()
    while (queue.isNotEmpty()) {
        val node = queue.removeFirst()
        order.add(node)
        for (neighbor in graph[node] ?: emptyList()) {
            val degree = inDegree.getValue(neighbor) - 1
            inDegree[neighbor] = degree
            if (degree == 0) queue.addLast(neighbor)
        }
    }
    if (order.size != inDegree.size) return emptyList()
    return order
}
