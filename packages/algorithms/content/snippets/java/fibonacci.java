import java.util.HashMap;
import java.util.Map;

public static long fibonacci(int n) {
    return fibMemo(n, new HashMap<>());
}

private static long fibMemo(int n, Map<Integer, Long> memo) {
    if (n <= 1) {
        return n;
    }
    if (memo.containsKey(n)) {
        return memo.get(n);
    }
    long value = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
    memo.put(n, value);
    return value;
}
