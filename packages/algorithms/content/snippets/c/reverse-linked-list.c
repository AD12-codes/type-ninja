#include <stddef.h>

typedef struct ListNode {
    int value;
    struct ListNode *next;
} ListNode;

ListNode *reverse_linked_list(ListNode *head) {
    ListNode *prev = NULL;
    ListNode *current = head;
    while (current != NULL) {
        ListNode *next = current->next;
        current->next = prev;
        prev = current;
        current = next;
    }
    return prev;
}
