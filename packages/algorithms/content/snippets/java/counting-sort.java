public static int[] countingSort(int[] arr) {
    if (arr.length == 0) {
        return new int[0];
    }
    int max = arr[0];
    for (int value : arr) {
        max = Math.max(max, value);
    }
    int[] counts = new int[max + 1];
    for (int value : arr) {
        counts[value]++;
    }
    for (int i = 1; i < counts.length; i++) {
        counts[i] += counts[i - 1];
    }
    int[] result = new int[arr.length];
    for (int i = arr.length - 1; i >= 0; i--) {
        counts[arr[i]]--;
        result[counts[arr[i]]] = arr[i];
    }
    return result;
}
