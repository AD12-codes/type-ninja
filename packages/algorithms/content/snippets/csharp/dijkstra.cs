using System.Collections.Generic;

public static Dictionary<string, int> Dijkstra(
    Dictionary<string, List<(string, int)>> graph, string start)
{
    var dist = new Dictionary<string, int>();
    dist[start] = 0;
    var pq = new PriorityQueue<string, int>();
    pq.Enqueue(start, 0);
    while (pq.Count > 0)
    {
        pq.TryDequeue(out string node, out int d);
        if (d > dist[node] || !graph.ContainsKey(node))
        {
            continue;
        }
        foreach ((string next, int weight) in graph[node])
        {
            int candidate = d + weight;
            bool improved = !dist.ContainsKey(next)
                || candidate < dist[next];
            if (improved)
            {
                dist[next] = candidate;
                pq.Enqueue(next, candidate);
            }
        }
    }
    return dist;
}
