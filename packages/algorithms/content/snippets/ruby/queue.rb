class Queue
  def initialize
    @items = []
  end

  def enqueue(item)
    @items.push(item)
    self
  end

  def dequeue
    @items.shift
  end

  def peek
    @items.first
  end

  def empty?
    @items.empty?
  end

  def size
    @items.length
  end
end
