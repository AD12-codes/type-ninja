def anagram_check(a, b):
    if len(a) != len(b):
        return False
    counts = {}
    for char in a:
        counts[char] = counts.get(char, 0) + 1
    for char in b:
        if counts.get(char, 0) == 0:
            return False
        counts[char] -= 1
    return True
