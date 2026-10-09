#include <queue>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <vector>

using Graph =
    std::unordered_map<std::string, std::vector<std::string>>;

std::vector<std::string> breadthFirstSearch(const Graph& graph,
        const std::string& start) {
    std::vector<std::string> order;
    std::unordered_set<std::string> visited;
    std::queue<std::string> pending;
    visited.insert(start);
    pending.push(start);
    while (!pending.empty()) {
        std::string node = pending.front();
        pending.pop();
        order.push_back(node);
        auto found = graph.find(node);
        if (found == graph.end()) {
            continue;
        }
        for (const std::string& next : found->second) {
            if (!visited.count(next)) {
                visited.insert(next);
                pending.push(next);
            }
        }
    }
    return order;
}
