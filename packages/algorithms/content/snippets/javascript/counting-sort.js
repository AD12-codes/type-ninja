function countingSort(arr) {
  if (arr.length === 0) {
    return arr;
  }
  const counts = new Array(Math.max(...arr) + 1).fill(0);
  for (const value of arr) {
    counts[value]++;
  }
  for (let i = 1; i < counts.length; i++) {
    counts[i] += counts[i - 1];
  }
  const output = new Array(arr.length);
  for (let i = arr.length - 1; i >= 0; i--) {
    counts[arr[i]]--;
    output[counts[arr[i]]] = arr[i];
  }
  return output;
}
