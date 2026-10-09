function maxSubarray(nums: number[]): number {
  if (nums.length === 0) {
    return 0;
  }
  let best = nums[0];
  let current = nums[0];
  for (let i = 1; i < nums.length; i++) {
    current = Math.max(nums[i], current + nums[i]);
    best = Math.max(best, current);
  }
  return best;
}
