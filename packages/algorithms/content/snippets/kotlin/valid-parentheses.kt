fun validParentheses(str: String): Boolean {
    val pairs = mapOf('(' to ')', '[' to ']', '{' to '}')
    val stack = ArrayDeque<Char>()
    for (ch in str) {
        val closer = pairs[ch]
        if (closer != null) {
            stack.addLast(closer)
        } else if (stack.removeLastOrNull() != ch) {
            return false
        }
    }
    return stack.isEmpty()
}
