#include <string>
#include <unordered_map>
#include <unordered_set>
#include <vector>

using Graph =
    std::unordered_map<std::string, std::vector<std::string>>;

void dfs(const Graph& graph, const std::string& node,
        std::unordered_set<std::string>& visited,
        std::vector<std::string>& order) {
    visited.insert(node);
    order.push_back(node);
    auto found = graph.find(node);
    if (found == graph.end()) {
        return;
    }
    for (const std::string& next : found->second) {
        if (!visited.count(next)) {
            dfs(graph, next, visited, order);
        }
    }
}

std::vector<std::string> depthFirstSearch(const Graph& graph,
        const std::string& start) {
    std::unordered_set<std::string> visited;
    std::vector<std::string> order;
    dfs(graph, start, visited, order);
    return order;
}
