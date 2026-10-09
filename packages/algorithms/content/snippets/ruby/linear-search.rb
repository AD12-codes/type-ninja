def linear_search(arr, target)
  arr.each_with_index do |value, index|
    return index if value == target
  end
  -1
end
