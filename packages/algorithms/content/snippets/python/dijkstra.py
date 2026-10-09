import heapq

def dijkstra(graph, source):
    distances = {node: float("inf") for node in graph}
    distances[source] = 0
    heap = [(0, source)]
    while heap:
        distance, node = heapq.heappop(heap)
        if distance > distances[node]:
            continue
        for neighbour, weight in graph[node]:
            candidate = distance + weight
            if candidate < distances[neighbour]:
                distances[neighbour] = candidate
                heapq.heappush(heap, (candidate, neighbour))
    return distances
