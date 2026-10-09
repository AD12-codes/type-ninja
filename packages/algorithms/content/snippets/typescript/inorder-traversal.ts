class TreeNode {
  value: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;

  constructor(value: number) {
    this.value = value;
  }
}

function inorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  const visit = (node: TreeNode | null): void => {
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
