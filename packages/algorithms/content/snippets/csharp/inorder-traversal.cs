using System.Collections.Generic;

public class TreeNode
{
    public int Value;
    public TreeNode Left;
    public TreeNode Right;

    public TreeNode(int value)
    {
        Value = value;
    }
}

public static List<int> InorderTraversal(TreeNode root)
{
    var result = new List<int>();
    Inorder(root, result);
    return result;
}

public static void Inorder(TreeNode node, List<int> result)
{
    if (node == null)
    {
        return;
    }
    Inorder(node.Left, result);
    result.Add(node.Value);
    Inorder(node.Right, result);
}
