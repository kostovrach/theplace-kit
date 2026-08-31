/**
 * Извлечение hostname из URL или строкового представления адреса.
 *
 * Функция поддерживает URL как с протоколом, так и без него.
 * Если протокол отсутствует, для разбора временно используется `http://`.
 *
 * Пример:
 * - `https://example.com:3000/example-path/` => `example.com`;
 * - `https://www.example.com/path`           => `www.example.com`;
 * - `https://example.com:3000`               => `example.com`.
 * - `example.com/path`                       => `example.com`;
 *
 * При успешном разборе используется стандартный {@link URL} API,
 * поэтому из результата автоматически исключаются порт, путь, query-параметры и hash.
 *
 * Если стандартный разбор URL завершается ошибкой, функция использует
 * упрощённый fallback-разбор через {@link fallbackExtract}.
 *
 * Пустая строка или строка, состоящая только из пробелов,
 * приводит к возврату пустой строки.
 *
 * @param input - URL или hostname в строковом представлении.
 * Может содержать протокол, порт, путь, query-параметры и hash.
 *
 * @returns Hostname без протокола, порта, пути, query-параметров и hash.
 * Для пустого или неразбираемого значения возвращается результат fallback-разбора либо пустая строка.
 */
export function extractHostname(input: string): string {
    if (!input || typeof input !== 'string') return '';

    const value = input.trim();
    if (!value) return '';

    try {
        const hasProtocol = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(value);
        const url = new URL(hasProtocol ? value : `http://${value}`);

        return url.hostname;
    } catch {
        return fallbackExtract(value);
    }
}

/**
 * Извлекает hostname из URL без использования стандартного {@link URL} API.
 *
 * Функция предназначена как fallback для {@link normalizeUrl} и выполняет упрощённый разбор строки:
 *
 * - Удаление протокола;
 * - Удаление пути;
 * - Удаление query-параметров;
 * - Удаление hash;
 * - Удаление порта.
 *
 * **Это не полноценный парсер URL и не выполняет строгую валидацию полученного значения**.
 *
 * @param value - Строковое представление URL для упрощённого разбора.
 *
 * @returns Часть строки, интерпретируемая как hostname.
 *
 * @internal
 */
function fallbackExtract(value: string): string {
    let result = value.replace(/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//, '');

    result = result.split('/')[0]!.split('?')[0]!.split('#')[0]!;

    result = result.split(':')[0]!;

    return result;
}
