#include <stdexcept>
#include <vector>

template <typename T>
class Stack {
public:
    void push(const T& value) {
        items.push_back(value);
    }

    T pop() {
        if (items.empty()) {
            throw std::out_of_range("pop from empty stack");
        }
        T value = items.back();
        items.pop_back();
        return value;
    }

    const T& peek() const {
        if (items.empty()) {
            throw std::out_of_range("peek from empty stack");
        }
        return items.back();
    }

    bool isEmpty() const {
        return items.empty();
    }

private:
    std::vector<T> items;
};
