import java.util.ArrayDeque;
import java.util.Deque;

public static boolean validParentheses(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (c == '(') {
            stack.push(')');
        } else if (c == '[') {
            stack.push(']');
        } else if (c == '{') {
            stack.push('}');
        } else if (stack.isEmpty() || stack.pop() != c) {
            return false;
        }
    }
    return stack.isEmpty();
}
