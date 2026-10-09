function validParentheses(s) {
  const pairs = new Map([
    ["(", ")"],
    ["[", "]"],
    ["{", "}"],
  ]);
  const expected = [];
  for (const char of s) {
    if (pairs.has(char)) {
      expected.push(pairs.get(char));
      continue;
    }
    if (expected.pop() !== char) {
      return false;
    }
  }
  return expected.length === 0;
}
