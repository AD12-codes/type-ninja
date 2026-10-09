function anagramCheck(a, b) {
  if (a.length !== b.length) {
    return false;
  }
  const counts = new Map();
  for (const char of a) {
    counts.set(char, (counts.get(char) ?? 0) + 1);
  }
  for (const char of b) {
    const count = counts.get(char) ?? 0;
    if (count === 0) {
      return false;
    }
    counts.set(char, count - 1);
  }
  return true;
}
