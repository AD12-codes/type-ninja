def heap_sort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        sift_down(arr, i, n)
    for end in range(n - 1, 0, -1):
        arr[0], arr[end] = arr[end], arr[0]
        sift_down(arr, 0, end)
    return arr

def sift_down(arr, root, size):
    while True:
        largest = root
        left = 2 * root + 1
        right = left + 1
        if left < size and arr[left] > arr[largest]:
            largest = left
        if right < size and arr[right] > arr[largest]:
            largest = right
        if largest == root:
            return
        arr[root], arr[largest] = arr[largest], arr[root]
        root = largest
