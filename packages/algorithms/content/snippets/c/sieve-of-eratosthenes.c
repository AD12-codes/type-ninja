#include <stdbool.h>
#include <stdlib.h>

int sieve_of_eratosthenes(int n, int primes[]) {
    bool *is_prime = malloc((n + 1) * sizeof(bool));
    for (int i = 0; i <= n; i++) {
        is_prime[i] = i >= 2;
    }
    for (int i = 2; i * i <= n; i++) {
        if (is_prime[i]) {
            for (int j = i * i; j <= n; j += i) {
                is_prime[j] = false;
            }
        }
    }
    int count = 0;
    for (int i = 2; i <= n; i++) {
        if (is_prime[i]) {
            primes[count++] = i;
        }
    }
    free(is_prime);
    return count;
}
