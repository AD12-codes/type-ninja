fun twoSum(nums: IntArray, target: Int): IntArray {
    val seen = HashMap<Int, Int>()
    for ((index, num) in nums.withIndex()) {
        val complement = target - num
        val found = seen[complement]
        if (found != null) return intArrayOf(found, index)
        seen[num] = index
    }
    return intArrayOf()
}
