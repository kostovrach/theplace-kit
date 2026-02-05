export function decoratePhone(phone: string | number): string {
    const raw = phone.toString();

    const onlyDigits = raw.replace(/\D/g, '');

    let digits = onlyDigits;

    if (raw.startsWith('+7')) {
        digits = onlyDigits.replace('+', '');
    } else if (raw.startsWith('8')) {
        digits = '7' + onlyDigits.slice(1);
    } else if (raw.startsWith('7')) {
        digits = raw;
    } else {
        return raw;
    }

    if (digits.length !== 11) {
        return raw;
    }

    const code = digits.slice(1, 4);
    const part1 = digits.slice(4, 7);
    const part2 = digits.slice(7, 9);
    const part3 = digits.slice(9, 11);

    return `+7 (${code}) ${part1}-${part2}-${part3}`;
}
