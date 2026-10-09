#include <stdbool.h>
#include <stdlib.h>

int breadth_first_search(int n, int adj[n][n], int start,
        int order[]) {
    bool *visited = calloc(n, sizeof(bool));
    int *queue = malloc(n * sizeof(int));
    int head = 0;
    int tail = 0;
    int count = 0;
    visited[start] = true;
    queue[tail++] = start;
    while (head < tail) {
        int u = queue[head++];
        order[count++] = u;
        for (int v = 0; v < n; v++) {
            if (adj[u][v] && !visited[v]) {
                visited[v] = true;
                queue[tail++] = v;
            }
        }
    }
    free(visited);
    free(queue);
    return count;
}
