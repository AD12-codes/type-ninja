func coinChange(coins []int, amount int) int {
    dp := make([]int, amount+1)
    for total := 1; total <= amount; total++ {
        dp[total] = amount + 1
        for _, coin := range coins {
            if coin <= total && dp[total-coin]+1 < dp[total] {
                dp[total] = dp[total-coin] + 1
            }
        }
    }
    if dp[amount] > amount {
        return -1
    }
    return dp[amount]
}
