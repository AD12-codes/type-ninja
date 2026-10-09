function factorial(n) {
  if (n < 0) {
    throw new RangeError("n must be non-negative");
  }
  if (n <= 1) {
    return 1;
  }
  return n * factorial(n - 1);
}
