/**
 * Удаление всех пробелов из строки
 *
 * @example
 * replaceSpaces('Hello World') => 'HelloWorld'
 *
 * replaceSpaces('+7 (999) 999-99-99') => '+7(999)999-99-99'
 */
export function replaceSpaces(input: string): string {
    return input.trim().replace(/\s+/g, '');
}
