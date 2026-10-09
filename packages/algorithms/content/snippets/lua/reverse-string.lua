local function reverse_string(s)
    local chars = {}
    for i = 1, #s do
        chars[i] = s:sub(i, i)
    end
    local left, right = 1, #chars
    while left < right do
        chars[left], chars[right] = chars[right], chars[left]
        left = left + 1
        right = right - 1
    end
    return table.concat(chars)
end
