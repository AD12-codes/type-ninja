func anagramCheck(a, b string) bool {
    if len(a) != len(b) {
        return false
    }
    counts := map[rune]int{}
    for _, char := range a {
        counts[char]++
    }
    for _, char := range b {
        if counts[char] == 0 {
            return false
        }
        counts[char]--
    }
    return true
}
