import { execSync } from 'node:child_process';
import { styleText } from 'node:util';
import { promises as fs } from 'node:fs';
import { config as dotenv } from 'dotenv';
import path from 'node:path';

import { CONFIG } from './config';

dotenv();

const DIRECTUS_URL = process.env.DIRECTUS_URL;
const DIRECTUS_TOKEN = process.env.DIRECTUS_TYPEGEN_TOKEN;

function toKebabCase(name: string): string {
    return name
        .replace(/^I/, '')
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
        .toLowerCase();
}

/** Гарантированное создание директории, при отсутствии */
async function ensureDir(dir: string) {
    await fs.mkdir(dir, { recursive: true });
}

/** Очистка целевой директории от всех TypeScript-файлов */
async function rimrafTs(dir: string) {
    await ensureDir(dir);
    const files = await fs.readdir(dir);
    await Promise.all(
        files.filter((file) => file.endsWith('.ts')).map((file) => fs.unlink(path.join(dir, file)))
    );
}

/**
 * Обработка падения генерации
 * Проверяет наличие индексного файла и создает заглушку при отсутствии
 */
async function handleFallback() {
    const indexPath = path.join(CONFIG.OUT_DIR, CONFIG.INDEX_FILE);

    try {
        /** Проверка существования файла */
        await fs.stat(indexPath);
        console.log(CONFIG.LOG_PREFIX, 'Using previously cached types');
    } catch {
        /** Генерация fallback структуры, при отсуствии файла */
        console.log(
            CONFIG.WARN_PREFIX,
            `Index file not found. Creating fallback types stub at: ${styleText('cyanBright', indexPath)}`
        );

        const fallbackContent = [
            `${CONFIG.FILE_HEADER}\n`,
            `${CONFIG.SYSTEM_COLLECTIONS}\n`,
            `/** Fallback Empty Schema */`,
            `export interface Schema {}`,
            `/** Collections map */`,
            `${CONFIG.COLLECTION_MAP}`,
        ].join('\n');

        await ensureDir(CONFIG.OUT_DIR);
        await fs.writeFile(indexPath, fallbackContent, 'utf-8');
    }
}

/**
 * Вызов CLI генератора `directus-ts-typegen`
 * @returns `boolean` Успешность генерации файла
 */
function runTypegen(): boolean {
    const args = [
        `--directus-host ${DIRECTUS_URL}`,
        `--directus-token ${DIRECTUS_TOKEN}`,
        `--output ${CONFIG.TEMP_FILE}`,
        `--type-prefix I`,
        `--type-style interface`,
        `--include-system-types true`,
    ].join(' ');

    try {
        execSync(`directus-ts-typegen ${args}`, {
            stdio: 'ignore',
            env: process.env,
            cwd: CONFIG.ROOT,
        });
        return true;
    } catch {
        console.warn(
            CONFIG.WARN_PREFIX,
            'Failed to fetch types from Directus instance. Is the server running? Using cached types if available'
        );
        return false;
    }
}

/**
 * Разделение файла схемы на отдельные файлы с типами
 * @param raw временная монолитная схема
 * @returns объект `interfaces`, где ключ - имя интерфейса и значение - тип
 */
function splitContent(raw: string): { interfaces: Record<string, string> } {
    /** Блоки с export `interface <Name> { ... }` */
    const blockRe = /export\s+interface\s+(\w+)\s*\{[\s\S]*?\n\}/g;

    const interfaces: Record<string, string> = {};

    let m: RegExpExecArray | null;
    while ((m = blockRe.exec(raw)) !== null) {
        const name = m[1];
        if (!name) continue;

        const block = m[0];
        interfaces[name] = block;
    }

    return { interfaces };
}

/**
 * Запись файлов
 * @param interfaces объект, где ключ - имя интерфейса и значение - тип
 */
async function writeOutputs(interfaces: Record<string, string>) {
    await rimrafTs(CONFIG.COLLECTIONS_DIR);

    const collectionExports: string[] = [];

    for (const [name, code] of Object.entries(interfaces)) {
        const base = name.replace(/^I/, '');
        const file = `${toKebabCase(base)}.ts`;

        const dir = CONFIG.COLLECTIONS_DIR;
        const rel = `./collections/${file.replace(/\.ts$/, '')}`;

        await fs.writeFile(
            path.join(dir, file),
            `${CONFIG.FILE_HEADER}\n\n` + `${code}\n`,
            'utf-8'
        );

        const line = `export type { ${name} } from '${rel}';`;
        collectionExports.push(line);
    }

    /** Индексный файл для ре-экспорта всех типов */
    const index = [
        `${CONFIG.FILE_HEADER}\n`,
        `${CONFIG.SYSTEM_COLLECTIONS}\n`,
        `${collectionExports.join('\n')}\n`,
        `/** Collections map */`,
        `${CONFIG.COLLECTION_MAP}`,
    ].join('\n');

    await fs.writeFile(path.join(CONFIG.OUT_DIR, CONFIG.INDEX_FILE), index, 'utf-8');

    console.log(CONFIG.SUCCESS_PREFIX, `Generated: ${collectionExports.length} collection(s)`);
}

async function main() {
    if (!DIRECTUS_URL || !DIRECTUS_TOKEN) {
        console.warn(
            CONFIG.WARN_PREFIX,
            'Skipping generation: DIRECTUS_URL or DIRECTUS_TYPEGEN_TOKEN missing in .env. Using existing types'
        );
        await handleFallback();
        return;
    }

    console.log(
        CONFIG.LOG_PREFIX,
        `Attempting to generate types from Directus via URL: ${styleText('cyan', DIRECTUS_URL)}`
    );

    try {
        /** Подключение к файлам */
        await ensureDir(CONFIG.OUT_DIR);
        await fs.unlink(CONFIG.TEMP_FILE).catch(() => {});

        /** Генерация */
        const isGenerated = runTypegen();
        if (!isGenerated) {
            await handleFallback();
            return;
        }

        /** Чтение временной схемы */
        const raw = await fs.readFile(CONFIG.TEMP_FILE, 'utf-8');

        /** Разделение по файлам */
        const { interfaces } = splitContent(raw);
        await writeOutputs(interfaces);
    } catch (fsOrParsingError) {
        console.error(
            CONFIG.ERR_PREFIX,
            'An error occurred during file processing:',
            fsOrParsingError
        );
        await handleFallback();
    } finally {
        /** Удаление временной схемы */
        await fs.unlink(CONFIG.TEMP_FILE).catch(() => {});
    }
}

main();
