pub struct Node<T> {
    value: T,
    next: Option<Box<Node<T>>>,
}

pub struct Stack<T> {
    head: Option<Box<Node<T>>>,
}

impl<T> Stack<T> {
    pub fn new() -> Self {
        Stack { head: None }
    }

    pub fn push(&mut self, value: T) {
        let next = self.head.take();
        self.head = Some(Box::new(Node { value, next }));
    }

    pub fn pop(&mut self) -> Option<T> {
        self.head.take().map(|node| {
            self.head = node.next;
            node.value
        })
    }

    pub fn peek(&self) -> Option<&T> {
        self.head.as_ref().map(|node| &node.value)
    }

    pub fn is_empty(&self) -> bool {
        self.head.is_none()
    }
}
