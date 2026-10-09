def knapsack(weights, values, capacity)
  dp = Array.new(capacity + 1, 0)
  weights.each_with_index do |weight, i|
    capacity.downto(weight) do |w|
      candidate = dp[w - weight] + values[i]
      dp[w] = candidate if candidate > dp[w]
    end
  end
  dp[capacity]
end
