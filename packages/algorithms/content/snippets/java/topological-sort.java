import java.util.*;

public static List<String> topologicalSort(
        Map<String, List<String>> graph) {
    Map<String, Integer> inDegree = new HashMap<>();
    graph.forEach((node, neighbors) -> {
        inDegree.putIfAbsent(node, 0);
        for (String neighbor : neighbors) {
            inDegree.merge(neighbor, 1, Integer::sum);
        }
    });
    Deque<String> queue = new ArrayDeque<>();
    inDegree.forEach((node, degree) -> {
        if (degree == 0) {
            queue.add(node);
        }
    });
    List<String> order = new ArrayList<>();
    while (!queue.isEmpty()) {
        String node = queue.poll();
        order.add(node);
        List<String> neighbors = graph.get(node);
        if (neighbors == null) {
            continue;
        }
        for (String neighbor : neighbors) {
            inDegree.merge(neighbor, -1, Integer::sum);
            if (inDegree.get(neighbor) == 0) {
                queue.add(neighbor);
            }
        }
    }
    return order;
}
