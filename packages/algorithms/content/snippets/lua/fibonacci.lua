local function fibonacci(n, memo)
    memo = memo or {}
    if n <= 1 then
        return n
    end
    if memo[n] then
        return memo[n]
    end
    memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo)
    return memo[n]
end
