using System.Collections.Generic;

public static List<string> DepthFirstSearch(
    Dictionary<string, List<string>> graph, string start)
{
    var order = new List<string>();
    Dfs(graph, start, new HashSet<string>(), order);
    return order;
}

public static void Dfs(Dictionary<string, List<string>> graph,
    string node, HashSet<string> visited, List<string> order)
{
    visited.Add(node);
    order.Add(node);
    if (!graph.ContainsKey(node))
    {
        return;
    }
    foreach (string next in graph[node])
    {
        if (!visited.Contains(next))
        {
            Dfs(graph, next, visited, order);
        }
    }
}
