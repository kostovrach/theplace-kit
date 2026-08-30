/**
 * Функция форматирует тип файла из вида `image/jpg` к виду `.jpg`
 * @param raw - значение вида `image/jpg`, `image/png`, `video/mp4` и т.п.
 * @returns тип файла в формате `.jpg`, `.png`, `.mp4` и т.п.
 */
export function normalizeFileType(raw: string) {
    const formatted = raw.split('/')[1] ?? '';

    return `.${formatted}`;
}