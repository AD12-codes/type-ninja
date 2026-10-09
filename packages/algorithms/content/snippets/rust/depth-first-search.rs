use std::collections::{HashMap, HashSet};

pub fn depth_first_search(
    graph: &HashMap<String, Vec<String>>,
    start: &str,
) -> Vec<String> {
    let mut visited = HashSet::new();
    let mut order = Vec::new();
    dfs(graph, start, &mut visited, &mut order);
    order
}

fn dfs(
    graph: &HashMap<String, Vec<String>>,
    node: &str,
    visited: &mut HashSet<String>,
    order: &mut Vec<String>,
) {
    if !visited.insert(node.to_string()) {
        return;
    }
    order.push(node.to_string());
    if let Some(neighbors) = graph.get(node) {
        for neighbor in neighbors {
            dfs(graph, neighbor, visited, order);
        }
    }
}
