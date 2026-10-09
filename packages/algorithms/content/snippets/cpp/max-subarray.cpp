#include <algorithm>
#include <vector>

int maxSubarray(const std::vector<int>& nums) {
    int best = nums[0];
    int current = nums[0];
    for (size_t i = 1; i < nums.size(); i++) {
        current = std::max(nums[i], current + nums[i]);
        best = std::max(best, current);
    }
    return best;
}
