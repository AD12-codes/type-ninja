local function partition(arr, low, high)
    local pivot = arr[high]
    local i = low - 1
    for j = low, high - 1 do
        if arr[j] < pivot then
            i = i + 1
            arr[i], arr[j] = arr[j], arr[i]
        end
    end
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1
end

local function quick_sort(arr, low, high)
    low = low or 1
    high = high or #arr
    if low < high then
        local p = partition(arr, low, high)
        quick_sort(arr, low, p - 1)
        quick_sort(arr, p + 1, high)
    end
    return arr
end
