fun heapSort(arr: IntArray): IntArray {
    val n = arr.size
    for (i in n / 2 - 1 downTo 0) siftDown(arr, n, i)
    for (i in n - 1 downTo 1) {
        val temp = arr[0]
        arr[0] = arr[i]
        arr[i] = temp
        siftDown(arr, i, 0)
    }
    return arr
}

fun siftDown(arr: IntArray, size: Int, start: Int) {
    var root = start
    while (true) {
        var largest = root
        val left = 2 * root + 1
        val right = left + 1
        if (left < size && arr[left] > arr[largest]) {
            largest = left
        }
        if (right < size && arr[right] > arr[largest]) {
            largest = right
        }
        if (largest == root) return
        val temp = arr[root]
        arr[root] = arr[largest]
        arr[largest] = temp
        root = largest
    }
}
