func countingSort(arr []int) []int {
    if len(arr) == 0 {
        return arr
    }
    maxValue := arr[0]
    for _, value := range arr {
        maxValue = max(maxValue, value)
    }
    counts := make([]int, maxValue+1)
    for _, value := range arr {
        counts[value]++
    }
    for i := 1; i <= maxValue; i++ {
        counts[i] += counts[i-1]
    }
    output := make([]int, len(arr))
    for i := len(arr) - 1; i >= 0; i-- {
        counts[arr[i]]--
        output[counts[arr[i]]] = arr[i]
    }
    return output
}
