public static long FastPower(long baseValue, int exp)
{
    long result = 1;
    while (exp > 0)
    {
        if (exp % 2 == 1)
        {
            result *= baseValue;
        }
        baseValue *= baseValue;
        exp /= 2;
    }
    return result;
}
