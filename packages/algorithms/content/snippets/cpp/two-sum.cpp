#include <unordered_map>
#include <vector>

std::vector<int> twoSum(const std::vector<int>& nums,
        int target) {
    std::unordered_map<int, int> seen;
    int n = nums.size();
    for (int i = 0; i < n; i++) {
        int complement = target - nums[i];
        auto found = seen.find(complement);
        if (found != seen.end()) {
            return {found->second, i};
        }
        seen[nums[i]] = i;
    }
    return {};
}
