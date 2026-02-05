export function partialHiddenPhone(
    phone: string | number,
    positions: number[] = [5, 6, 9, 10, 11],
    replacement: string = '*'
): string {
    const phoneString = phone.toString();
    if (phoneString.length < Math.max(...positions)) return phoneString;

    let digits = phoneString.split('');
    positions.forEach((pos) => {
        digits[pos] = replacement;
    });
    return digits.join('');
}
