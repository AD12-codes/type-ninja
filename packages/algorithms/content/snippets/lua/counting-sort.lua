local function counting_sort(arr)
    local n = #arr
    if n == 0 then
        return arr
    end
    local max_value = arr[1]
    for i = 2, n do
        if arr[i] > max_value then
            max_value = arr[i]
        end
    end
    local count = {}
    for v = 0, max_value do
        count[v] = 0
    end
    for i = 1, n do
        count[arr[i]] = count[arr[i]] + 1
    end
    for v = 1, max_value do
        count[v] = count[v] + count[v - 1]
    end
    local output = {}
    for i = n, 1, -1 do
        output[count[arr[i]]] = arr[i]
        count[arr[i]] = count[arr[i]] - 1
    end
    return output
end
