use std::collections::HashMap;

pub fn anagram_check(a: &str, b: &str) -> bool {
    if a.len() != b.len() {
        return false;
    }
    let mut counts: HashMap<char, i32> = HashMap::new();
    for c in a.chars() {
        *counts.entry(c).or_insert(0) += 1;
    }
    for c in b.chars() {
        *counts.entry(c).or_insert(0) -= 1;
    }
    counts.values().all(|&count| count == 0)
}
