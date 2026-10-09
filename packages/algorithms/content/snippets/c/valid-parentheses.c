#include <stdbool.h>
#include <stdlib.h>
#include <string.h>

static char closer_for(char c) {
    if (c == '(') {
        return ')';
    }
    if (c == '[') {
        return ']';
    }
    if (c == '{') {
        return '}';
    }
    return '\0';
}

bool valid_parentheses(const char *s) {
    size_t n = strlen(s);
    char *stack = malloc(n + 1);
    int top = 0;
    bool valid = true;
    for (size_t i = 0; i < n && valid; i++) {
        char expected = closer_for(s[i]);
        if (expected != '\0') {
            stack[top++] = expected;
        } else if (top > 0 && stack[top - 1] == s[i]) {
            top--;
        } else {
            valid = false;
        }
    }
    free(stack);
    return valid && top == 0;
}
