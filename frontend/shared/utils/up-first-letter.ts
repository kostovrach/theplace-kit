/**
 * Приводит первую букву текста в uppercase
 * @example upFirstLetter('foo bar') => 'Foo bar'
 */
export function upFirstLetter(input: string): string {
    const firstLetter = input.slice(0, 1);

    return `${firstLetter.toUpperCase()}${input.slice(1)}`;
}
