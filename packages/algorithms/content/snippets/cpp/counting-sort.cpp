#include <algorithm>
#include <vector>

std::vector<int> countingSort(const std::vector<int>& arr) {
    if (arr.empty()) {
        return {};
    }
    int maxValue = *std::max_element(arr.begin(), arr.end());
    std::vector<int> count(maxValue + 1, 0);
    for (int value : arr) {
        count[value]++;
    }
    for (int i = 1; i <= maxValue; i++) {
        count[i] += count[i - 1];
    }
    std::vector<int> output(arr.size());
    for (int i = arr.size() - 1; i >= 0; i--) {
        output[count[arr[i]] - 1] = arr[i];
        count[arr[i]]--;
    }
    return output;
}
