func partition(arr []int, low, high int) int {
    pivot := arr[high]
    i := low - 1
    for j := low; j < high; j++ {
        if arr[j] <= pivot {
            i++
            arr[i], arr[j] = arr[j], arr[i]
        }
    }
    arr[i+1], arr[high] = arr[high], arr[i+1]
    return i + 1
}

func sortRange(arr []int, low, high int) {
    if low < high {
        p := partition(arr, low, high)
        sortRange(arr, low, p-1)
        sortRange(arr, p+1, high)
    }
}

func quickSort(arr []int) []int {
    sortRange(arr, 0, len(arr)-1)
    return arr
}
