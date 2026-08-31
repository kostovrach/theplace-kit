/**
 * Частичное скрытие символов номера телефона.
 *
 * Заменяет символы по указанным нулевым индексам на заданный символ.
 * Остальные символы сохраняются без изменений.
 *
 * Позиции считаются от нулевого индекса
 *
 * Если список позиций пуст или номер недостаточно длинный для одной
 * из указанных позиций, функция возвращает исходное значение без изменений.
 *
 * @example
 * partialHiddenPhone('+7 (999) 999-99-99', [5, 6, 9, 10, 11])
 * // +7 (9**) ***-99-99
 *
 * @example
 * partialHiddenPhone('79999999999', [5, 6, 9, 10, 11])
 * // 79999**99***
 *
 * @param phone - Номер телефона в строковом или числовом представлении.
 * @param positions - Массив нулевых индексов символов, которые необходимо скрыть.
 * По умолчанию скрываются позиции `5`, `6`, `9`, `10` и `11`.
 *
 * @param replacement - Один символ, используемый для замены.
 * По умолчанию используется `*`.
 *
 * @returns Строка с частично скрытыми символами номера или исходное значение,
 * если номер недостаточно длинный или список позиций пуст.
 *
 * Или исходное значение, если `replacement` содержит более одного символа или пустую строку.
 */
export function partialHiddenPhone(
    phone: string | number,
    positions: number[] = [5, 6, 9, 10, 11],
    replacement: string = '*'
): string {
    const phoneString = phone.toString();

    if (!positions.length) {
        return phoneString;
    }

    if (replacement.length !== 1) {
        return phoneString;
    }

    const maxPosition = Math.max(...positions);

    if (maxPosition < 0 || phoneString.length <= maxPosition) {
        return phoneString;
    }

    const characters = phoneString.split('');

    positions.forEach((position) => {
        if (position >= 0 && position < characters.length) {
            characters[position] = replacement;
        }
    });

    return characters.join('');
}
