/**
 * Кэш текущей секунды Unix time.
 *
 * Используется совместно с {@link cachedFormattedTime}, для предотвращения форматирования даты при каждом вызове {@link getFormattedTime}.
 *
 * Значение представляет количество полных секунд, прошедших с Unix epoch.
 *
 * @internal
 */
let cachedSecond = 0;

/**
 * Кэшированное строковое представление текущей даты и времени.
 *
 * Строка обновляется не чаще одного раза в секунду в {@link getFormattedTime}.
 * Между обновлениями функция возвращает уже вычисленное значение.
 *
 * @internal
 */
let cachedFormattedTime = '';

/**
 * Получение текущей локальной даты и времени в формате `YYYY-MM-DD HH:mm:ss`.
 *
 * Форматирование выполняется только при изменении текущей секунды.
 * Повторные вызовы в течение одной секунды возвращают кэшированное значение,
 * во избежании создания объекта {@link Date} и повторного форматирования строки при каждом вызове {@link logger}.
 *
 * Временная зона определяется окружением, в котором выполняется код.
 *
 * @returns Текущие локальные дата и время в формате `YYYY-MM-DD HH:mm:ss`.
 *
 * @internal
 */
function getFormattedTime(): string {
    const now = Date.now();
    const seconds = Math.floor(now / 1000);

    if (seconds !== cachedSecond) {
        cachedSecond = seconds;

        const date = new Date(now);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const secs = String(date.getSeconds()).padStart(2, '0');

        cachedFormattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${secs}`;
    }

    return cachedFormattedTime;
}

/**
 * Унифицированный вывод сообщения в консоль с временной меткой и префиксом.
 *
 * Уровень логирования определяется первым аргументом и может быть одним из
 * стандартных методов объекта {@link console}: `log`, `warn` или `error`.
 *
 * Фактический вывод дополнительно ограничивается уровнем логирования,
 * заданным в runtime-конфигурации приложения через `logger.level`.
 *
 * При уровне `WARN` обычные сообщения (`log`) не выводятся.
 * При уровне `ERROR` выводятся только сообщения об ошибках (`error`).
 *
 * Каждая запись получает единый формат:
 *
 * `[YYYY-MM-DD HH:mm:ss] LEVEL [PREFIX]: content`
 *
 * Пример вывода:
 *
 * `[2026-05-12 14:32:11] LOG   [DEBUG]: content loaded`
 *
 * Дополнительные аргументы передаются в соответствующий метод {@link console} без преобразования.
 *
 * @param level Уровень логирования. По умолчанию используется `log`.
 * @param prefix Короткий идентификатор или категория сообщения, используемый для определения источника записи в логе.
 * @param args Произвольные данные, передаваемые в консоль после префикса.
 *
 * @returns `void`
 */
export function logger(
    level: 'log' | 'warn' | 'error' = 'log',
    prefix: string,
    ...args: unknown[]
) {
    const LOG_LEVEL = useRuntimeConfig().logger.level;
    const displayLevel = `${level.toUpperCase()}  `.slice(0, 5);

    if (LOG_LEVEL === 'WARN' && level === 'log') return;
    if (LOG_LEVEL === 'ERROR' && (level === 'log' || level === 'warn')) return;

    console[level](`[${getFormattedTime()}]`, displayLevel, `[${prefix}]:`, ...args);
}
