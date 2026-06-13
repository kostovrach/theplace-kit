export interface IDirectusFile {
    id: string | number;
    created_on: string;
    description: string | null;
    filename_disk: string; // id + file-extention
    filename_download: string;
    filesize: string;
    modified_on: string | null;
    storage: string; // local/s3/...
    title: string | null;
    type: string; // например, video/mp4 или image/jpg
}

/**
 * Функция для dev стадии, чтобы мокать файлы из библиотеки Directus
 * @param path локальный путь к файлу (подставляется в `file.id`)
 * @param type тип файла (`video/mp4`, `image/jpeg` или т.п.)
 * @returns `IDirectusFile`
 */
export function getMockFile(path: string, type: string): IDirectusFile {
    return {
        id: path,
        created_on: '',
        description: '',
        filename_disk: '',
        filename_download: '',
        filesize: '',
        modified_on: '',
        storage: 'local',
        title: '',
        type: type,
    };
}
