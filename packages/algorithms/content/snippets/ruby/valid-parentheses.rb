def valid_parentheses(str)
  pairs = { "(" => ")", "[" => "]", "{" => "}" }
  stack = []
  str.each_char do |ch|
    if pairs.key?(ch)
      stack.push(pairs[ch])
    elsif stack.pop != ch
      return false
    end
  end
  stack.empty?
end
