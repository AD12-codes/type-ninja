local Queue = {}
Queue.__index = Queue

function Queue.new()
    local queue = { items = {}, head = 1, tail = 0 }
    return setmetatable(queue, Queue)
end

function Queue:enqueue(value)
    self.tail = self.tail + 1
    self.items[self.tail] = value
end

function Queue:dequeue()
    if self:is_empty() then
        return nil
    end
    local value = self.items[self.head]
    self.items[self.head] = nil
    self.head = self.head + 1
    return value
end

function Queue:peek()
    return self.items[self.head]
end

function Queue:is_empty()
    return self.head > self.tail
end
