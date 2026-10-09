def counting_sort(arr):
    if not arr:
        return arr
    counts = [0] * (max(arr) + 1)
    for value in arr:
        counts[value] += 1
    for i in range(1, len(counts)):
        counts[i] += counts[i - 1]
    output = [0] * len(arr)
    for value in reversed(arr):
        counts[value] -= 1
        output[counts[value]] = value
    return output
