import kotlin.math.abs

fun gcd(a: Int, b: Int): Int {
    var x = a
    var y = b
    while (y != 0) {
        val remainder = x % y
        x = y
        y = remainder
    }
    return abs(x)
}
