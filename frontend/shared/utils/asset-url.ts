/**
 * Допустимые режимы масштабирования изображения Directus.
 *
 * - `cover`   - заполнение заданных размеров с возможной обрезкой;
 * - `contain` - вписывание изображения в заданные размеры без обрезки;
 * - `inside`  - уменьшение изображения до заданных размеров без увеличения;
 * - `outside` - масштабирование изображения до покрытия заданных размеров.
 */
type AssetFit = 'cover' | 'contain' | 'inside' | 'outside';

/**
 * Допустимые форматы изображения для трансформации Directus.
 *
 * - `auto` - автоматический выбор формата
 */
type AssetFormat = 'auto' | 'jpg' | 'png' | 'webp' | 'tiff' | 'avif';

/**
 * Параметры трансформации и получения ассета Directus.
 *
 * Значения преобразуются в query-параметры URL ассета.
 */
export interface AssetQuery {
    /** Preset key из настроек Directus. */
    key?: string;

    /** Требуемая ширина изображения в пикселях. */
    width?: number;

    /** Требуемая высота изображения в пикселях. */
    height?: number;

    /** Режим масштабирования изображения. */
    fit?: AssetFit;

    /**
     * Качество результирующего изображения **(от 1 до 100)**.
     *
     * По умолчанию Directus может вернуть изображение с `quality` ~85-90.
     *
     * Зависит от используемой версии и конфигурации
     */
    quality?: number;

    /** Формат результирующего изображения. */
    format?: AssetFormat;

    /**
     * Дополнительные трансформации Directus.
     *
     * Значение передаётся в URL в виде JSON-строки.
     */
    transforms?: unknown[];

    /** Запрет увеличения изображения относительно его исходного размера. */
    withoutEnlargement?: boolean;

    /** Координата фокусной точки по горизонтали. */
    focal_point_x?: number;

    /** Координата фокусной точки по вертикали. */
    focal_point_y?: number;

    /**
     * Формирование URL для скачивания файла.
     *
     * При `true` используется стандартное поведение Directus,
     * при строковом значении используется переданное значение.
     */
    download?: boolean | string;
}

/**
 * Дополнительные параметры формирования URL ассета.
 */
export interface AssetOptions {
    /**
     * Добавление расширения файла в URL
     *
     * - строка - использование указанного имени после преобразования через {@link slugify};
     * - `true` - использование `filename_disk` из `DirectusFile`;
     * - `false` или отсутствие параметра - отсутствие расширения файла в URL.
     */
    filename?: boolean | string;

    /**
     * Явный базовый URL Directus.
     *
     * Имеет приоритет над URL из `runtimeConfig`.
     */
    baseUrl?: string;
}

/**
 * Нормализованные данные ассета, необходимые для формирования URL.
 *
 * @internal
 */
interface ResolvedAsset {
    id: string;
    filename: string | null;
    mimeType: string | null;
}

/**
 * Формирование URL ассета Directus.
 *
 * Поддерживаются два варианта входного значения:
 *
 * - идентификатор файла в виде строки;
 * - объект `DirectusFile`.
 *
 * Формирование URL включает:
 * - определение и нормализацию данных ассета;
 * - определение базового URL Directus;
 * - формирование имени файла (если задано в конфигурации);
 * - формирование пути `/assets/{id}`;
 * - добавление параметров трансформации;
 * - автоматическое преобразование растровых изображений в WebP (если задано в конфигурации)
 *
 * При невозможности определить ассет или базовый URL возвращается `null`.
 *
 * @param file - Идентификатор ассета или объект файла Directus.
 * `null` и `undefined` рассматриваются как отсутствие ассета.
 *
 * @param query - Параметры трансформации и получения ассета.
 *
 * @param options - Дополнительные параметры формирования URL.
 *
 * @returns Полный URL ассета Directus или `null`, если URL невозможно сформировать.
 *
 * @example
 * getAssetUrl('550e8400-e29b-41d4-a716-446655440000')
 * // 'https://example.com/assets/550e8400-e29b-41d4-a716-446655440000'
 *
 * @example
 * getAssetUrl(file, { width: 800, quality: 80 })
 * // 'https://example.com/assets/...?...'
 *
 * @example
 * getAssetUrl(file, {}, { filename: true })
 * // 'https://example.com/assets/.../uuid.jpg'
 */
export function getAssetUrl(
    file: string | DirectusFile | null | undefined,
    query: AssetQuery = {},
    options: AssetOptions = {}
): string | null {
    const asset = resolveAsset(file);
    if (!asset) return null;

    const baseUrl = resolveBaseUrl(options.baseUrl);
    if (!baseUrl) return null;

    const filename = resolveFilename(asset.filename, options.filename);

    const path = buildAssetPath(baseUrl, asset.id, filename);

    const search = buildQueryString(asset.mimeType, query);

    return search ? `${path}?${search}` : path;
}

/**
 * Нормализация входного значения ассета.
 *
 * Для строкового значения используется сам идентификатор,
 * а дополнительные данные файла считаются недоступными.
 *
 * Для объекта `DirectusFile` извлекаются идентификатор,
 * имя файла и MIME-тип.
 *
 * Пустые идентификаторы и отсутствующие значения приводят к результату `null`.
 *
 * @param file - Идентификатор ассета или объект файла Directus.
 *
 * @returns Нормализованные данные ассета или `null`,
 * если входное значение не содержит корректного идентификатора.
 */
function resolveAsset(file: string | DirectusFile | null | undefined): ResolvedAsset | null {
    if (!file) return null;

    if (typeof file === 'string') {
        const id = file.trim();
        return id ? { id, filename: null, mimeType: null } : null;
    }

    if (!file.id) return null;

    return {
        id: file.id,
        filename: file.filename_disk || null,
        mimeType: file.type || null,
    };
}

/**
 * Определение и нормализация базового URL Directus.
 *
 * При наличии явно переданного URL используется он.
 * В ином случае используется значение `runtimeConfig.public.directus.url`.
 *
 * При невозможности получить runtime-конфигурацию возвращается `null`.
 *
 * @param explicit - Явно переданный базовый URL Directus.
 *
 * @returns Нормализованный базовый URL без завершающего `/`
 * или `null`, если URL недоступен.
 */
function resolveBaseUrl(explicit?: string): string | null {
    if (explicit) return normalizeUrl(explicit);

    try {
        const url = useRuntimeConfig().public.directus.url;
        return normalizeUrl(url);
    } catch {
        return null;
    }
}

/**
 * Формирование имени файла с расширением для URL ассета.
 *
 * При отсутствии настройки `filename` имя файла не добавляется.
 * При значении `true` используется `filename_disk` из Directus.
 * При строковом значении используется переданная строка.
 *
 * Полученное имя преобразуется в slug через {@link slugify}.
 *
 * @param filename - Имя файла из Directus или `null`.
 * @param option - Настройка имени файла.
 *
 * @returns Нормализованное имя файла с расширением или `null`,
 * если имя не должно добавляться или его невозможно получить.
 */
function resolveFilename(filename: string | null, option?: boolean | string): string | null {
    if (option === undefined || option === false) return null;

    const slug = typeof option === 'string' ? option : filename;
    if (!slug) return null;
    
    return slug || null;
}

/**
 * Формирование пути к ассету Directus.
 *
 * Идентификатор и имя файла кодируются через {@link encodeURIComponent}
 * для безопасного использования в URL.
 *
 * @param baseUrl - Нормализованный базовый URL Directus.
 * @param id - Идентификатор ассета.
 * @param filename - имя файла или `null`.
 *
 * @returns Путь к ассету без query-параметров.
 */
function buildAssetPath(baseUrl: string, id: string, filename: string | null): string {
    const encodedId = encodeURIComponent(id);
    const filenamePart = filename ? `/${encodeURIComponent(filename)}` : '';

    return `${baseUrl}/assets/${encodedId}${filenamePart}`;
}

/**
 * Формирование строки query-параметров ассета.
 *
 * Параметры из `query` преобразуются в `URLSearchParams`.
 * Массив `transforms` сериализуется в JSON.
 * `null`, `undefined` и пустые строки пропускаются.
 *
 * При отсутствии явно заданного `format` для растрового изображения
 * автоматически добавляется `format=webp`, если автоматическое
 * преобразование WebP включено в runtime-конфигурации.
 *
 * @param mimeType - MIME-тип исходного файла или `null`.
 * @param query - Параметры трансформации ассета.
 *
 * @returns URL-encoded строка query-параметров без символа `?`.
 */
function buildQueryString(mimeType: string | null, query: AssetQuery): string {
    const params = new URLSearchParams();

    /**
     * Автоматическое преобразование в WebP только для растровых изображений
     * и только при отсутствии явно заданного `format`.
     */
    if (!query.format && isRasterImage(mimeType) && isAutoWebpEnabled()) {
        params.set('format', 'webp');
    }

    for (const [key, value] of Object.entries(query)) {
        if (value == null || value === '') continue;

        if (key === 'transforms' && Array.isArray(value)) {
            params.set(key, JSON.stringify(value));
        } else {
            params.set(key, String(value));
        }
    }

    return params.toString();
}

/**
 * Нормализация базового URL.
 *
 * Удаление пробелов по краям и завершающих `/` позволяет
 * безопасно объединять базовый URL с путём `/assets`.
 *
 * @param url - Исходный URL.
 *
 * @returns Нормализованный URL без завершающего `/`
 * или `null` для пустого значения.
 */
function normalizeUrl(url?: string | null): string | null {
    if (!url) return null;
    const trimmed = url.trim();
    return trimmed ? trimmed.replace(/\/+$/, '') : null;
}

/**
 * Определение растрового изображения по MIME-типу.
 *
 * SVG и GIF исключаются из автоматического преобразования в WebP.
 *
 * @param mimeType - MIME-тип файла.
 *
 * @returns `true`, если MIME-тип соответствует поддерживаемому
 * растровому изображению; иначе `false`.
 */
function isRasterImage(mimeType: string | null): boolean {
    if (!mimeType?.startsWith('image/')) return false;
    return !['image/svg+xml', 'image/svg', 'image/gif'].includes(mimeType);
}

/**
 * Определение состояния автоматического преобразования изображений в WebP.
 *
 * Значение берётся из `runtimeConfig.public.directus.autoWebp`.
 * При недоступности runtime-конфигурации автоматическое преобразование
 * считается отключённым.
 *
 * @returns `true`, если автоматическое преобразование в WebP включено; иначе `false`.
 */
function isAutoWebpEnabled(): boolean {
    try {
        return useRuntimeConfig().public.directus.autoWebp;
    } catch {
        return false;
    }
}
