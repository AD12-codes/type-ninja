def coin_change(coins, amount)
  dp = Array.new(amount + 1, amount + 1)
  dp[0] = 0
  (1..amount).each do |total|
    coins.each do |coin|
      next if coin > total
      candidate = dp[total - coin] + 1
      dp[total] = candidate if candidate < dp[total]
    end
  end
  dp[amount] > amount ? -1 : dp[amount]
end
