import java.util.ArrayList;
import java.util.List;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;

    TreeNode(int val) {
        this.val = val;
    }
}

public static List<Integer> inorderTraversal(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    visit(root, result);
    return result;
}

private static void visit(TreeNode node, List<Integer> result) {
    if (node == null) {
        return;
    }
    visit(node.left, result);
    result.add(node.val);
    visit(node.right, result);
}
