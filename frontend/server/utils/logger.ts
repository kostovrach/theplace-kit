let cachedSecond = 0;
let cachedFormattedTime = '';

function getFormattedTime(): string {
    const now = Date.now();
    const seconds = Math.floor(now / 1000);

    // Обновление строки только раз в секунду
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
 * Функция для унифицированного логирования, включая время вызова
 * @param prefix префикс перед содержанием лога
 * @param level уровень лога (error / warn / log)
 * @param args произвольные данные для вывода
 * Вывод вида: `[2026-05-12 14:32:11] LOG [DEBUG]: content loaded`
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

    console.log(`[${getFormattedTime()}]`, displayLevel, `[${prefix}]:`, ...args);
}
