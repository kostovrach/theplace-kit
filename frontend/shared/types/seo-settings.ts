import type { IDirectusFile } from './directus-file';

export interface ISeoSettings {
    meta_title: string;
    meta_description: string | null;
    meta_robots: 'index, follow' | 'noindex, nofollow';
    meta_keywords: string[];
    og_image: IDirectusFile | null;
}
