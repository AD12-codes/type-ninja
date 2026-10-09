import java.util.PriorityQueue

fun dijkstra(
    graph: Map<String, List<Pair<String, Int>>>,
    source: String
): Map<String, Int> {
    val dist = HashMap<String, Int>()
    dist[source] = 0
    val queue = PriorityQueue<Pair<Int, String>>(
        compareBy<Pair<Int, String>> { it.first }
    )
    queue.add(0 to source)
    while (queue.isNotEmpty()) {
        val (currentDist, node) = queue.poll()
        val known = dist[node] ?: Int.MAX_VALUE
        if (currentDist > known) continue
        for ((neighbor, weight) in graph[node] ?: emptyList()) {
            val newDist = currentDist + weight
            if (newDist < (dist[neighbor] ?: Int.MAX_VALUE)) {
                dist[neighbor] = newDist
                queue.add(newDist to neighbor)
            }
        }
    }
    return dist
}
