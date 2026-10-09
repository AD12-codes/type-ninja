fun coinChange(coins: IntArray, amount: Int): Int {
    val dp = IntArray(amount + 1) { amount + 1 }
    dp[0] = 0
    for (total in 1..amount) {
        for (coin in coins) {
            if (coin > total) continue
            val candidate = dp[total - coin] + 1
            dp[total] = minOf(dp[total], candidate)
        }
    }
    return if (dp[amount] > amount) -1 else dp[amount]
}
