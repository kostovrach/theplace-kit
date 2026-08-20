/** Удаление всех пробелов из строки */
export function replaceSpaces(input: string): string {
    return input.trim().replace(/\s+/g, '');
}
