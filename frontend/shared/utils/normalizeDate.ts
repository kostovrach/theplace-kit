/**
 * Форматирование даты в человеко-читаемый вид (ru-RU)
 *
 * @param dateStr - строка даты (ISO или совместимый формат)
 * @returns отформатированная дата вида "15 апреля 2026"
 */
export function normalizeDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}
