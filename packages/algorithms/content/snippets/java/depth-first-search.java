import java.util.*;

public static List<String> depthFirstSearch(
        Map<String, List<String>> graph, String start) {
    List<String> order = new ArrayList<>();
    dfs(graph, start, new HashSet<>(), order);
    return order;
}

private static void dfs(
        Map<String, List<String>> graph,
        String node,
        Set<String> visited,
        List<String> order) {
    if (!visited.add(node)) {
        return;
    }
    order.add(node);
    List<String> neighbors = graph.get(node);
    if (neighbors == null) {
        return;
    }
    for (String neighbor : neighbors) {
        dfs(graph, neighbor, visited, order);
    }
}
