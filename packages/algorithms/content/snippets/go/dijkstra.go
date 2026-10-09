import "container/heap"

type item struct {
    node string
    dist int
}

type minHeap []item

func (h minHeap) Len() int      { return len(h) }
func (h minHeap) Swap(i, j int) { h[i], h[j] = h[j], h[i] }
func (h minHeap) Less(i, j int) bool {
    return h[i].dist < h[j].dist
}
func (h *minHeap) Push(x any) {
    *h = append(*h, x.(item))
}
func (h *minHeap) Pop() any {
    old := *h
    last := old[len(old)-1]
    *h = old[:len(old)-1]
    return last
}

func dijkstra(
    graph map[string]map[string]int, source string,
) map[string]int {
    dist := map[string]int{source: 0}
    pq := &minHeap{{source, 0}}
    for pq.Len() > 0 {
        current := heap.Pop(pq).(item)
        if current.dist > dist[current.node] {
            continue
        }
        for to, weight := range graph[current.node] {
            candidate := current.dist + weight
            if d, ok := dist[to]; !ok || candidate < d {
                dist[to] = candidate
                heap.Push(pq, item{to, candidate})
            }
        }
    }
    return dist
}
