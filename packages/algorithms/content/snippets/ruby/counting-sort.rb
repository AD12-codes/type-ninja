def counting_sort(arr)
  return arr if arr.empty?
  counts = Array.new(arr.max + 1, 0)
  arr.each { |value| counts[value] += 1 }
  (1...counts.length).each { |i| counts[i] += counts[i - 1] }
  output = Array.new(arr.length)
  arr.reverse_each do |value|
    counts[value] -= 1
    output[counts[value]] = value
  end
  output
end
