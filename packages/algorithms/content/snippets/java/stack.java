import java.util.NoSuchElementException;

class Stack<T> {
    private class Node {
        T value;
        Node next;

        Node(T value, Node next) {
            this.value = value;
            this.next = next;
        }
    }

    private Node head;

    public void push(T value) {
        head = new Node(value, head);
    }

    public T pop() {
        if (head == null) {
            throw new NoSuchElementException("Stack is empty");
        }
        T value = head.value;
        head = head.next;
        return value;
    }

    public T peek() {
        if (head == null) {
            throw new NoSuchElementException("Stack is empty");
        }
        return head.value;
    }

    public boolean isEmpty() {
        return head == null;
    }
}
