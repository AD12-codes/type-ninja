import java.util.HashMap;
import java.util.Map;

public static boolean anagramCheck(String a, String b) {
    if (a.length() != b.length()) {
        return false;
    }
    Map<Character, Integer> counts = new HashMap<>();
    for (char c : a.toCharArray()) {
        counts.merge(c, 1, Integer::sum);
    }
    for (char c : b.toCharArray()) {
        counts.merge(c, -1, Integer::sum);
    }
    for (int count : counts.values()) {
        if (count != 0) {
            return false;
        }
    }
    return true;
}
