import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public static List<Integer> sieveOfEratosthenes(int n) {
    List<Integer> primes = new ArrayList<>();
    if (n < 2) {
        return primes;
    }
    boolean[] isPrime = new boolean[n + 1];
    Arrays.fill(isPrime, true);
    isPrime[0] = false;
    isPrime[1] = false;
    for (int i = 2; (long) i * i <= n; i++) {
        if (isPrime[i]) {
            for (int j = i * i; j <= n; j += i) {
                isPrime[j] = false;
            }
        }
    }
    for (int i = 2; i <= n; i++) {
        if (isPrime[i]) {
            primes.add(i);
        }
    }
    return primes;
}
