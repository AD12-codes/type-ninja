function coinChange(coins: number[], amount: number): number {
  const INF = Number.POSITIVE_INFINITY;
  const dp = new Array<number>(amount + 1).fill(INF);
  dp[0] = 0;
  for (let total = 1; total <= amount; total++) {
    for (const coin of coins) {
      if (coin <= total) {
        dp[total] = Math.min(dp[total], dp[total - coin] + 1);
      }
    }
  }
  return dp[amount] === INF ? -1 : dp[amount];
}
