/**
 * Преобразование MIME-типа в расширение файла.
 *
 * Поддерживаемые MIME-типы сначала сопоставляются с привычными расширениями файлов.
 * Для остальных корректных MIME-типов используется значение subtype напрямую.
 *
 * Пример:
 * - `image/jpeg`      => `.jpg`;
 * - `image/png`       => `.png`;
 * - `video/mp4`       => `.mp4`.
 * - `audio/mpeg`      => `.mp3`.
 * - `application/pdf` => `.pdf`;
 *
 * Если MIME-тип отсутствует, имеет некорректный формат или не содержит
 * значения subtype, функция возвращает fallback.
 *
 * @param raw - MIME-тип файла в формате `<type>/<subtype>`.
 * @param fallback - Значение **без ведущей точки**, возвращаемое для некорректного или пустого
 * MIME-типа. По умолчанию используется `txt`.
 *
 * @returns Расширение файла с ведущей точкой или значение `fallback`, если MIME-тип не удалось корректно обработать.
 */
export function convertMime(raw: string, fallback = 'txt'): string {
    const mimeType = raw.trim().toLowerCase();

    const [type, subtype] = mimeType.split('/');

    if (!type || !subtype) {
        return `.${fallback}`;
    }

    const aliases: Record<string, string> = {
        jpeg: 'jpg',
        mpeg: 'mp3',
        'svg+xml': 'svg',
        'x-icon': 'ico',
        'vnd.microsoft.icon': 'ico',
        msword: 'doc',
        'vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
        'vnd.ms-excel': 'xls',
        'vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    };

    return `.${aliases[subtype] ?? subtype}`;
}
