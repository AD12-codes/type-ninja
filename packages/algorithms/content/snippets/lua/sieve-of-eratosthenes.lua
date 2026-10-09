local function sieve_of_eratosthenes(n)
    local is_prime = {}
    for i = 2, n do
        is_prime[i] = true
    end
    local i = 2
    while i * i <= n do
        if is_prime[i] then
            for j = i * i, n, i do
                is_prime[j] = false
            end
        end
        i = i + 1
    end
    local primes = {}
    for k = 2, n do
        if is_prime[k] then
            table.insert(primes, k)
        end
    end
    return primes
end
