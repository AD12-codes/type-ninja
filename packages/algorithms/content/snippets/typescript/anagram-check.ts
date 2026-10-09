function anagramCheck(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  const counts = new Map<string, number>();
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
