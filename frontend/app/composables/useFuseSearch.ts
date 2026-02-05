import type { IFuseOptions, FuseResult } from 'fuse.js';
import type FuseType from 'fuse.js';

/**
 * Composable для нечеткого поиска с Fuse.js
 * @param options - нативные параметры Fuse
 */
export function useFuseSearch<T>(options: IFuseOptions<T> = {}) {
    const { keys = [], threshold = 0.35, ...fuseOptions } = options;
    let fuse: FuseType<T> | null = null;
    let cachedData: T[] = [];

    async function initFuseIfNeeded(data: T[]) {
        if (fuse && cachedData === data) return;

        cachedData = data;

        if (!data || !data.length) {
            fuse = null;
            return;
        }

        const { default: Fuse } = await import('fuse.js');
        fuse = new Fuse(data, { keys, threshold, ...fuseOptions });
    }

    /**
     * Выполнить поиск
     * @param query - строка поиска
     * @param data - массив данных, по которому ищем
     * @returns массив совпадений
     */
    async function search(query: string, data: T[]): Promise<T[]> {
        if (!query.trim()) return data;

        await initFuseIfNeeded(data);
        if (!fuse) return data;

        return fuse.search(query).map((r: FuseResult<T>) => r.item);
    }

    return { search };
}
