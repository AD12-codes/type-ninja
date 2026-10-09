using System;

public static int CoinChange(int[] coins, int amount)
{
    int infinity = amount + 1;
    int[] dp = new int[amount + 1];
    Array.Fill(dp, infinity);
    dp[0] = 0;
    for (int sum = 1; sum <= amount; sum++)
    {
        foreach (int coin in coins)
        {
            if (coin > sum)
            {
                continue;
            }
            dp[sum] = Math.Min(dp[sum], dp[sum - coin] + 1);
        }
    }
    return dp[amount] == infinity ? -1 : dp[amount];
}
