use std::collections::HashMap;

pub fn fibonacci(n: u64) -> u64 {
    fib_memo(n, &mut HashMap::new())
}

fn fib_memo(n: u64, memo: &mut HashMap<u64, u64>) -> u64 {
    if n <= 1 {
        return n;
    }
    if let Some(&value) = memo.get(&n) {
        return value;
    }
    let value = fib_memo(n - 1, memo) + fib_memo(n - 2, memo);
    memo.insert(n, value);
    value
}
