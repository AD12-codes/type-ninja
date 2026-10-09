local function coin_change(coins, amount)
    local dp = { [0] = 0 }
    for a = 1, amount do
        dp[a] = amount + 1
        for _, coin in ipairs(coins) do
            if coin <= a and dp[a - coin] + 1 < dp[a] then
                dp[a] = dp[a - coin] + 1
            end
        end
    end
    if dp[amount] > amount then
        return -1
    end
    return dp[amount]
end
