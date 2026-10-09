local function linear_search(arr, target)
    for i = 1, #arr do
        if arr[i] == target then
            return i
        end
    end
    return -1
end
