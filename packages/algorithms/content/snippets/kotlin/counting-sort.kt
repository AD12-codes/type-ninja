fun countingSort(arr: IntArray): IntArray {
    val max = arr.maxOrNull() ?: return arr
    val counts = IntArray(max + 1)
    for (value in arr) counts[value]++
    for (i in 1..max) counts[i] += counts[i - 1]
    val output = IntArray(arr.size)
    for (i in arr.size - 1 downTo 0) {
        val value = arr[i]
        counts[value]--
        output[counts[value]] = value
    }
    return output
}
