pub fn quick_sort(arr: &mut [i32]) {
    if arr.len() <= 1 {
        return;
    }
    let pivot_index = partition(arr);
    let (left, right) = arr.split_at_mut(pivot_index);
    quick_sort(left);
    quick_sort(&mut right[1..]);
}

fn partition(arr: &mut [i32]) -> usize {
    let last = arr.len() - 1;
    let pivot = arr[last];
    let mut store = 0;
    for i in 0..last {
        if arr[i] < pivot {
            arr.swap(i, store);
            store += 1;
        }
    }
    arr.swap(store, last);
    store
}
