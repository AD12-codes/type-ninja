fun sieveOfEratosthenes(n: Int): List<Int> {
    if (n < 2) return emptyList()
    val isPrime = BooleanArray(n + 1) { true }
    isPrime[0] = false
    isPrime[1] = false
    var i = 2
    while (i * i <= n) {
        if (isPrime[i]) {
            for (j in i * i..n step i) isPrime[j] = false
        }
        i++
    }
    return (2..n).filter { isPrime[it] }
}
