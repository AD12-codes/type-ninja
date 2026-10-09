#include <stdbool.h>

#define STACK_CAPACITY 100

typedef struct {
    int items[STACK_CAPACITY];
    int top;
} Stack;

void stack_init(Stack *s) {
    s->top = -1;
}

bool stack_is_empty(const Stack *s) {
    return s->top < 0;
}

bool stack_push(Stack *s, int value) {
    if (s->top >= STACK_CAPACITY - 1) {
        return false;
    }
    s->items[++s->top] = value;
    return true;
}

int stack_pop(Stack *s) {
    return s->items[s->top--];
}

int stack_peek(const Stack *s) {
    return s->items[s->top];
}
