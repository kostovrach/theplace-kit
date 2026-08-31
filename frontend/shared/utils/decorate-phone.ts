/**
 * Форматирование номера телефона в российский формат.
 *
 * Функция удаляет из переданного значения все символы, кроме цифр,
 * нормализует номер с префиксом `8`, `7` или `+7` к единому формату и возвращает результат в виде:
 *
 * `+7 (999) 999-99-99`
 *
 * Поддерживаются номера, начинающиеся с:
 *
 * - `+7` - международный формат;
 * - `7`  - национальный код страны без знака `+`;
 * - `8`  - российский национальный префикс, который заменяется на `7`.
 *
 * Если исходное значение не начинается с одного из поддерживаемых
 * префиксов или после нормализации содержит не 11 цифр, функция
 * возвращает исходное значение без изменений.
 *
 * @param phone - Номер телефона в виде строки или числа.
 *
 * @returns Отформатированный номер в формате `+7 (999) 999-99-99`
 * или исходное значение в строковом представлении, если номер не соответствует ожидаемому формату.
 */
export function decoratePhone(phone: string | number): string {
    const raw = phone.toString();

    const onlyDigits = raw.replace(/\D/g, '');

    let digits = onlyDigits;

    if (raw.startsWith('+7')) {
        digits = onlyDigits;
    } else if (raw.startsWith('8')) {
        digits = '7' + onlyDigits.slice(1);
    } else if (raw.startsWith('7')) {
        digits = onlyDigits;
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
