def fast_power(base, exp)
  result = 1
  while exp > 0
    result *= base if exp.odd?
    base *= base
    exp /= 2
  end
  result
end
