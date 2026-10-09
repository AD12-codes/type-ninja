def fibonacci(n, memo = {})
  return n if n <= 1
  return memo[n] if memo.key?(n)
  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo)
end
