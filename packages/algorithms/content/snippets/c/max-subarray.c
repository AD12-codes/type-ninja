int max_subarray(int arr[], int n) {
    int best = arr[0];
    int current = arr[0];
    for (int i = 1; i < n; i++) {
        if (current + arr[i] > arr[i]) {
            current = current + arr[i];
        } else {
            current = arr[i];
        }
        if (current > best) {
            best = current;
        }
    }
    return best;
}
