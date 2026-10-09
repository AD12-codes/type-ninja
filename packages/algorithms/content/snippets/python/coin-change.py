def coin_change(coins, amount):
    dp = [0] + [amount + 1] * amount
    for coin in coins:
        for total in range(coin, amount + 1):
            dp[total] = min(dp[total], dp[total - coin] + 1)
    return dp[amount] if dp[amount] <= amount else -1
