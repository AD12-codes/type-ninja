use std::collections::{HashMap, VecDeque};

pub fn topological_sort(
    graph: &HashMap<String, Vec<String>>,
) -> Vec<String> {
    let mut in_degree: HashMap<String, usize> = HashMap::new();
    for node in graph.keys() {
        in_degree.entry(node.clone()).or_default();
    }
    for neighbor in graph.values().flatten() {
        *in_degree.entry(neighbor.clone()).or_default() += 1;
    }
    let mut queue: VecDeque<String> = in_degree
        .iter()
        .filter(|(_, &degree)| degree == 0)
        .map(|(node, _)| node.clone())
        .collect();
    let mut order = Vec::new();
    while let Some(node) = queue.pop_front() {
        for neighbor in graph.get(&node).into_iter().flatten() {
            let degree = in_degree.get_mut(neighbor).unwrap();
            *degree -= 1;
            if *degree == 0 {
                queue.push_back(neighbor.clone());
            }
        }
        order.push(node);
    }
    order
}
