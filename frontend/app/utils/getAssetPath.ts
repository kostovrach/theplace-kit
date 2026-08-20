/**
 * Функция для форматирования пути assets из библиотеки Directus
 * @param file - интерфейс файла directus
 * @param query - опциональный параметр для форматирования файла
 * @param domain - опциональный параметр для ручной передачи домена CMS (используется в случаях, когда в процессе выполнения функции теряется контекст nuxt)
 * @returns абсолютный путь к файлу из библиотеки Directus (`<домен_directus>/assets/<uuid.расширение>?<query_парметры>`)
 */
export function getAssetPath(file: IDirectusFile, query?: string, domain?: string) {
    /** для dev */
    // return String(file.id);

    const cmsUrl = domain ?? useRuntimeConfig().public.cmsUrl;

    function getQuery() {
        let q = '';

        if (file.type.startsWith('image/') && file.type !== 'image/svg') {
            q += '?format=webp';

            if (query) {
                q += `&${query}`;
            }
        } else if (query) {
            q += `?${query}`;
        }

        return q;
    }

    /**
     * filename_disk для индексации вместо id,
     * поскольку filename_disk состоит из id + расширение файла
     * это необходимо для корректной работы fancybox и прочих edge-кейсов
     */
    return `${cmsUrl}/assets/${file.filename_disk}` + getQuery();
}
