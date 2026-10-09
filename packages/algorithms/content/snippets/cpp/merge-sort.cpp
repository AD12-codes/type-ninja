#include <vector>

std::vector<int> merge(const std::vector<int>& left,
        const std::vector<int>& right) {
    std::vector<int> result;
    size_t i = 0;
    size_t j = 0;
    while (i < left.size() && j < right.size()) {
        if (left[i] <= right[j]) {
            result.push_back(left[i++]);
        } else {
            result.push_back(right[j++]);
        }
    }
    while (i < left.size()) {
        result.push_back(left[i++]);
    }
    while (j < right.size()) {
        result.push_back(right[j++]);
    }
    return result;
}

std::vector<int> mergeSort(const std::vector<int>& arr) {
    if (arr.size() <= 1) {
        return arr;
    }
    size_t mid = arr.size() / 2;
    std::vector<int> left(arr.begin(), arr.begin() + mid);
    std::vector<int> right(arr.begin() + mid, arr.end());
    return merge(mergeSort(left), mergeSort(right));
}
