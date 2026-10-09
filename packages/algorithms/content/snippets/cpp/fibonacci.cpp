#include <unordered_map>

using Memo = std::unordered_map<int, long long>;

long long fibonacci(int n, Memo& memo) {
    if (n <= 1) {
        return n;
    }
    auto found = memo.find(n);
    if (found != memo.end()) {
        return found->second;
    }
    long long result = fibonacci(n - 1, memo)
        + fibonacci(n - 2, memo);
    memo[n] = result;
    return result;
}

long long fibonacci(int n) {
    Memo memo;
    return fibonacci(n, memo);
}
