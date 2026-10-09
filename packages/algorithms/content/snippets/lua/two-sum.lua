local function two_sum(arr, target)
    local seen = {}
    for i, value in ipairs(arr) do
        local complement = target - value
        if seen[complement] then
            return seen[complement], i
        end
        seen[value] = i
    end
    return nil
end
