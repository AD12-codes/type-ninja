#include <stdlib.h>

int topological_sort(int n, int adj[n][n], int order[]) {
    int *in_degree = calloc(n, sizeof(int));
    int *queue = malloc(n * sizeof(int));
    int head = 0;
    int tail = 0;
    int count = 0;
    for (int u = 0; u < n; u++) {
        for (int v = 0; v < n; v++) {
            if (adj[u][v]) {
                in_degree[v]++;
            }
        }
    }
    for (int v = 0; v < n; v++) {
        if (in_degree[v] == 0) {
            queue[tail++] = v;
        }
    }
    while (head < tail) {
        int u = queue[head++];
        order[count++] = u;
        for (int v = 0; v < n; v++) {
            if (adj[u][v] && --in_degree[v] == 0) {
                queue[tail++] = v;
            }
        }
    }
    free(in_degree);
    free(queue);
    return count == n ? count : -1;
}
