#define MAX_FIB 90

static long long memo[MAX_FIB + 1];

long long fibonacci(int n) {
    if (n <= 1) {
        return n;
    }
    if (memo[n] != 0) {
        return memo[n];
    }
    memo[n] = fibonacci(n - 1) + fibonacci(n - 2);
    return memo[n];
}
