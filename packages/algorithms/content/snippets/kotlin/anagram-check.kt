fun anagramCheck(a: String, b: String): Boolean {
    if (a.length != b.length) return false
    val counts = HashMap<Char, Int>()
    for (ch in a) counts[ch] = (counts[ch] ?: 0) + 1
    for (ch in b) {
        val count = counts[ch] ?: 0
        if (count == 0) return false
        counts[ch] = count - 1
    }
    return true
}
