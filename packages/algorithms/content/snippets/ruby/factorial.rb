def factorial(n)
  raise ArgumentError, "n must be >= 0" if n < 0
  return 1 if n <= 1
  n * factorial(n - 1)
end
