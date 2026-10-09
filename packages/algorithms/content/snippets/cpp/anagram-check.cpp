#include <string>
#include <unordered_map>

bool anagramCheck(const std::string& a, const std::string& b) {
    if (a.size() != b.size()) {
        return false;
    }
    std::unordered_map<char, int> counts;
    for (char c : a) {
        counts[c]++;
    }
    for (char c : b) {
        if (--counts[c] < 0) {
            return false;
        }
    }
    return true;
}
