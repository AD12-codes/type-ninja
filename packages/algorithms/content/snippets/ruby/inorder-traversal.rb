class TreeNode
  attr_accessor :value, :left, :right

  def initialize(value, left = nil, right = nil)
    @value = value
    @left = left
    @right = right
  end
end

def inorder_traversal(root, result = [])
  return result if root.nil?
  inorder_traversal(root.left, result)
  result << root.value
  inorder_traversal(root.right, result)
  result
end
