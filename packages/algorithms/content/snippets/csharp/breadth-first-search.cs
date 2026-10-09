using System.Collections.Generic;

public static List<string> BreadthFirstSearch(
    Dictionary<string, List<string>> graph, string start)
{
    var order = new List<string>();
    var visited = new HashSet<string> { start };
    var pending = new Queue<string>();
    pending.Enqueue(start);
    while (pending.Count > 0)
    {
        string node = pending.Dequeue();
        order.Add(node);
        if (!graph.ContainsKey(node))
        {
            continue;
        }
        foreach (string next in graph[node])
        {
            if (visited.Add(next))
            {
                pending.Enqueue(next);
            }
        }
    }
    return order;
}
