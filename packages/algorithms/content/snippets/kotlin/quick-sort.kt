fun quickSort(
    arr: IntArray,
    low: Int = 0,
    high: Int = arr.size - 1
): IntArray {
    if (low >= high) return arr
    val pivotIndex = partition(arr, low, high)
    quickSort(arr, low, pivotIndex - 1)
    quickSort(arr, pivotIndex + 1, high)
    return arr
}

fun partition(arr: IntArray, low: Int, high: Int): Int {
    val pivot = arr[high]
    var i = low - 1
    for (j in low until high) {
        if (arr[j] <= pivot) {
            i++
            val temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp
        }
    }
    val last = arr[i + 1]
    arr[i + 1] = arr[high]
    arr[high] = last
    return i + 1
}
