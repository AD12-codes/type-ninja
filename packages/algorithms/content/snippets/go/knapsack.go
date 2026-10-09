func knapsack(weights, values []int, capacity int) int {
    dp := make([]int, capacity+1)
    for i := range weights {
        for w := capacity; w >= weights[i]; w-- {
            dp[w] = max(dp[w], dp[w-weights[i]]+values[i])
        }
    }
    return dp[capacity]
}
