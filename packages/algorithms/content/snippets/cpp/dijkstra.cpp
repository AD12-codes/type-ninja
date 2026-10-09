#include <functional>
#include <queue>
#include <string>
#include <unordered_map>
#include <utility>
#include <vector>

using Edge = std::pair<std::string, int>;
using WeightedGraph =
    std::unordered_map<std::string, std::vector<Edge>>;
using Item = std::pair<int, std::string>;

std::unordered_map<std::string, int> dijkstra(
        const WeightedGraph& graph, const std::string& start) {
    std::unordered_map<std::string, int> dist;
    dist[start] = 0;
    std::priority_queue<Item, std::vector<Item>,
            std::greater<Item>> pq;
    pq.push({0, start});
    while (!pq.empty()) {
        auto [d, node] = pq.top();
        pq.pop();
        if (d > dist[node]) {
            continue;
        }
        auto found = graph.find(node);
        if (found == graph.end()) {
            continue;
        }
        for (const auto& [next, weight] : found->second) {
            int candidate = d + weight;
            if (!dist.count(next) || candidate < dist[next]) {
                dist[next] = candidate;
                pq.push({candidate, next});
            }
        }
    }
    return dist;
}
