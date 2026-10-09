func siftDown(arr []int, i, n int) {
    largest := i
    left, right := 2*i+1, 2*i+2
    if left < n && arr[left] > arr[largest] {
        largest = left
    }
    if right < n && arr[right] > arr[largest] {
        largest = right
    }
    if largest != i {
        arr[i], arr[largest] = arr[largest], arr[i]
        siftDown(arr, largest, n)
    }
}

func heapSort(arr []int) []int {
    n := len(arr)
    for i := n/2 - 1; i >= 0; i-- {
        siftDown(arr, i, n)
    }
    for end := n - 1; end > 0; end-- {
        arr[0], arr[end] = arr[end], arr[0]
        siftDown(arr, 0, end)
    }
    return arr
}
