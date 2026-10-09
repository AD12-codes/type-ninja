#include <stdbool.h>

bool two_sum(int arr[], int n, int target, int out[2]) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = i + 1; j < n; j++) {
            if (arr[i] + arr[j] == target) {
                out[0] = i;
                out[1] = j;
                return true;
            }
        }
    }
    return false;
}
