pub fn knapsack(
    weights: &[usize],
    values: &[u32],
    capacity: usize,
) -> u32 {
    let mut dp = vec![0; capacity + 1];
    for (&weight, &value) in weights.iter().zip(values) {
        for w in (weight..=capacity).rev() {
            dp[w] = dp[w].max(dp[w - weight] + value);
        }
    }
    dp[capacity]
}
