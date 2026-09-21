/**
 * Returns previous index of the table, the last if current index is 0
 * @param n current index
 * @param l table
 * @returns new index: number
 */
export function prev(n: number, l: any[]): number {
    return n - 1 >= 0 ? n - 1 : l.length - 1;
}

/**
 * Returns next index of the table, 0 if current index is the end of the list
 * @param n current index
 * @param l table
 * @returns new index
 */
export function next(n: number, l: any[]): number {
    return n + 1 <= l.length - 1 ? n + 1 : 0;
}