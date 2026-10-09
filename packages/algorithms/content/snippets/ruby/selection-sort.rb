def selection_sort(arr)
  n = arr.length
  (n - 1).times do |i|
    min_index = i
    ((i + 1)...n).each do |j|
      min_index = j if arr[j] < arr[min_index]
    end
    if min_index != i
      arr[i], arr[min_index] = arr[min_index], arr[i]
    end
  end
  arr
end
