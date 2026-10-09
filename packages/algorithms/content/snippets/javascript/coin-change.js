function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(amount + 1);
  dp[0] = 0;
  for (const coin of coins) {
    for (let total = coin; total <= amount; total++) {
      dp[total] = Math.min(dp[total], dp[total - coin] + 1);
    }
  }
  return dp[amount] > amount ? -1 : dp[amount];
}
