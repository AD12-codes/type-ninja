local function max_subarray(arr)
    local best = arr[1]
    local current = arr[1]
    for i = 2, #arr do
        current = math.max(arr[i], current + arr[i])
        best = math.max(best, current)
    end
    return best
end
