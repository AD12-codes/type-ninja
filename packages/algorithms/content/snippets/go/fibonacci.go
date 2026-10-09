func fibonacci(n int) int {
    memo := map[int]int{}
    var fib func(k int) int
    fib = func(k int) int {
        if k <= 1 {
            return k
        }
        if value, ok := memo[k]; ok {
            return value
        }
        memo[k] = fib(k-1) + fib(k-2)
        return memo[k]
    }
    return fib(n)
}
