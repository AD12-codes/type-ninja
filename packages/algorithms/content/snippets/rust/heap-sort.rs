pub fn heap_sort(arr: &mut [i32]) {
    let n = arr.len();
    for i in (0..n / 2).rev() {
        sift_down(arr, i, n);
    }
    for end in (1..n).rev() {
        arr.swap(0, end);
        sift_down(arr, 0, end);
    }
}

fn sift_down(arr: &mut [i32], mut root: usize, size: usize) {
    loop {
        let left = 2 * root + 1;
        let right = left + 1;
        let mut largest = root;
        if left < size && arr[left] > arr[largest] {
            largest = left;
        }
        if right < size && arr[right] > arr[largest] {
            largest = right;
        }
        if largest == root {
            return;
        }
        arr.swap(root, largest);
        root = largest;
    }
}
