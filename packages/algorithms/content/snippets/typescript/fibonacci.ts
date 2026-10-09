function fibonacci(
  n: number,
  memo: Map<number, number> = new Map()
): number {
  if (n <= 1) {
    return n;
  }
  const cached = memo.get(n);
  if (cached !== undefined) {
    return cached;
  }
  const value = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  memo.set(n, value);
  return value;
}
