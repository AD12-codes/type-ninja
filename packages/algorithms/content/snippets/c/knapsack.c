#include <stdlib.h>

int knapsack(int weights[], int values[], int n, int capacity) {
    int *dp = calloc(capacity + 1, sizeof(int));
    for (int i = 0; i < n; i++) {
        for (int w = capacity; w >= weights[i]; w--) {
            int candidate = dp[w - weights[i]] + values[i];
            if (candidate > dp[w]) {
                dp[w] = candidate;
            }
        }
    }
    int best = dp[capacity];
    free(dp);
    return best;
}
