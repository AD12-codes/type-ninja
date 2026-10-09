use std::collections::{HashMap, HashSet, VecDeque};

pub fn breadth_first_search(
    graph: &HashMap<String, Vec<String>>,
    start: &str,
) -> Vec<String> {
    let mut visited = HashSet::new();
    let mut queue = VecDeque::new();
    let mut order = Vec::new();
    visited.insert(start.to_string());
    queue.push_back(start.to_string());
    while let Some(node) = queue.pop_front() {
        if let Some(neighbors) = graph.get(&node) {
            for neighbor in neighbors {
                if visited.insert(neighbor.clone()) {
                    queue.push_back(neighbor.clone());
                }
            }
        }
        order.push(node);
    }
    order
}
