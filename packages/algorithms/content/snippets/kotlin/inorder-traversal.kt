class TreeNode(
    var value: Int,
    var left: TreeNode? = null,
    var right: TreeNode? = null
)

fun inorderTraversal(
    root: TreeNode?,
    result: MutableList<Int> = mutableListOf()
): List<Int> {
    if (root == null) return result
    inorderTraversal(root.left, result)
    result.add(root.value)
    inorderTraversal(root.right, result)
    return result
}
