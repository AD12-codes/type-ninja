func maxSubarray(nums []int) int {
    if len(nums) == 0 {
        return 0
    }
    best, current := nums[0], nums[0]
    for _, num := range nums[1:] {
        current = max(num, current+num)
        best = max(best, current)
    }
    return best
}
