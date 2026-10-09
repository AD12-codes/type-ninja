def depth_first_search(graph, start):
    visited = set()
    order = []

    def visit(node):
        visited.add(node)
        order.append(node)
        for neighbour in graph.get(node, []):
            if neighbour not in visited:
                visit(neighbour)

    visit(start)
    return order
