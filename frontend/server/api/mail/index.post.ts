import nodemailer from 'nodemailer';
import validator from 'validator';
import Mail from 'nodemailer/lib/mailer';
import { parsePhoneNumberWithError } from 'libphonenumber-js';

import { rateLimiter } from '~~/server/utils/rateLimiter';

const config = useRuntimeConfig();
const smtpConfig = config.smtp;
const isDev = config.public.appEnv === 'dev';

let transporter: nodemailer.Transporter | null;

export default defineEventHandler(
    async (event): Promise<{ status: number; success: boolean; message?: string }> => {
        if (!rateLimiter(event)) {
            return {
                status: 429,
                success: false,
                message: 'Слишком много запросов. Попробуйте позже',
            };
        }

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
            const body = await readBody<{}>(event);
            if (!body) {
                return { status: 400, success: false, message: 'В запросе отсутсвуют данные' };
            }

            if (body.email && !validator.isEmail(body.email)) {
                return {
                    status: 400,
                    success: false,
                    message: 'Некорректный адрес электронной почты',
                };
            }

            if (body.phone) {
                try {
                    const parsedPhone = parsePhoneNumberWithError(body.phone, 'RU');
                    if (!parsedPhone.isValid()) {
                        return {
                            status: 400,
                            success: false,
                            message: 'Некорректный номер телефона',
                        };
                    }
                } catch {
                    return {
                        status: 500,
                        success: false,
                        message: 'Ошибка валидации номера телефона',
                    };
                }
            }

            const mailOptions: Mail.Options = {
                from: 'Заявка',
                to: smtpConfig.target,
                subject: 'Новая заявка с сайта',
                html: ``,
            };

            const res = await transporter.sendMail(mailOptions);

            if (isDev) {
                console.log('Preview URL:', nodemailer.getTestMessageUrl(res));
            }

            return {
                status: 200,
                success: true,
            };
        } catch {
            return {
                status: 500,
                success: false,
                message: 'Ошибка сервера, попробуйте повторить попытку позже',
            };
        }
    }
);
