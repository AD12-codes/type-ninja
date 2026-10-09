local PAIRS = { ["("] = ")", ["["] = "]", ["{"] = "}" }

local function valid_parentheses(s)
    local stack = {}
    for i = 1, #s do
        local c = s:sub(i, i)
        if PAIRS[c] then
            table.insert(stack, PAIRS[c])
        elseif stack[#stack] == c then
            table.remove(stack)
        else
            return false
        end
    end
    return #stack == 0
end
