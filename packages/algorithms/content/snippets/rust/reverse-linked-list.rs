pub struct ListNode {
    pub val: i32,
    pub next: Option<Box<ListNode>>,
}

pub fn reverse_linked_list(
    head: Option<Box<ListNode>>,
) -> Option<Box<ListNode>> {
    let mut prev = None;
    let mut current = head;
    while let Some(mut node) = current {
        current = node.next.take();
        node.next = prev;
        prev = Some(node);
    }
    prev
}
