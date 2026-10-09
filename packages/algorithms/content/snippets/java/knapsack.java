public static int knapsack(
        int[] weights, int[] values, int capacity) {
    int[] dp = new int[capacity + 1];
    for (int i = 0; i < weights.length; i++) {
        int weight = weights[i];
        int value = values[i];
        for (int w = capacity; w >= weight; w--) {
            dp[w] = Math.max(dp[w], dp[w - weight] + value);
        }
    }
    return dp[capacity];
}
