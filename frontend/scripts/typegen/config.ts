import { styleText } from 'node:util';
import path from 'node:path';

export const CONFIG = {
    /** Корень проекта */
    ROOT: process.cwd(),

    /** Файл ре-экспорта */
    INDEX_FILE: 'directus.ts',

    /** Шапка сгенерированных файлов */
    FILE_HEADER: '// Auto-generated. Do not edit.',

    /** Строка экспорта системных коллекций из SDK */
    SYSTEM_COLLECTIONS:
        "export type { DirectusUser, DirectusFile, DirectusCollection, DirectusRole, DirectusField, DirectusPermission, DirectusFolder, DirectusAccess, DirectusFlow, DirectusSettings, DirectusShare, DirectusPolicy, DirectusVersion, DirectusDashboard, DirectusRelation, DirectusClient, DirectusTranslation, DirectusActivity, DirectusWebhook, DirectusApiError, DirectusComment, DirectusError, DirectusExtension, DirectusNotification, DirectusOperation, DirectusPanel, DirectusPreset, DirectusRevision, RegularCollections, SingletonCollections } from '@directus/sdk';",

    /** Префикс для ошибок */
    ERR_PREFIX: styleText('bgRed', ' ERROR '),

    /** Префикс для предупреждений */
    WARN_PREFIX: styleText('bgYellow', ' WARN '),

    /** Префикс для логов */
    LOG_PREFIX: styleText('cyan', 'ℹ'),

    /** Префикс для логов */
    SUCCESS_PREFIX: styleText('green', '✔'),

    /** Директория для записи */
    get OUT_DIR() {
        return path.join(CONFIG.ROOT, 'shared/types');
    },

    /** Поддиректория для коллекций */
    get COLLECTIONS_DIR() {
        return path.join(CONFIG.OUT_DIR, 'collections');
    },

    /** Временный файл монолитной схемы */
    get TEMP_FILE() {
        return path.join(CONFIG.OUT_DIR, '_temp-schema.ts');
    },
} as const;
