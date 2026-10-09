local function heapify(arr, n, i)
    local largest = i
    local left = 2 * i
    local right = 2 * i + 1
    if left <= n and arr[left] > arr[largest] then
        largest = left
    end
    if right <= n and arr[right] > arr[largest] then
        largest = right
    end
    if largest ~= i then
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)
    end
end

local function heap_sort(arr)
    local n = #arr
    for i = n // 2, 1, -1 do
        heapify(arr, n, i)
    end
    for i = n, 2, -1 do
        arr[1], arr[i] = arr[i], arr[1]
        heapify(arr, i - 1, 1)
    end
    return arr
end
