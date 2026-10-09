import java.util.ArrayDeque;
import java.util.Deque;

class Queue<T> {
    private final Deque<T> items = new ArrayDeque<>();

    public void enqueue(T value) {
        items.addLast(value);
    }

    public T dequeue() {
        return items.removeFirst();
    }

    public T peek() {
        return items.getFirst();
    }

    public boolean isEmpty() {
        return items.isEmpty();
    }
}
