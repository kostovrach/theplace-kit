export interface ISettings {
    id: string | number;
    date_created: string;
    date_updated: string | null;

    /** список email для получения заявок */
    request_targets: { email: string }[];
}
