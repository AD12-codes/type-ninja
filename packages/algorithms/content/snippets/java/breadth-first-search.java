import java.util.*;

public static List<String> breadthFirstSearch(
        Map<String, List<String>> graph, String start) {
    Set<String> visited = new HashSet<>();
    Deque<String> queue = new ArrayDeque<>();
    List<String> order = new ArrayList<>();
    visited.add(start);
    queue.add(start);
    while (!queue.isEmpty()) {
        String node = queue.poll();
        order.add(node);
        List<String> neighbors = graph.get(node);
        if (neighbors == null) {
            continue;
        }
        for (String neighbor : neighbors) {
            if (visited.add(neighbor)) {
                queue.add(neighbor);
            }
        }
    }
    return order;
}
