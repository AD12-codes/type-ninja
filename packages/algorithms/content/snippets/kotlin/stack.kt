class Stack<T> {
    private val items = ArrayDeque<T>()

    fun push(item: T) {
        items.addLast(item)
    }

    fun pop(): T? = items.removeLastOrNull()

    fun peek(): T? = items.lastOrNull()

    fun isEmpty(): Boolean = items.isEmpty()

    val size: Int
        get() = items.size
}
