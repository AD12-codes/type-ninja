class Stack
  def initialize
    @items = []
  end

  def push(item)
    @items.push(item)
    self
  end

  def pop
    @items.pop
  end

  def peek
    @items.last
  end

  def empty?
    @items.empty?
  end

  def size
    @items.length
  end
end
