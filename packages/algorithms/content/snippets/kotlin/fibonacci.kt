fun fibonacci(
    n: Int,
    memo: HashMap<Int, Long> = HashMap()
): Long {
    if (n <= 1) return n.toLong()
    return memo.getOrPut(n) {
        fibonacci(n - 1, memo) + fibonacci(n - 2, memo)
    }
}
