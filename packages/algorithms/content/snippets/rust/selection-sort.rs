pub fn selection_sort(arr: &mut [i32]) {
    let n = arr.len();
    for i in 0..n {
        let mut min_index = i;
        for j in i + 1..n {
            if arr[j] < arr[min_index] {
                min_index = j;
            }
        }
        if min_index != i {
            arr.swap(i, min_index);
        }
    }
}
