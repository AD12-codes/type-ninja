pub fn reverse_string(s: &str) -> String {
    let mut chars: Vec<char> = s.chars().collect();
    let mut left = 0;
    let mut right = chars.len().saturating_sub(1);
    while left < right {
        chars.swap(left, right);
        left += 1;
        right -= 1;
    }
    chars.into_iter().collect()
}
