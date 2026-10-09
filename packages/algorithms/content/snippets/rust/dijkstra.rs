use std::cmp::Reverse;
use std::collections::{BinaryHeap, HashMap};

pub fn dijkstra(
    graph: &HashMap<String, Vec<(String, u32)>>,
    source: &str,
) -> HashMap<String, u32> {
    let mut dist = HashMap::new();
    let mut heap = BinaryHeap::new();
    dist.insert(source.to_string(), 0);
    heap.push(Reverse((0, source.to_string())));
    while let Some(Reverse((d, node))) = heap.pop() {
        if d > dist[&node] {
            continue;
        }
        let edges = graph.get(&node).into_iter().flatten();
        for (neighbor, weight) in edges {
            let next = d + weight;
            if dist.get(neighbor).map_or(true, |&b| next < b) {
                dist.insert(neighbor.clone(), next);
                heap.push(Reverse((next, neighbor.clone())));
            }
        }
    }
    dist
}
