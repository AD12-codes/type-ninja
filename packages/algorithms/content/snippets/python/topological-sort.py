from collections import deque

def topological_sort(graph):
    indegree = {node: 0 for node in graph}
    for neighbours in graph.values():
        for neighbour in neighbours:
            indegree[neighbour] = indegree.get(neighbour, 0) + 1
    queue = deque(n for n, d in indegree.items() if d == 0)
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbour in graph.get(node, []):
            indegree[neighbour] -= 1
            if indegree[neighbour] == 0:
                queue.append(neighbour)
    if len(order) != len(indegree):
        raise ValueError("graph has a cycle")
    return order
