#include <string>
#include <utility>

std::string reverseString(const std::string& s) {
    std::string result = s;
    int left = 0;
    int right = static_cast<int>(result.size()) - 1;
    while (left < right) {
        std::swap(result[left], result[right]);
        left++;
        right--;
    }
    return result;
}
