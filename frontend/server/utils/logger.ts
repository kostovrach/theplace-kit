/**
 * Допустимые уровни сообщений логгера.
 *
 * Уровни определяют приоритет сообщения и используются для фильтрации
 * вывода в соответствии с уровнем, заданным в runtime-конфигурации.
 */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Приоритеты уровней логирования.
 *
 * Чем меньше значение, тем ниже приоритет уровня.
 * Сообщения с приоритетом ниже установленного уровня логирования
 * не выводятся.
 *
 * @internal
 */
const LOG_LEVELS: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

/**
 * Соответствие уровней логирования методам объекта {@link console}.
 *
 * Уровни `debug` и `info` используют {@link console.log},
 * `warn` - {@link console.warn}, `error` - {@link console.error}.
 *
 * @internal
 */
const METHODS: Record<LogLevel, 'log' | 'warn' | 'error'> = {
    debug: 'log',
    info: 'log',
    warn: 'warn',
    error: 'error',
};

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
 * Повторные вызовы в течение одной секунды используют кэшированное значение
 * без создания нового объекта {@link Date} и повторного форматирования строки.
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
 * Валидация рантайм значения для уровня логирования
 *
 * @internal
 */
function isLogLevel(value: string): value is LogLevel {
    return Object.hasOwn(LOG_LEVELS, value);
}

/**
 * Фабрика серверного логгера.
 *
 * Создание экземпляра логгера с заданной областью логирования.
 * Уровень логирования определяется при создании экземпляра через
 * runtime-конфигурацию приложения.
 *
 * Поддерживаются следующие уровни:
 * - `debug` - отладочная информация;
 * - `info`  - информационные сообщения;
 * - `warn`  - предупреждения;
 * - `error` - сообщения об ошибках.
 *
 * Сообщения с уровнем ниже установленного в runtime-конфигурации
 * не выводятся.
 *
 * Каждая запись имеет формат:
 * `[YYYY-MM-DD HH:mm:ss] LEVEL [SCOPE] content`
 *
 * Дополнительные аргументы передаются в соответствующий метод
 * объекта {@link console} без преобразования.
 *
 * @param scope Область или источник логирования.
 *
 * @returns Объект с методами `debug`, `info`, `warn` и `error`.
 *
 * @example
 * const log = createLogger('CMS');
 *
 * log.debug('Request parameters:', params);
 * log.info('Request started');
 * log.warn('Unexpected response');
 * log.error('Request failed', error);
 */
export function createLogger(scope: string) {
    /**
     * Уровень логирования, заданный в runtime-конфигурации приложения.
     *
     * @internal
     */
    const runtimeLevel = useRuntimeConfig().logger.level.toLowerCase();

    if (!isLogLevel(runtimeLevel)) {
        throw new Error(`Invalid logger level: "${runtimeLevel}"`);
    }

    /**
     * Минимальный приоритет сообщения, допускаемый для вывода.
     *
     * @internal
     */
    const threshold = LOG_LEVELS[runtimeLevel];

    /**
     * Вывод сообщения с заданным уровнем логирования.
     *
     * @param level Уровень логирования.
     * @param args Данные, передаваемые в консоль без преобразования.
     *
     * @returns `void`
     *
     * @internal
     */
    function log(level: LogLevel, ...args: unknown[]) {
        if (LOG_LEVELS[level] < threshold) return;
        const displayLevel = level.toUpperCase().padEnd(5);

        console[METHODS[level]](`[${getFormattedTime()}]`, displayLevel, `[${scope}]`, ...args);
    }

    /**
     * Вывод отладочного сообщения.
     *
     * Сообщения выводятся только при установленном уровне `DEBUG`.
     *
     * @param args Данные, передаваемые в консоль без преобразования.
     *
     * @returns `void`
     */
    function debug(...args: unknown[]) {
        log('debug', ...args);
    }

    /**
     * Вывод информационного сообщения.
     *
     * @param args Данные, передаваемые в консоль без преобразования.
     *
     * @returns `void`
     */
    function info(...args: unknown[]) {
        log('info', ...args);
    }

    /**
     * Вывод предупреждения.
     *
     * @param args Данные, передаваемые в консоль без преобразования.
     *
     * @returns `void`
     */
    function warn(...args: unknown[]) {
        log('warn', ...args);
    }

    /**
     * Вывод сообщения об ошибке.
     *
     * @param args Данные, передаваемые в консоль без преобразования.
     *
     * @returns `void`
     */
    function error(...args: unknown[]) {
        log('error', ...args);
    }

    return { debug, info, warn, error };
}
