def valid_parentheses(s):
    pairs = {"(": ")", "[": "]", "{": "}"}
    expected = []
    for char in s:
        if char in pairs:
            expected.append(pairs[char])
        elif not expected or expected.pop() != char:
            return False
    return not expected
