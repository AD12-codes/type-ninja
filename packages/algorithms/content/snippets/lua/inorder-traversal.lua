local function inorder_traversal(root, result)
    result = result or {}
    if root then
        inorder_traversal(root.left, result)
        table.insert(result, root.value)
        inorder_traversal(root.right, result)
    end
    return result
end
