pub fn counting_sort(arr: &[usize]) -> Vec<usize> {
    let Some(&max) = arr.iter().max() else {
        return Vec::new();
    };
    let mut counts = vec![0; max + 1];
    for &value in arr {
        counts[value] += 1;
    }
    for i in 1..counts.len() {
        counts[i] += counts[i - 1];
    }
    let mut result = vec![0; arr.len()];
    for &value in arr.iter().rev() {
        counts[value] -= 1;
        result[counts[value]] = value;
    }
    result
}
