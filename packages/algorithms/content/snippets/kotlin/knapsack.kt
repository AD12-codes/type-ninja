fun knapsack(
    weights: IntArray,
    values: IntArray,
    capacity: Int
): Int {
    val dp = IntArray(capacity + 1)
    for (i in weights.indices) {
        val weight = weights[i]
        for (w in capacity downTo weight) {
            dp[w] = maxOf(dp[w], dp[w - weight] + values[i])
        }
    }
    return dp[capacity]
}
