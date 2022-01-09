export const SortDatas = (data) => {
    return data.sort((a, b) => (a.priority.ordinal - b.priority.ordinal))
}
