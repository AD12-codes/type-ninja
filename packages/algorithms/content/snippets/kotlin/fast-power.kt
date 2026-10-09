fun fastPower(base: Long, exp: Int): Long {
    var result = 1L
    var b = base
    var e = exp
    while (e > 0) {
        if (e % 2 == 1) result *= b
        b *= b
        e /= 2
    }
    return result
}
