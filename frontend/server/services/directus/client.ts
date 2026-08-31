import { createDirectus, rest, staticToken } from '@directus/sdk';

const config = useRuntimeConfig();

/**
 * URL экземпляра Directus.
 *
 * @internal
 */
const URL = config.directus.url;

/**
 * Токен для авторизации запросов к Directus API.
 *
 * Используется {@link staticToken} для добавления токена к исходящим HTTP-запросам.
 *
 * @internal
 */
const TOKEN = config.directus.token;

/**
 * Типизированный клиент Directus.
 *
 * Клиент создаётся на основе схемы приложения {@link Schema} и настроен
 * для работы с REST API Directus с использованием статического токена
 * авторизации.
 *
 * Экземпляр предоставляет типобезопасный интерфейс для выполнения запросов
 * к коллекциям и другим ресурсам Directus в соответствии с определённой схемой данных.
 *
 * @see {@link https://directus.com/docs/guides/connect/sdk}
 */
export const directus = createDirectus<Schema>(URL).with(rest()).with(staticToken(TOKEN));
