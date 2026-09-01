import { styleText } from 'node:util';

/**
 * Допустимые уровни сообщений логгера
 *
 * @internal
 */
type LogLevel = 'info' | 'success' | 'warn' | 'error';

/**
 * Префиксы для визуального обозначения разных уровней логирования.
 *
 * Для каждого уровня используется отдельный символ или текст,
 * стилизованный через {@link styleText}.
 *
 * @internal
 */
const PREFIXES: Record<LogLevel, string> = {
    info: styleText('cyan', 'ℹ'),
    success: styleText('green', '✔'),
    warn: styleText('bgYellow', ' WARN '),
    error: styleText('bgRed', ' ERROR '),
};

/**
 * Соответствие уровней логирования методам `console`.
 *
 * @internal
 */
const METHODS: Record<LogLevel, 'log' | 'warn' | 'error'> = {
    info: 'log',
    success: 'log',
    warn: 'warn',
    error: 'error',
};

/**
 * Фабрика консольного логгера.
 *
 * Возвращает набор методов для вывода сообщений с разными уровнями
 * логирования. Каждый метод добавляет соответствующий визуальный префикс
 * и использует подходящий метод объекта `console`.
 *
 * Допустимые уровни:
 * - `info`    - информационные сообщения;
 * - `success` - сообщения об успешном выполнении;
 * - `warn`    - предупреждения;
 * - `error`   - ошибки.
 *
 * Дополнительные аргументы передаются в консоль без преобразования.
 *
 * @returns Объект с методами `info`, `success`, `warn` и `error`
 * для вывода сообщений соответствующего уровня.
 *
 * @example
 * const log = createLogger();
 *
 * log.info('Any message');
 *
 * log.error('Some error:', Error);
 */
export function createLogger() {
    function log(level: LogLevel, ...args: unknown[]) {
        const prefix = PREFIXES[level];
        const method = METHODS[level];

        console[method](prefix, ...args);
    }

    return {
        info: (...args: unknown[]) => log('info', ...args),
        success: (...args: unknown[]) => log('success', ...args),
        warn: (...args: unknown[]) => log('warn', ...args),
        error: (...args: unknown[]) => log('error', ...args),
    };
}

/**
 * Стилизация пути / ссылки для вывода в консоль.
 *
 * Использует яркий голубой цвет для визуального выделения
 * файлового или иного строкового пути.
 *
 * @param input - Путь / ссылка / строка, которую необходимо стилизовать.
 *
 * @returns Исходная строка с ANSI-стилизацией для вывода в терминале.
 */
export function decoratePath(input: string) {
    return styleText('cyanBright', input);
}
