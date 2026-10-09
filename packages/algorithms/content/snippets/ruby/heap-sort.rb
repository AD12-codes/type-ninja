def heap_sort(arr)
  n = arr.length
  (n / 2 - 1).downto(0) { |i| sift_down(arr, n, i) }
  (n - 1).downto(1) do |i|
    arr[0], arr[i] = arr[i], arr[0]
    sift_down(arr, i, 0)
  end
  arr
end

def sift_down(arr, size, root)
  loop do
    largest = root
    left = 2 * root + 1
    right = left + 1
    largest = left if left < size && arr[left] > arr[largest]
    largest = right if right < size && arr[right] > arr[largest]
    break if largest == root
    arr[root], arr[largest] = arr[largest], arr[root]
    root = largest
  end
end
