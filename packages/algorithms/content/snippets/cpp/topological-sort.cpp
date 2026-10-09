#include <queue>
#include <string>
#include <unordered_map>
#include <vector>

using Graph =
    std::unordered_map<std::string, std::vector<std::string>>;

std::vector<std::string> topologicalSort(const Graph& graph) {
    std::unordered_map<std::string, int> degree;
    for (const auto& [node, edges] : graph) {
        degree.try_emplace(node, 0);
        for (const std::string& next : edges) {
            degree[next]++;
        }
    }
    std::queue<std::string> ready;
    for (const auto& [node, count] : degree) {
        if (count == 0) {
            ready.push(node);
        }
    }
    std::vector<std::string> order;
    while (!ready.empty()) {
        std::string node = ready.front();
        ready.pop();
        order.push_back(node);
        auto found = graph.find(node);
        if (found == graph.end()) {
            continue;
        }
        for (const std::string& next : found->second) {
            if (--degree[next] == 0) {
                ready.push(next);
            }
        }
    }
    return order;
}
