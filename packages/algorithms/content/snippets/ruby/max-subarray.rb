def max_subarray(nums)
  best = nums[0]
  current = nums[0]
  nums[1..].each do |num|
    current = [num, current + num].max
    best = [best, current].max
  end
  best
end
