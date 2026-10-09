public static int[] MergeSort(int[] arr)
{
    if (arr.Length <= 1)
    {
        return arr;
    }
    int mid = arr.Length / 2;
    int[] left = MergeSort(arr[..mid]);
    int[] right = MergeSort(arr[mid..]);
    return Merge(left, right);
}

public static int[] Merge(int[] left, int[] right)
{
    int[] result = new int[left.Length + right.Length];
    int i = 0;
    int j = 0;
    int k = 0;
    while (i < left.Length && j < right.Length)
    {
        if (left[i] <= right[j])
        {
            result[k++] = left[i++];
        }
        else
        {
            result[k++] = right[j++];
        }
    }
    while (i < left.Length)
    {
        result[k++] = left[i++];
    }
    while (j < right.Length)
    {
        result[k++] = right[j++];
    }
    return result;
}
