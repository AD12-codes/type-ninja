#include <algorithm>
#include <vector>

int coinChange(const std::vector<int>& coins, int amount) {
    int infinity = amount + 1;
    std::vector<int> dp(amount + 1, infinity);
    dp[0] = 0;
    for (int sum = 1; sum <= amount; sum++) {
        for (int coin : coins) {
            if (coin > sum) {
                continue;
            }
            dp[sum] = std::min(dp[sum], dp[sum - coin] + 1);
        }
    }
    return dp[amount] == infinity ? -1 : dp[amount];
}
