#include <stdlib.h>
#include <string.h>

void counting_sort(int arr[], int n) {
    if (n == 0) {
        return;
    }
    int max_value = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > max_value) {
            max_value = arr[i];
        }
    }
    int *count = calloc(max_value + 1, sizeof(int));
    int *output = malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) {
        count[arr[i]]++;
    }
    for (int v = 1; v <= max_value; v++) {
        count[v] += count[v - 1];
    }
    for (int i = n - 1; i >= 0; i--) {
        output[--count[arr[i]]] = arr[i];
    }
    memcpy(arr, output, n * sizeof(int));
    free(count);
    free(output);
}
