public static string ReverseString(string s)
{
    char[] chars = s.ToCharArray();
    int left = 0;
    int right = chars.Length - 1;
    while (left < right)
    {
        char temp = chars[left];
        chars[left] = chars[right];
        chars[right] = temp;
        left++;
        right--;
    }
    return new string(chars);
}
