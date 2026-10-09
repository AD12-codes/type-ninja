#include <stdbool.h>
#include <string.h>

bool palindrome_check(const char *s) {
    int left = 0;
    int right = (int) strlen(s) - 1;
    while (left < right) {
        if (s[left] != s[right]) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}
