public static long fastPower(long base, int exp) {
    long result = 1;
    while (exp > 0) {
        if ((exp & 1) == 1) {
            result *= base;
        }
        base *= base;
        exp >>= 1;
    }
    return result;
}
