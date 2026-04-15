import type { IDirectusFile } from '~~/shared/types/directus-file';

function formatType(raw: string) {
    const splited = raw.split('.');
    const formatted = splited[splited.length - 1] ?? 'jpg';

    return `.${formatted}`;
}
/**
 * Функция для форматирования пути assets из библиотеки Directus
 * @param file - интерфейс файла directus
 * @param absolute - опциональный параметр, при указании которого путь для файла становится абсолютным
 * @returns относительный или абсолютный путь к файлу из библиотеки Directus
 */
export function getAssetPath(file: IDirectusFile, absolute?: boolean) {
    const siteUrl = useRuntimeConfig().public.siteUrl;

    // Для production
    // const localPath = `/api/cms/assets/${file.id}${formatType(file.filename_download)}`;
    // const absolutePath = siteUrl + localPath;
    // return absolute ? absolutePath : localPath;

    // Для dev (mock-data)
    return String(file.id);
}
