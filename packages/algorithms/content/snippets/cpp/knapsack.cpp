#include <algorithm>
#include <vector>

int knapsack(const std::vector<int>& weights,
        const std::vector<int>& values, int capacity) {
    std::vector<int> dp(capacity + 1, 0);
    for (size_t i = 0; i < weights.size(); i++) {
        int weight = weights[i];
        int value = values[i];
        for (int w = capacity; w >= weight; w--) {
            dp[w] = std::max(dp[w], dp[w - weight] + value);
        }
    }
    return dp[capacity];
}
