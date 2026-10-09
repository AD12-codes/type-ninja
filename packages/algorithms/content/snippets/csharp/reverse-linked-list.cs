public class ListNode
{
    public int Value;
    public ListNode Next;

    public ListNode(int value)
    {
        Value = value;
    }
}

public static ListNode ReverseLinkedList(ListNode head)
{
    ListNode prev = null;
    ListNode current = head;
    while (current != null)
    {
        ListNode next = current.Next;
        current.Next = prev;
        prev = current;
        current = next;
    }
    return prev;
}
