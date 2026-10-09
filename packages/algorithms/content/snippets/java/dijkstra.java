import java.util.HashMap;
import java.util.Map;
import java.util.PriorityQueue;

record Edge(String node, int dist) implements Comparable<Edge> {
    public int compareTo(Edge other) {
        return Integer.compare(dist, other.dist);
    }
}

public static Map<String, Integer> dijkstra(
        Map<String, Map<String, Integer>> graph,
        String source) {
    Map<String, Integer> dist = new HashMap<>();
    PriorityQueue<Edge> heap = new PriorityQueue<>();
    dist.put(source, 0);
    heap.add(new Edge(source, 0));
    while (!heap.isEmpty()) {
        Edge current = heap.poll();
        if (current.dist() > dist.get(current.node())) {
            continue;
        }
        Map<String, Integer> edges = graph.get(current.node());
        if (edges == null) {
            continue;
        }
        for (Map.Entry<String, Integer> e : edges.entrySet()) {
            int next = current.dist() + e.getValue();
            Integer best = dist.get(e.getKey());
            if (best == null || next < best) {
                dist.put(e.getKey(), next);
                heap.add(new Edge(e.getKey(), next));
            }
        }
    }
    return dist;
}
