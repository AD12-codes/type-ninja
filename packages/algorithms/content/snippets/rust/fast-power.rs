pub fn fast_power(mut base: u64, mut exp: u64) -> u64 {
    let mut result = 1;
    while exp > 0 {
        if exp & 1 == 1 {
            result *= base;
        }
        base *= base;
        exp >>= 1;
    }
    result
}
