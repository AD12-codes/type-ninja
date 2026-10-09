local function anagram_check(a, b)
    if #a ~= #b then
        return false
    end
    local counts = {}
    for i = 1, #a do
        local ca = a:sub(i, i)
        local cb = b:sub(i, i)
        counts[ca] = (counts[ca] or 0) + 1
        counts[cb] = (counts[cb] or 0) - 1
    end
    for _, count in pairs(counts) do
        if count ~= 0 then
            return false
        end
    end
    return true
end
