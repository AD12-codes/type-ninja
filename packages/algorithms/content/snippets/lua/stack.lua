local Stack = {}
Stack.__index = Stack

function Stack.new()
    return setmetatable({ items = {} }, Stack)
end

function Stack:push(value)
    table.insert(self.items, value)
end

function Stack:pop()
    return table.remove(self.items)
end

function Stack:peek()
    return self.items[#self.items]
end

function Stack:is_empty()
    return #self.items == 0
end
