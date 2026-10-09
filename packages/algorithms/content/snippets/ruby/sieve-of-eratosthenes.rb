def sieve_of_eratosthenes(n)
  return [] if n < 2
  is_prime = Array.new(n + 1, true)
  is_prime[0] = is_prime[1] = false
  (2..Integer.sqrt(n)).each do |i|
    next unless is_prime[i]
    (i * i).step(n, i) { |j| is_prime[j] = false }
  end
  (2..n).select { |i| is_prime[i] }
end
