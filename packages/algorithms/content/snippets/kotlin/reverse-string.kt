fun reverseString(str: String): String {
    val chars = str.toCharArray()
    var left = 0
    var right = chars.size - 1
    while (left < right) {
        val temp = chars[left]
        chars[left] = chars[right]
        chars[right] = temp
        left++
        right--
    }
    return String(chars)
}
