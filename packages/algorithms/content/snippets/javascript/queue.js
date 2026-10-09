class Queue {
  constructor() {
    this.items = [];
    this.head = 0;
  }

  enqueue(item) {
    this.items.push(item);
  }

  dequeue() {
    if (this.isEmpty()) {
      throw new Error("dequeue from empty queue");
    }
    const item = this.items[this.head];
    this.items[this.head] = undefined;
    this.head++;
    return item;
  }

  peek() {
    if (this.isEmpty()) {
      throw new Error("peek from empty queue");
    }
    return this.items[this.head];
  }

  isEmpty() {
    return this.head === this.items.length;
  }
}
