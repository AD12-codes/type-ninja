public static void heapSort(int[] arr) {
    int n = arr.length;
    for (int i = n / 2 - 1; i >= 0; i--) {
        siftDown(arr, i, n);
    }
    for (int end = n - 1; end > 0; end--) {
        swap(arr, 0, end);
        siftDown(arr, 0, end);
    }
}

private static void siftDown(int[] arr, int root, int size) {
    while (true) {
        int left = 2 * root + 1;
        int right = left + 1;
        int largest = root;
        if (left < size && arr[left] > arr[largest]) {
            largest = left;
        }
        if (right < size && arr[right] > arr[largest]) {
            largest = right;
        }
        if (largest == root) {
            return;
        }
        swap(arr, root, largest);
        root = largest;
    }
}

private static void swap(int[] arr, int i, int j) {
    int temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}
