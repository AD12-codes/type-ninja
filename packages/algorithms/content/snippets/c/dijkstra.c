#include <limits.h>
#include <stdbool.h>
#include <stdlib.h>

void dijkstra(int n, int graph[n][n], int src, int dist[]) {
    bool *done = calloc(n, sizeof(bool));
    for (int i = 0; i < n; i++) {
        dist[i] = INT_MAX;
    }
    dist[src] = 0;
    for (int iter = 0; iter < n; iter++) {
        int u = -1;
        for (int v = 0; v < n; v++) {
            if (!done[v] && (u == -1 || dist[v] < dist[u])) {
                u = v;
            }
        }
        if (dist[u] == INT_MAX) {
            break;
        }
        done[u] = true;
        for (int v = 0; v < n; v++) {
            int w = graph[u][v];
            if (w > 0 && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }
    free(done);
}
