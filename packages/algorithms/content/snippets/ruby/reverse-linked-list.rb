class ListNode
  attr_accessor :value, :next

  def initialize(value, next_node = nil)
    @value = value
    @next = next_node
  end
end

def reverse_linked_list(head)
  prev = nil
  current = head
  while current
    next_node = current.next
    current.next = prev
    prev = current
    current = next_node
  end
  prev
end
