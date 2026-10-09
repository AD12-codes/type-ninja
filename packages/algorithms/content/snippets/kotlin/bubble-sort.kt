fun bubbleSort(arr: IntArray): IntArray {
    val n = arr.size
    for (i in 0 until n - 1) {
        var swapped = false
        for (j in 0 until n - 1 - i) {
            if (arr[j] > arr[j + 1]) {
                val temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = temp
                swapped = true
            }
        }
        if (!swapped) break
    }
    return arr
}
