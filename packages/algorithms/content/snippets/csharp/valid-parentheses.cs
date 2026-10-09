using System.Collections.Generic;

public static bool ValidParentheses(string s)
{
    var closers = new Dictionary<char, char>
    {
        { '(', ')' }, { '[', ']' }, { '{', '}' }
    };
    var expected = new Stack<char>();
    foreach (char c in s)
    {
        if (closers.TryGetValue(c, out char closer))
        {
            expected.Push(closer);
        }
        else if (expected.Count == 0 || expected.Pop() != c)
        {
            return false;
        }
    }
    return expected.Count == 0;
}
