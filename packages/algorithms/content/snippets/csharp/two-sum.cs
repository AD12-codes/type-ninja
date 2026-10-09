using System.Collections.Generic;

public static int[] TwoSum(int[] nums, int target)
{
    var seen = new Dictionary<int, int>();
    for (int i = 0; i < nums.Length; i++)
    {
        int complement = target - nums[i];
        if (seen.TryGetValue(complement, out int index))
        {
            return new int[] { index, i };
        }
        seen[nums[i]] = i;
    }
    return new int[0];
}
