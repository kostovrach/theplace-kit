import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

import { getDirectusCollection } from '~~/server/services/serverCms';

import type { ISettings } from '~~/shared/types/settings';
import type { IEmailRequest } from '~~/shared/types/entities/request';

const config = useRuntimeConfig();
const smtpConfig = config.smtp;
const isDev = config.public.appEnv === 'dev';

/** Цвет фона */
const TEMPLATE_MAIN_HEX = '#FFFFFF';
/** Цвет текста и декоративных блоков */
const TEMPLATE_SECONDARY_HEX = '#000000';
/** Цвет ссылок и интективных элементов */
const TEMPLATE_ACCENT_HEX = '#F5F3E3';

let transporter: nodemailer.Transporter | null;

/**
 * Отправка email на заданные в админке почты
 * - Если `appEnv === 'dev'` - письмо отправляется через тестовую среду `nodemailer` для превью (ссылка будет в консоли)
 * - Функция не валидирует входные данные. Предполагается, что переданные данные уже прошли валидацию перед вызовом
 */
export async function sendEmail(
    request: IEmailRequest
): Promise<{ status: number; success: boolean; message?: string }> {
    /** Инициализация транспорта в зависимости отсреды исполнения */
    if (!transporter) {
        if (isDev) {
            const testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
        } else {
            transporter = nodemailer.createTransport({
                host: smtpConfig.host,
                port: Number(smtpConfig.port),
                secure: true,
                auth: {
                    user: smtpConfig.user,
                    pass: smtpConfig.pass,
                },
            });
        }
    }

    try {
        /** Коллекция настроек сайта из `Directus` */
        const settings = await getDirectusCollection<ISettings>('settings');
        /** HTML шаблон письма */
        const template = `
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td align="center">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${TEMPLATE_MAIN_HEX}; color: ${TEMPLATE_SECONDARY_HEX}; max-width: 640px; font-family: Arial, sans-serif">

                            <!-- Header -->
                            <tr>
                                <td style="background-color: ${TEMPLATE_SECONDARY_HEX}; padding: 16px">
                                    <table role="presentation" width="100%">
                                        <tr>
                                            <td style="color: ${TEMPLATE_MAIN_HEX}; font-size: 20px; font-weight: bold">Заявка</td>
                                            <td align="right">
                                                <a href="${config.public.siteUrl}">
                                                    <img src="${config.public.siteUrl}/favicon.svg" width="48" height="48" style="display: block" alt="Logo" />
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            <!-- Body -->
                            <tr>
                                <td style="padding: 32px 16px 256px">
                                    <table role="presentation" width="100%">
                                        <tr>
                                            <td>
                                                <table role="presentation" width="100%">
                                                    <tr>
                                                        <td style="color: #777; font-size: 16px">Имя:</td>
                                                        <td align="right" style="font-weight: bold; font-size: 18px">${request.name ?? 'Не указано'}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style="color: #777; font-size: 16px; padding-top: 24px">Телефон:</td>
                                                        <td align="right" style="padding-top: 24px; font-weight: bold; font-size: 18px">
                                                            <a href="tel:${replaceSpaces(request.phone ?? '')}" style="color: ${TEMPLATE_ACCENT_HEX}; white-space: nowrap"> ${request.phone} </a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="color: #777; font-size: 16px; padding-top: 24px">E-mail:</td>
                                                        <td align="right" style="padding-top: 24px; font-weight: bold; font-size: 18px">
                                                            <a href="mailto:${replaceSpaces(request.email ?? '')}" style="color: ${TEMPLATE_ACCENT_HEX}; white-space: nowrap"> ${request.email} </a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="color: #777; font-size: 16px; padding-top: 24px">Комментарий:</td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="left" style="padding-top: 16px; font-size: 18px; text-align: left; line-height: 1.4">${request.message ?? '---'}</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: ${TEMPLATE_SECONDARY_HEX}; height: 86px"></td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        `;

        /**
         * Цикл по массиву email'ов из настроек
         *
         * TODO: Сделать отправку в виде рассылки вместо цикла
         */
        for (const target of settings.request_targets) {
            const mailOptions: Mail.Options = {
                from: 'Заявка',
                to: replaceSpaces(target.email),
                subject: 'Заявка с сайта',
                html: template,
            };

            const res = await transporter.sendMail(mailOptions);

            if (isDev) {
                /** Логирование ссылки на превью, если среда dev */
                console.log('Preview URL:', nodemailer.getTestMessageUrl(res));
            }
        }

        return {
            status: 200,
            success: true,
        };
    } catch (err) {
        return {
            status: 500,
            success: false,
            message: 'Ошибка сервера, попробуйте повторить попытку позже',
        };
    }
}
