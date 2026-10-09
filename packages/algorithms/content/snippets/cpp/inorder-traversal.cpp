#include <vector>

struct TreeNode {
    int value;
    TreeNode* left = nullptr;
    TreeNode* right = nullptr;
    explicit TreeNode(int v) : value(v) {}
};

void inorder(TreeNode* node, std::vector<int>& result) {
    if (node == nullptr) {
        return;
    }
    inorder(node->left, result);
    result.push_back(node->value);
    inorder(node->right, result);
}

std::vector<int> inorderTraversal(TreeNode* root) {
    std::vector<int> result;
    inorder(root, result);
    return result;
}
