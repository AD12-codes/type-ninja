struct ListNode {
    int value;
    ListNode* next = nullptr;
    explicit ListNode(int v) : value(v) {}
};

ListNode* reverseLinkedList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* current = head;
    while (current != nullptr) {
        ListNode* next = current->next;
        current->next = prev;
        prev = current;
        current = next;
    }
    return prev;
}
