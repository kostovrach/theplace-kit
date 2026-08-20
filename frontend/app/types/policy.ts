/** Интерфейс политики / соглашения */
export interface IPolicy {
    id: string | number;
    date_created: string;
    date_updated: string | null;

    /** название */
    title: string;

    /** Содержание (richText) */
    content: string;
    
    /** флаг отображения */
    published: boolean;
}