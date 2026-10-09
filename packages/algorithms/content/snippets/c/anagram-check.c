#include <stdbool.h>
#include <string.h>

#define CHARSET_SIZE 256

bool anagram_check(const char *a, const char *b) {
    if (strlen(a) != strlen(b)) {
        return false;
    }
    int counts[CHARSET_SIZE] = {0};
    for (int i = 0; a[i] != '\0'; i++) {
        counts[(unsigned char) a[i]]++;
        counts[(unsigned char) b[i]]--;
    }
    for (int i = 0; i < CHARSET_SIZE; i++) {
        if (counts[i] != 0) {
            return false;
        }
    }
    return true;
}
