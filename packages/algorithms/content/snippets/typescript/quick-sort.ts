function partition(
  arr: number[],
  low: number,
  high: number
): number {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

function sortRange(
  arr: number[],
  low: number,
  high: number
): void {
  if (low < high) {
    const p = partition(arr, low, high);
    sortRange(arr, low, p - 1);
    sortRange(arr, p + 1, high);
  }
}

function quickSort(arr: number[]): number[] {
  sortRange(arr, 0, arr.length - 1);
  return arr;
}
