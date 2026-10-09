#include <string.h>

void reverse_string(char *s) {
    int left = 0;
    int right = (int) strlen(s) - 1;
    while (left < right) {
        char tmp = s[left];
        s[left] = s[right];
        s[right] = tmp;
        left++;
        right--;
    }
}
