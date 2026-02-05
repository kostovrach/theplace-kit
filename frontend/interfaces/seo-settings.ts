export interface ISeoSettings {
    meta_title: string;
    meta_description: string | null;
    meta_keywords: string[];

    meta_robots: 'index, follow' | 'noindex, nofollow';

    og_image: string | null;
    og_type: 'article' | 'product' | 'website';

    shema_markup: string | null;
}
