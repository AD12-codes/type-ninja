public static void QuickSort(int[] arr)
{
    QuickSort(arr, 0, arr.Length - 1);
}

public static void QuickSort(int[] arr, int low, int high)
{
    if (low < high)
    {
        int p = Partition(arr, low, high);
        QuickSort(arr, low, p - 1);
        QuickSort(arr, p + 1, high);
    }
}

public static int Partition(int[] arr, int low, int high)
{
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++)
    {
        if (arr[j] <= pivot)
        {
            i++;
            (arr[i], arr[j]) = (arr[j], arr[i]);
        }
    }
    (arr[i + 1], arr[high]) = (arr[high], arr[i + 1]);
    return i + 1;
}
