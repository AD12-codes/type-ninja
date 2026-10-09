using System;
using System.Collections.Generic;

public static List<int> SieveOfEratosthenes(int n)
{
    var primes = new List<int>();
    if (n < 2)
    {
        return primes;
    }
    bool[] isPrime = new bool[n + 1];
    Array.Fill(isPrime, true);
    isPrime[0] = false;
    isPrime[1] = false;
    for (int i = 2; i * i <= n; i++)
    {
        if (isPrime[i])
        {
            for (int j = i * i; j <= n; j += i)
            {
                isPrime[j] = false;
            }
        }
    }
    for (int i = 2; i <= n; i++)
    {
        if (isPrime[i])
        {
            primes.Add(i);
        }
    }
    return primes;
}
