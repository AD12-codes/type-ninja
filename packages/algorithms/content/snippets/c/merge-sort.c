#include <stdlib.h>

static void merge(int arr[], int left, int mid, int right) {
    int n = right - left + 1;
    int *tmp = malloc(n * sizeof(int));
    int i = left;
    int j = mid + 1;
    int k = 0;
    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) {
            tmp[k++] = arr[i++];
        } else {
            tmp[k++] = arr[j++];
        }
    }
    while (i <= mid) {
        tmp[k++] = arr[i++];
    }
    while (j <= right) {
        tmp[k++] = arr[j++];
    }
    for (k = 0; k < n; k++) {
        arr[left + k] = tmp[k];
    }
    free(tmp);
}

void merge_sort(int arr[], int left, int right) {
    if (left >= right) {
        return;
    }
    int mid = left + (right - left) / 2;
    merge_sort(arr, left, mid);
    merge_sort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}
