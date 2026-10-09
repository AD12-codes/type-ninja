func linearSearch(arr []int, target int) int {
    for i, value := range arr {
        if value == target {
            return i
        }
    }
    return -1
}
