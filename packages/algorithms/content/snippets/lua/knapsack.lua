local function knapsack(weights, values, capacity)
    local dp = {}
    for w = 0, capacity do
        dp[w] = 0
    end
    for i = 1, #weights do
        for w = capacity, weights[i], -1 do
            local candidate = dp[w - weights[i]] + values[i]
            if candidate > dp[w] then
                dp[w] = candidate
            end
        end
    end
    return dp[capacity]
end
