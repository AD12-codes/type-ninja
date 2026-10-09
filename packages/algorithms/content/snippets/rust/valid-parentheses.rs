pub fn valid_parentheses(s: &str) -> bool {
    let mut stack = Vec::new();
    for c in s.chars() {
        match c {
            '(' => stack.push(')'),
            '[' => stack.push(']'),
            '{' => stack.push('}'),
            _ => {
                if stack.pop() != Some(c) {
                    return false;
                }
            }
        }
    }
    stack.is_empty()
}
