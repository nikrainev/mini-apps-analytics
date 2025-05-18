export function probabilityCheck(n: number): boolean {
    if (n < 0 || n > 1) {
        throw new Error('The probability must be between 0 and 1.');
    }
    return Math.random() < n;
}