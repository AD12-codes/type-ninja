def anagram_check(a, b)
  return false if a.length != b.length
  counts = Hash.new(0)
  a.each_char { |ch| counts[ch] += 1 }
  b.each_char do |ch|
    return false if counts[ch].zero?
    counts[ch] -= 1
  end
  true
end
