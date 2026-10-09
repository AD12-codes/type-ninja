#include <deque>
#include <stdexcept>

template <typename T>
class Queue {
public:
    void enqueue(const T& value) {
        items.push_back(value);
    }

    T dequeue() {
        if (items.empty()) {
            throw std::out_of_range("dequeue from empty queue");
        }
        T value = items.front();
        items.pop_front();
        return value;
    }

    const T& peek() const {
        if (items.empty()) {
            throw std::out_of_range("peek from empty queue");
        }
        return items.front();
    }

    bool isEmpty() const {
        return items.empty();
    }

private:
    std::deque<T> items;
};
