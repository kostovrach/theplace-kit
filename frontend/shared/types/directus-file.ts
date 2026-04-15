export interface IDirectusFile {
    id: string | number;
    created_on: string;
    description: string | null;
    filename_disk: string; // id + file-extention
    filename_download: string;
    filesize: string;
    modified_on: string | null;
    storage: string;
    title: string | null;
    type: string; // например, video/mp4 или image/jpg
}
