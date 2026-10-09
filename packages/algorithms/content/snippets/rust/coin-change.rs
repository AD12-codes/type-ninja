pub fn coin_change(
    coins: &[usize],
    amount: usize,
) -> Option<usize> {
    let mut dp = vec![amount + 1; amount + 1];
    dp[0] = 0;
    for i in 1..=amount {
        for &coin in coins {
            if coin <= i {
                dp[i] = dp[i].min(dp[i - coin] + 1);
            }
        }
    }
    if dp[amount] > amount {
        None
    } else {
        Some(dp[amount])
    }
}
