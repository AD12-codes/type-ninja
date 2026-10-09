#include <stack>
#include <string>
#include <unordered_map>

bool validParentheses(const std::string& s) {
    std::unordered_map<char, char> closers = {
        {'(', ')'}, {'[', ']'}, {'{', '}'}};
    std::stack<char> expected;
    for (char c : s) {
        auto found = closers.find(c);
        if (found != closers.end()) {
            expected.push(found->second);
        } else if (expected.empty() || expected.top() != c) {
            return false;
        } else {
            expected.pop();
        }
    }
    return expected.empty();
}
