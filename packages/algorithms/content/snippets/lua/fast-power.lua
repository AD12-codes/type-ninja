local function fast_power(base, exp)
    local result = 1
    while exp > 0 do
        if exp % 2 == 1 then
            result = result * base
        end
        base = base * base
        exp = exp // 2
    end
    return result
end
