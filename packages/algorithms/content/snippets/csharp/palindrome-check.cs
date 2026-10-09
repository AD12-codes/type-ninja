public static bool PalindromeCheck(string s)
{
    int left = 0;
    int right = s.Length - 1;
    while (left < right)
    {
        if (s[left] != s[right])
        {
            return false;
        }
        left++;
        right--;
    }
    return true;
}
