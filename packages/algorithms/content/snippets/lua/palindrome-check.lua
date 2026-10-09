local function palindrome_check(s)
    local left, right = 1, #s
    while left < right do
        if s:sub(left, left) ~= s:sub(right, right) then
            return false
        end
        left = left + 1
        right = right - 1
    end
    return true
end
