function sieveOfEratosthenes(n) {
  if (n < 2) {
    return [];
  }
  const isPrime = new Array(n + 1).fill(true);
  isPrime[0] = false;
  isPrime[1] = false;
  for (let i = 2; i * i <= n; i++) {
    if (isPrime[i]) {
      for (let multiple = i * i; multiple <= n; multiple += i) {
        isPrime[multiple] = false;
      }
    }
  }
  const primes = [];
  for (let i = 2; i <= n; i++) {
    if (isPrime[i]) {
      primes.push(i);
    }
  }
  return primes;
}
