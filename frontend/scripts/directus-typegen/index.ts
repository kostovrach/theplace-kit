import { execSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import { config as dotenv } from 'dotenv';
import path from 'node:path';

import { CONFIG } from './config';
import { createCLILogger, highlightLink } from '../utils/logger';

dotenv();

const log = createCLILogger();

const DIRECTUS_URL = process.env.DIRECTUS_URL;
const DIRECTUS_TOKEN = process.env.DIRECTUS_TYPEGEN_TOKEN;
const AUTO_EXPAND = process.env.DIRECTUS_AUTO_EXPAND === 'true';

function toKebabCase(name: string): string {
    return name
        .replace(/^I/, '')
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
        .toLowerCase();
}

/**
 * Гарантированное создание директории и всех отсутствующих родительских директорий.
 *
 * Если директория уже существует, операция завершается без ошибки.
 *
 * @param dir - Путь к директории, которую необходимо создать.
 *
 * @returns Promise, который завершается после создания директории.
 */
async function ensureDir(dir: string) {
    await fs.mkdir(dir, { recursive: true });
}

/**
 * Очистка целевой директории от TypeScript-файлов.
 *
 * При отсутствии целевой директории выполняется ее создание.
 * Удаляются только файлы с расширением `.ts`, остальные файлы
 * и директории остаются без изменений.
 *
 * @param dir - Путь к директории для очистки.
 *
 * @returns Promise, завершающийся после удаления найденных TypeScript-файлов.
 */
async function rimrafTs(dir: string) {
    await ensureDir(dir);
    const files = await fs.readdir(dir);
    await Promise.all(
        files.filter((file) => file.endsWith('.ts')).map((file) => fs.unlink(path.join(dir, file)))
    );
}

/**
 * Fallback-обработка при невозможности получить актуальную схему Directus.
 *
 * Проверка наличия ранее сгенерированного индексного файла.
 * При его наличии используются ранее сгенерированные типы.
 *
 * При отсутствии индексного файла выполняется создание fallback-структуры,
 * содержащей пустую схему и базовые типы и коллекции, необходимые
 * для корректной работы остального кода.
 *
 * @returns Promise, завершающийся после проверки существующих типов
 * или создания fallback-файлов.
 *
 * @throws Может возникнуть ошибка при создании директории или записи fallback-файла.
 */
async function handleFallback() {
    const indexPath = path.join(CONFIG.OUT_DIR, CONFIG.INDEX_FILE);

    try {
        /** Проверка существования индексного файла */
        await fs.stat(indexPath);
        log.info('Using previously cached types');
    } catch {
        /** Создание fallback-структуры при отсутствии индексного файла */
        log.warn(
            `Index file not found. Creating fallback types stub at: ${highlightLink(indexPath)}`
        );

        const fallbackContent = [
            `${CONFIG.FILE_HEADER}\n`,
            `${CONFIG.SYSTEM_COLLECTIONS}\n`,
            `/** Fallback Empty Schema */`,
            `export interface Schema {}`,
            `/** Collections map */`,
            `export type CollectionNameType = keyof Schema\n`,
            `/** Only regular Directus collections */`,
            `export type RegularCollectionType = RegularCollections<Schema>;\n`,
            `/** Only singleton Directus collections */`,
            `export type SingletonCollectionType = SingletonCollections<Schema>;\n`,
            `/** Regular collections (array types) */`,
            `export const regularCollections = new Set<RegularCollectionType>([]);\n`,
            `/** Singleton collections (non-array types) */`,
            `export const singletonCollections = new Set<SingletonCollectionType>([]);\n`,
        ].join('\n');

        await ensureDir(CONFIG.OUT_DIR);
        await fs.writeFile(indexPath, fallbackContent, 'utf-8');
    }
}

/**
 * Вызов CLI-генератора `directus-ts-typegen`.
 *
 * Формирование аргументов на основе конфигурации и переменных окружения,
 * запуск CLI-команды и сохранение результата во временный файл.
 *
 * При успешном завершении CLI-команды возвращается `true`.
 * При возникновении ошибки выполнения возвращается `false`, после чего
 * вызывающий код может использовать ранее сгенерированные типы
 * или fallback-структуру.
 *
 * @returns `true`, если генерация типов завершилась успешно;
 * `false`, если выполнение CLI-команды завершилось ошибкой.
 */
function runTypegen(): boolean {
    const args = [
        `--directus-host ${DIRECTUS_URL}`,
        `--directus-token ${DIRECTUS_TOKEN}`,
        `--output ${CONFIG.TEMP_FILE}`,
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
        log.warn(
            'Failed to fetch types from Directus instance. Is the server running? Using cached types if available'
        );
        return false;
    }
}

/**
 * Разделение монолитного файла схемы на отдельные интерфейсы.
 *
 * Поиск экспортируемых интерфейсов выполняется по конструкции
 * `export interface <Name> { ... }`.
 *
 * Каждый найденный интерфейс сохраняется в объекте, где ключом является
 * его имя, а значением полный исходный блок интерфейса.
 *
 * @param raw - Содержимое временного файла со сгенерированной схемой.
 *
 * @returns Объект с найденными интерфейсами.
 * Ключом является имя интерфейса, значением — его исходный код.
 */
function splitContent(raw: string): { interfaces: Record<string, string> } {
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
 * Извлечение названий regular и singleton коллекций из интерфейса `Schema`.
 *
 * Определение типа коллекции выполняется по типу ее значения:
 *
 * - `SomeType[]` - regular-коллекция;
 * - `SomeType`   - singleton-коллекция.
 *
 * Полученные названия используются для формирования типизированных
 * множеств коллекций в индексном файле.
 *
 * @param raw - Содержимое временного файла со сгенерированной схемой.
 *
 * @returns Объект с двумя множествами названий коллекций: `regularCollections` и `singletonCollections`.
 */
function extractCollections(raw: string): {
    regularCollections: Set<string>;
    singletonCollections: Set<string>;
} {
    const regularCollections = new Set<string>();
    const singletonCollections = new Set<string>();

    const schemaMatch = raw.match(/export\s+interface\s+Schema\s*\{([\s\S]*?)\n\}/);

    if (!schemaMatch?.[1]) {
        return { regularCollections, singletonCollections };
    }

    const body = schemaMatch[1];

    const fieldRe = /^\s*([a-zA-Z0-9_]+)\s*:\s*([^;]+);/gm;

    let m: RegExpExecArray | null;
    while ((m = fieldRe.exec(body)) !== null) {
        const [, name, typeStr] = m;
        if (!name || !typeStr) continue;

        const isArray = /\[\]\s*$/.test(typeStr.trim());

        if (isArray) {
            regularCollections.add(name);
        } else {
            singletonCollections.add(name);
        }
    }

    return { regularCollections, singletonCollections };
}

/**
 * Удаление ID-части из union типов связей.
 *
 * @example
 *   cover: string | DirectusFile<Schema> | null;
 *   blocks: string[] | ICaseBlock[];
 *   cases_id: number | ICase | null;
 *   item: string | ICaseMedia | ICaseText | ... | null;
 */
function stripRelationIds(code: string): string {
    // Одиночные связи (M2O и т.п.)
    // string | Type | null  =>  Type | null
    // number | Type | null  =>  Type | null
    code = code.replace(
        /(\w+)\s*:\s*(?:string|number)\s*\|\s*([A-Z][\w.<>,\s]+?)(\s*\|\s*null)?;/g,
        (_, name, type, nullPart = '') => `${name}: ${type.trim()}${nullPart || ''};`
    );

    // Массивы (O2M / M2M)
    // string[] | Type[]      =>  Type[]
    // number[] | Type[]      =>  Type[]
    // Array<string> | Type[] =>  Type[]
    code = code.replace(
        /(\w+)\s*:\s*(?:string\[\]|number\[\]|Array<string>|Array<number>)\s*\|\s*([^;]+);/g,
        '$1: $2;'
    );

    // M2A item (несколько возможных типов)
    // string | TypeA | TypeB | TypeC | null  =>  TypeA | TypeB | TypeC | null
    code = code.replace(
        /(\w+)\s*:\s*(?:string|number)\s*\|\s*((?:[A-Z][\w.<>,\s]+\s*\|\s*)+[A-Z][\w.<>,\s]+)(\s*\|\s*null)?;/g,
        (_, name, types, nullPart = '') => `${name}: ${types.trim()}${nullPart || ''};`
    );

    return code;
}

/**
 * Запись разделенных типов коллекций и индексного файла.
 *
 * Для каждого интерфейса выполняются:
 * - преобразование имени интерфейса в имя TypeScript-файла;
 * - запись интерфейса в отдельный файл;
 * - добавление re-export в индексный файл.
 *
 * Дополнительно формируются:
 * - `CollectionNameType`;
 * - `RegularCollectionType`;
 * - `SingletonCollectionType`;
 * - `regularCollections`;
 * - `singletonCollections`.
 *
 * Перед записью выполняется очистка целевой директории от ранее
 * сгенерированных TypeScript-файлов.
 *
 * @param interfaces - Объект с интерфейсами, где ключом является имя
 * интерфейса, а значением его исходный код.
 *
 * @param regularCollections - Множество названий regular-коллекций.
 *
 * @param singletonCollections - Множество названий singleton-коллекций.
 *
 * @returns Promise, завершающийся после записи всех сгенерированных файлов.
 *
 * @throws Может вернуть ошибку при очистке директории, создании файлов или записи.
 */
async function writeOutputs(
    interfaces: Record<string, string>,
    regularCollections: Set<string>,
    singletonCollections: Set<string>
) {
    await rimrafTs(CONFIG.COLLECTIONS_DIR);

    const collectionExports: string[] = [];

    for (const [name, code] of Object.entries(interfaces)) {
        const cleanedCode = AUTO_EXPAND ? stripRelationIds(code) : code;

        const base = name.replace(/^I/, '');
        const file = `${toKebabCase(base)}.ts`;

        const dir = CONFIG.COLLECTIONS_DIR;
        const rel = `./collections/${file.replace(/\.ts$/, '')}`;

        await fs.writeFile(
            path.join(dir, file),
            `${CONFIG.FILE_HEADER}\n\n` + `${cleanedCode}\n`,
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
        `export type CollectionNameType = keyof Schema\n`,
        `/** Only regular Directus collections */`,
        `export type RegularCollectionType = RegularCollections<Schema>;\n`,
        `/** Only singleton Directus collections */`,
        `export type SingletonCollectionType = SingletonCollections<Schema>;\n`,
        `/** Regular collections (array types) */`,
        `export const regularCollections = new Set<RegularCollectionType>([${[...regularCollections]
            .map((c) => `'${c}'`)
            .join(', ')}]);\n`,
        `/** Singleton collections (non-array types) */`,
        `export const singletonCollections = new Set<SingletonCollectionType>([${[
            ...singletonCollections,
        ]
            .map((c) => `'${c}'`)
            .join(', ')}]);\n`,
    ].join('\n');

    await fs.writeFile(path.join(CONFIG.OUT_DIR, CONFIG.INDEX_FILE), index, 'utf-8');

    log.success(`Generated: ${collectionExports.length} collection(s)`);
}

async function main() {
    if (!DIRECTUS_URL || !DIRECTUS_TOKEN) {
        log.warn(
            `Skipping generation: ${highlightLink('DIRECTUS_URL')} or ${highlightLink('DIRECTUS_TYPEGEN_TOKEN')} missing in .env.`,
            'Using existing types'
        );
        await handleFallback();
        return;
    }

    log.info(`Attempting to generate types from Directus via URL: ${highlightLink(DIRECTUS_URL)}`);

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
        const { regularCollections, singletonCollections } = extractCollections(raw);

        await writeOutputs(interfaces, regularCollections, singletonCollections);
    } catch (fsOrParsingError) {
        log.error('An error occurred during file processing:', fsOrParsingError);

        await handleFallback();
    } finally {
        /** Удаление временной схемы */
        await fs.unlink(CONFIG.TEMP_FILE).catch(() => {});
    }
}

main();
