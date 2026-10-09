type TreeNode struct {
    Value int
    Left  *TreeNode
    Right *TreeNode
}

func inorderTraversal(root *TreeNode) []int {
    result := []int{}
    var visit func(node *TreeNode)
    visit = func(node *TreeNode) {
        if node == nil {
            return
        }
        visit(node.Left)
        result = append(result, node.Value)
        visit(node.Right)
    }
    visit(root)
    return result
}
