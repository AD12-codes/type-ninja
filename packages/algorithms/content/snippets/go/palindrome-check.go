func palindromeCheck(s string) bool {
    runes := []rune(s)
    left, right := 0, len(runes)-1
    for left < right {
        if runes[left] != runes[right] {
            return false
        }
        left++
        right--
    }
    return true
}
