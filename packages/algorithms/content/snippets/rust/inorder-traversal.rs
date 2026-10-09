pub struct TreeNode {
    pub val: i32,
    pub left: Option<Box<TreeNode>>,
    pub right: Option<Box<TreeNode>>,
}

pub fn inorder_traversal(root: Option<&TreeNode>) -> Vec<i32> {
    let mut result = Vec::new();
    visit(root, &mut result);
    result
}

fn visit(node: Option<&TreeNode>, result: &mut Vec<i32>) {
    if let Some(node) = node {
        visit(node.left.as_deref(), result);
        result.push(node.val);
        visit(node.right.as_deref(), result);
    }
}
