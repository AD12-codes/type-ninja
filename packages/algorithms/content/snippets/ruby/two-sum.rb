def two_sum(nums, target)
  seen = {}
  nums.each_with_index do |num, index|
    complement = target - num
    return [seen[complement], index] if seen.key?(complement)
    seen[num] = index
  end
  []
end
