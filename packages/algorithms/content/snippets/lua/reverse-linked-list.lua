local function reverse_linked_list(head)
    local prev = nil
    local current = head
    while current do
        local next_node = current.next
        current.next = prev
        prev = current
        current = next_node
    end
    return prev
end
