fun factorial(n: Int): Long {
    require(n >= 0) { "n must be >= 0" }
    if (n <= 1) return 1L
    return n * factorial(n - 1)
}
