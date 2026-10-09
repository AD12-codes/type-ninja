def reverse_string(str)
  chars = str.chars
  left = 0
  right = chars.length - 1
  while left < right
    chars[left], chars[right] = chars[right], chars[left]
    left += 1
    right -= 1
  end
  chars.join
end
