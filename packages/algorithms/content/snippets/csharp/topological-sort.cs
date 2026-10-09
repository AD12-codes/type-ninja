using System.Collections.Generic;

public static List<string> TopologicalSort(
    Dictionary<string, List<string>> graph)
{
    var degree = new Dictionary<string, int>();
    foreach (var entry in graph)
    {
        degree.TryAdd(entry.Key, 0);
        foreach (string next in entry.Value)
        {
            degree[next] = degree.GetValueOrDefault(next) + 1;
        }
    }
    var ready = new Queue<string>();
    foreach (var entry in degree)
    {
        if (entry.Value == 0)
        {
            ready.Enqueue(entry.Key);
        }
    }
    var order = new List<string>();
    while (ready.Count > 0)
    {
        string node = ready.Dequeue();
        order.Add(node);
        if (!graph.ContainsKey(node))
        {
            continue;
        }
        foreach (string next in graph[node])
        {
            degree[next]--;
            if (degree[next] == 0)
            {
                ready.Enqueue(next);
            }
        }
    }
    return order;
}
