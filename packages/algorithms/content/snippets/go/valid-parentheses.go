func validParentheses(s string) bool {
    pairs := map[rune]rune{'(': ')', '[': ']', '{': '}'}
    expected := []rune{}
    for _, char := range s {
        if closer, ok := pairs[char]; ok {
            expected = append(expected, closer)
            continue
        }
        n := len(expected)
        if n == 0 || expected[n-1] != char {
            return false
        }
        expected = expected[:n-1]
    }
    return len(expected) == 0
}
