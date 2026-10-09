function validParentheses(s: string): boolean {
  const pairs: Record<string, string> = {
    "(": ")",
    "[": "]",
    "{": "}",
  };
  const expected: string[] = [];
  for (const char of s) {
    if (char in pairs) {
      expected.push(pairs[char]);
    } else if (expected.pop() !== char) {
      return false;
    }
  }
  return expected.length === 0;
}
