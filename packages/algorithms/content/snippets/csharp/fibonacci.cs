using System.Collections.Generic;

public static long Fibonacci(int n)
{
    return Fibonacci(n, new Dictionary<int, long>());
}

public static long Fibonacci(int n, Dictionary<int, long> memo)
{
    if (n <= 1)
    {
        return n;
    }
    if (memo.TryGetValue(n, out long cached))
    {
        return cached;
    }
    long result = Fibonacci(n - 1, memo)
        + Fibonacci(n - 2, memo);
    memo[n] = result;
    return result;
}
