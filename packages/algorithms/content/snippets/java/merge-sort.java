import java.util.Arrays;

public static int[] mergeSort(int[] arr) {
    int n = arr.length;
    if (n <= 1) {
        return arr;
    }
    int mid = n / 2;
    int[] left = mergeSort(Arrays.copyOfRange(arr, 0, mid));
    int[] right = mergeSort(Arrays.copyOfRange(arr, mid, n));
    return merge(left, right);
}

private static int[] merge(int[] left, int[] right) {
    int[] result = new int[left.length + right.length];
    int i = 0;
    int j = 0;
    int k = 0;
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result[k++] = left[i++];
        } else {
            result[k++] = right[j++];
        }
    }
    while (i < left.length) {
        result[k++] = left[i++];
    }
    while (j < right.length) {
        result[k++] = right[j++];
    }
    return result;
}
