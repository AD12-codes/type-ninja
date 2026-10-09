#include <stdlib.h>

int coin_change(int coins[], int n, int amount) {
    int *dp = malloc((amount + 1) * sizeof(int));
    dp[0] = 0;
    for (int a = 1; a <= amount; a++) {
        dp[a] = amount + 1;
        for (int i = 0; i < n; i++) {
            if (coins[i] <= a && dp[a - coins[i]] + 1 < dp[a]) {
                dp[a] = dp[a - coins[i]] + 1;
            }
        }
    }
    int result = dp[amount] > amount ? -1 : dp[amount];
    free(dp);
    return result;
}
