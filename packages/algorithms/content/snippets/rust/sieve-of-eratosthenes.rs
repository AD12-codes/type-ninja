pub fn sieve_of_eratosthenes(n: usize) -> Vec<usize> {
    if n < 2 {
        return Vec::new();
    }
    let mut is_prime = vec![true; n + 1];
    is_prime[0] = false;
    is_prime[1] = false;
    let mut i = 2;
    while i * i <= n {
        if is_prime[i] {
            for multiple in (i * i..=n).step_by(i) {
                is_prime[multiple] = false;
            }
        }
        i += 1;
    }
    (2..=n).filter(|&i| is_prime[i]).collect()
}
