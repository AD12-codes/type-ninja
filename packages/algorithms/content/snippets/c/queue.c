#include <stdbool.h>

#define QUEUE_CAPACITY 100

typedef struct {
    int items[QUEUE_CAPACITY];
    int head;
    int size;
} Queue;

void queue_init(Queue *q) {
    q->head = 0;
    q->size = 0;
}

bool queue_is_empty(const Queue *q) {
    return q->size == 0;
}

bool queue_enqueue(Queue *q, int value) {
    if (q->size == QUEUE_CAPACITY) {
        return false;
    }
    int tail = (q->head + q->size) % QUEUE_CAPACITY;
    q->items[tail] = value;
    q->size++;
    return true;
}

int queue_dequeue(Queue *q) {
    int value = q->items[q->head];
    q->head = (q->head + 1) % QUEUE_CAPACITY;
    q->size--;
    return value;
}

int queue_peek(const Queue *q) {
    return q->items[q->head];
}
