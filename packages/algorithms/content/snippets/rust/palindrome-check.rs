pub fn palindrome_check(s: &str) -> bool {
    let chars: Vec<char> = s.chars().collect();
    if chars.is_empty() {
        return true;
    }
    let (mut left, mut right) = (0, chars.len() - 1);
    while left < right {
        if chars[left] != chars[right] {
            return false;
        }
        left += 1;
        right -= 1;
    }
    true
}
