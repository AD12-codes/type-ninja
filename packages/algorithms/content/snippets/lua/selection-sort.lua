local function selection_sort(arr)
    local n = #arr
    for i = 1, n - 1 do
        local min_index = i
        for j = i + 1, n do
            if arr[j] < arr[min_index] then
                min_index = j
            end
        end
        if min_index ~= i then
            arr[i], arr[min_index] = arr[min_index], arr[i]
        end
    end
    return arr
end
