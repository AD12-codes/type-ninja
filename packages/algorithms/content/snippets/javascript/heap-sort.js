function heapSort(arr) {
  const n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    siftDown(arr, i, n);
  }
  for (let end = n - 1; end > 0; end--) {
    [arr[0], arr[end]] = [arr[end], arr[0]];
    siftDown(arr, 0, end);
  }
  return arr;
}

function siftDown(arr, root, size) {
  let current = root;
  while (true) {
    let largest = current;
    const left = 2 * current + 1;
    const right = left + 1;
    if (left < size && arr[left] > arr[largest]) {
      largest = left;
    }
    if (right < size && arr[right] > arr[largest]) {
      largest = right;
    }
    if (largest === current) {
      return;
    }
    [arr[current], arr[largest]] = [arr[largest], arr[current]];
    current = largest;
  }
}
