class ListNode {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

function reverseLinkedList(head) {
  let prev = null;
  let current = head;
  while (current !== null) {
    const nextNode = current.next;
    current.next = prev;
    prev = current;
    current = nextNode;
  }
  return prev;
}
