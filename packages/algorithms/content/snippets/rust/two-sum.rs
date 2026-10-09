use std::collections::HashMap;

pub fn two_sum(
    nums: &[i32],
    target: i32,
) -> Option<(usize, usize)> {
    let mut seen = HashMap::new();
    for (i, &num) in nums.iter().enumerate() {
        if let Some(&j) = seen.get(&(target - num)) {
            return Some((j, i));
        }
        seen.insert(num, i);
    }
    None
}
