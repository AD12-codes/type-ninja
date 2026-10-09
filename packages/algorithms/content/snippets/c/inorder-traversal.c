#include <stddef.h>

typedef struct TreeNode {
    int value;
    struct TreeNode *left;
    struct TreeNode *right;
} TreeNode;

static void visit(const TreeNode *node, int out[], int *count) {
    if (node == NULL) {
        return;
    }
    visit(node->left, out, count);
    out[(*count)++] = node->value;
    visit(node->right, out, count);
}

int inorder_traversal(const TreeNode *root, int out[]) {
    int count = 0;
    visit(root, out, &count);
    return count;
}
