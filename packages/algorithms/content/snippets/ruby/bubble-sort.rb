def bubble_sort(arr)
  n = arr.length
  (n - 1).times do |i|
    swapped = false
    (n - 1 - i).times do |j|
      if arr[j] > arr[j + 1]
        arr[j], arr[j + 1] = arr[j + 1], arr[j]
        swapped = true
      end
    end
    break unless swapped
  end
  arr
end
