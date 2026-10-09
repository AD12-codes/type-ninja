def binary_search(arr, target)
  low = 0
  high = arr.length - 1
  while low <= high
    mid = (low + high) / 2
    if arr[mid] == target
      return mid
    elsif arr[mid] < target
      low = mid + 1
    else
      high = mid - 1
    end
  end
  -1
end
