using System.Collections.Generic;

public static bool AnagramCheck(string a, string b)
{
    if (a.Length != b.Length)
    {
        return false;
    }
    var counts = new Dictionary<char, int>();
    foreach (char c in a)
    {
        counts[c] = counts.GetValueOrDefault(c) + 1;
    }
    foreach (char c in b)
    {
        if (counts.GetValueOrDefault(c) == 0)
        {
            return false;
        }
        counts[c]--;
    }
    return true;
}
