/** 
 * Нормализация номера телефона
 * @param raw - номер телефона в любом формате: `+7 (888) 777-66-55` / `+78887776655` / `8(888)777-66-55`
 * @returns строка с номером о формату `78887776655` всегда с ведущей семеркой
 * @returns в случае, если передан не валидный номер телефона прокидывается ошибка
 */
export const normalizePhone = (raw: string | number): string => {
    const digits = String(raw).replace(/\D/g, '');

    // Если начинается с 8 — заменяем на 7
    if (digits.startsWith('8') && digits.length === 11) {
        return '7' + digits.slice(1);
    }

    // Если уже с 7 и 11 цифр — ок
    if (digits.startsWith('7') && digits.length === 11) {
        return digits;
    }

    // Если 10 цифр без кода страны — добавляем 7
    if (digits.length === 10) {
        return '7' + digits;
    }

    throw new Error(`Невалидный номер телефона: ${raw}`);
};
