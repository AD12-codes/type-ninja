func sieveOfEratosthenes(n int) []int {
    primes := []int{}
    if n < 2 {
        return primes
    }
    isComposite := make([]bool, n+1)
    for i := 2; i <= n; i++ {
        if isComposite[i] {
            continue
        }
        primes = append(primes, i)
        for j := i * i; j <= n; j += i {
            isComposite[j] = true
        }
    }
    return primes
}
