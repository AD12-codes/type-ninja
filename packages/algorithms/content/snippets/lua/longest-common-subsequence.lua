local function longest_common_subsequence(a, b)
    local m, n = #a, #b
    local dp = {}
    for i = 0, m do
        dp[i] = {}
        for j = 0, n do
            dp[i][j] = 0
        end
    end
    for i = 1, m do
        for j = 1, n do
            if a:sub(i, i) == b:sub(j, j) then
                dp[i][j] = dp[i - 1][j - 1] + 1
            else
                dp[i][j] = math.max(dp[i - 1][j], dp[i][j - 1])
            end
        end
    end
    return dp[m][n]
end
