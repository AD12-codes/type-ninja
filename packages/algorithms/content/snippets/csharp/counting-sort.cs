using System.Linq;

public static int[] CountingSort(int[] arr)
{
    if (arr.Length == 0)
    {
        return arr;
    }
    int maxValue = arr.Max();
    int[] count = new int[maxValue + 1];
    foreach (int value in arr)
    {
        count[value]++;
    }
    for (int i = 1; i <= maxValue; i++)
    {
        count[i] += count[i - 1];
    }
    int[] output = new int[arr.Length];
    for (int i = arr.Length - 1; i >= 0; i--)
    {
        output[count[arr[i]] - 1] = arr[i];
        count[arr[i]]--;
    }
    return output;
}
