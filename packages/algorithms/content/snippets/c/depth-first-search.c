#include <stdbool.h>
#include <stdlib.h>

static void dfs_visit(int n, int adj[n][n], int u,
        bool visited[], int order[], int *count) {
    visited[u] = true;
    order[(*count)++] = u;
    for (int v = 0; v < n; v++) {
        if (adj[u][v] && !visited[v]) {
            dfs_visit(n, adj, v, visited, order, count);
        }
    }
}

int depth_first_search(int n, int adj[n][n], int start,
        int order[]) {
    bool *visited = calloc(n, sizeof(bool));
    int count = 0;
    dfs_visit(n, adj, start, visited, order, &count);
    free(visited);
    return count;
}
