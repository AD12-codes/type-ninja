pub fn linear_search(
    arr: &[i32],
    target: i32,
) -> Option<usize> {
    for (index, &value) in arr.iter().enumerate() {
        if value == target {
            return Some(index);
        }
    }
    None
}
