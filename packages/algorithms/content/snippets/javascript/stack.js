class Stack {
  constructor() {
    this.items = [];
  }

  push(item) {
    this.items.push(item);
  }

  pop() {
    if (this.isEmpty()) {
      throw new Error("pop from empty stack");
    }
    return this.items.pop();
  }

  peek() {
    if (this.isEmpty()) {
      throw new Error("peek from empty stack");
    }
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }
}
