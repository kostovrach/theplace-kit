import validator from 'validator';
import { parsePhoneNumberWithError } from 'libphonenumber-js';

import { rateLimiter } from '~~/server/utils/rateLimiter';
import { sendEmail } from '~~/server/services/sendEmail';

import type { IEmailRequest } from '~~/shared/types/entities/request';

export default defineEventHandler(
    async (event): Promise<{ status: number; success: boolean; message?: string }> => {
        if (!rateLimiter(event)) {
            return {
                status: 429,
                success: false,
                message: 'Слишком много запросов. Попробуйте позже',
            };
        }

        try {
            const body = await readBody<IEmailRequest>(event);
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

            return await sendEmail(body);
        } catch {
            return {
                status: 500,
                success: false,
                message: 'Ошибка сервера, попробуйте повторить попытку позже',
            };
        }
    }
);
