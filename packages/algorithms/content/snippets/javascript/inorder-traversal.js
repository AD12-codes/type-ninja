class TreeNode {
  constructor(value, left = null, right = null) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

function inorderTraversal(root) {
  const result = [];
  const visit = (node) => {
    if (node === null) {
      return;
    }
    visit(node.left);
    result.push(node.value);
    visit(node.right);
  };
  visit(root);
  return result;
}
