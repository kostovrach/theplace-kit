/** Интерфейс заявки с форм на сайте */
export interface IEmailRequest {
    id: string | number;
    date_created: string;
    date_updated: string | null;
    
    name: string;
    phone: string;
    email: string;
    message: string | null;
}