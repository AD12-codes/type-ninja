local function merge(left, right)
    local result = {}
    local i, j = 1, 1
    while i <= #left and j <= #right do
        if left[i] <= right[j] then
            table.insert(result, left[i])
            i = i + 1
        else
            table.insert(result, right[j])
            j = j + 1
        end
    end
    for k = i, #left do
        table.insert(result, left[k])
    end
    for k = j, #right do
        table.insert(result, right[k])
    end
    return result
end

local function merge_sort(arr)
    local n = #arr
    if n <= 1 then
        return arr
    end
    local mid = n // 2
    local left = table.move(arr, 1, mid, 1, {})
    local right = table.move(arr, mid + 1, n, 1, {})
    return merge(merge_sort(left), merge_sort(right))
end
