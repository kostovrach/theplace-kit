import { optimize } from 'svgo';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import fg from 'fast-glob';

import { CONFIG } from './config';
import { createCLILogger, highlightLink } from '../utils/logger';

const COLOR_RE = /(fill|stroke)=["'](#000000|#000|black)["']/gi;
const EMPTY_SPRITE = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true"></svg>';

const log = createCLILogger();

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
 * Обработка SVG-файла и преобразование его в SVG-символ для спрайта.
 *
 * Последовательно выполняет следующие операции:
 *
 * - Чтение содержимого SVG-файла;
 * - Замена `fill` и `stroke` со значениями `#000000` / `#000` / `black` на `currentColor`;
 * - SVGO Оптимизация;
 * - Извлечение `viewBox` из корневого элемента;
 * - Удаление корневого `<svg>` и `</svg>`;
 * - Заключение полученного содержимого в элемент `<symbol>` с указанным идентификатором.
 *
 * Если исходный SVG не содержит `viewBox`, используется значение
 * `0 0 24 24` по умолчанию.
 *
 * @param filePath - Абсолютный путь к исходному SVG-файлу.
 * @param id - Уникальный идентификатор, который будет назначен сгенерированному элементу `<symbol>`.
 *
 * @returns Содержимое SVG-элемента `<symbol>` в виде строки.
 *
 * @throws Может пробросить ошибку чтения файла или ошибку, возникшую во время обработки SVGO.
 */
async function processSvg(filePath: string, id: string): Promise<string> {
    let content = await fs.readFile(filePath, 'utf-8');

    content = content.replace(COLOR_RE, '$1="currentColor"');

    const { data } = optimize(content, {
        multipass: CONFIG.MULTIPASS,
        plugins: ['preset-default', 'removeDimensions'],
    });

    const viewBoxMatch = data.match(/viewBox=["']([^"']+)["']/i);
    const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';

    const inner = data
        .replace(/<svg[^>]*>/i, '')
        .replace(/<\/svg>/i, '')
        .trim();

    return `<symbol id="${id}" viewBox="${viewBox}">${inner}</symbol>`;
}

/**
 * Формирование ID иконки на основе ее относительного пути.
 *
 * Расширение `.svg` удаляется, а разделители директорий `/` заменяются на `-`.
 *
 * @example
 * `toIconId('ui/light/buttons/arrow.svg')`
 * // 'ui-light-buttons-arrow'
 *
 * @param relativePath - Относительный путь к SVG-файлу относительно директории исходных иконок.
 *
 * @returns Строковый идентификатор иконки, пригодный для
 * использования в качестве значения атрибута `id` элемента `<symbol>`.
 */
function toIconId(relativePath: string): string {
    return relativePath.replace(/\.svg$/i, '').replace(/\//g, '-');
}

/**
 * Обработка ошибок.
 *
 * Если ранее сгенерированные файлы спрайта и TypeScript-типа существуют,
 * они сохраняются и используются повторно.
 *
 * Если хотя бы один из файлов отсутствует, функция создаёт fallback-файлы:
 *
 * - пустой SVG-спрайт;
 * - тип `SpriteKey` с произвольным строковым значением.
 *
 * Это нужно для сохранения ожидаемой структуры сгенерированных файлов
 * при невозможности выполнить полноценную генерацию.
 *
 * @returns Promise, который завершается после проверки существующих
 * файлов или создания fallback-файлов.
 *
 * @throws Может пробросить ошибку при создании директорий или записи fallback-файлов.
 */
async function handleFallback() {
    try {
        await Promise.all([fs.stat(CONFIG.OUT_SPRITE_FILE), fs.stat(CONFIG.OUT_TYPE_FILE)]);

        log.info('Using previously generated sprite');
    } catch {
        log.info('Creating fallback stubs');

        const sprite = `${CONFIG.FILE_HEADER}\n` + `export const sprite = \`${EMPTY_SPRITE}\`;\n`;
        const type = `${CONFIG.FILE_HEADER}\n` + `export type SpriteKey = string;\n`;

        await Promise.all([
            ensureDir(path.dirname(CONFIG.OUT_SPRITE_FILE)),
            ensureDir(path.dirname(CONFIG.OUT_TYPE_FILE)),
        ]);

        await Promise.all([
            fs.writeFile(CONFIG.OUT_SPRITE_FILE, sprite, 'utf-8'),
            fs.writeFile(CONFIG.OUT_TYPE_FILE, type, 'utf-8'),
        ]);

        log.success('Written empty sprite stub (0 icons)');
    }
}

/**
 * Чтение всех SVG-файлов в директории исходников.
 *
 * Поиск выполняется рекурсивно во всех вложенных директориях.
 * В результат попадают только файлы с расширением `.svg`.
 *
 * @returns Объект с массивом абсолютных путей к найденным SVG-файлам.
 *
 * @throws Может пробросить ошибку файловой системы или ошибку,
 * возникшую во время выполнения поиска.
 */
async function readFiles() {
    const files = await fg('**/*.svg', {
        cwd: CONFIG.SVG_DIR,
        absolute: true,
        onlyFiles: true,
    });

    return { files };
}

/**
 * Обаботка SVG-файлов и формирование выходных файлов спрайта.
 *
 * Для каждого SVG:
 * - Вычисляется путь относительно директории исходников;
 * - На основе пути формируется ID иконки;
 * - SVG преобразуется в `<symbol>`;
 * - ID добавляется в список допустимых ключей.
 *
 * После обработки всех файлов:
 * - символы объединяются в единый SVG-спрайт;
 * - ID сортируются;
 * - на их основе формируется `SpriteKey`;
 * - оба результата записываются в соответствующие выходные файлы.
 *
 * Если SVG-файлы не найдены, создаётся или используется fallback
 * посредством {@link handleFallback}.
 *
 * @param files - Массив абсолютных путей к найденным SVG-файлам.
 *
 * @returns Promise, который завершается после генерации и записи выходных файлов.
 *
 * @throws Может пробросить ошибки чтения или обработки SVG, создания директорий или записи выходных файлов.
 */
async function writeOutputs(files: string[]) {
    if (files.length === 0) {
        log.warn(`SVG files not found in ${highlightLink(CONFIG.SVG_DIR)}`);

        await handleFallback();
        return;
    }

    const symbols: string[] = [];
    const names: string[] = [];

    for (const file of files) {
        const relative = path.relative(CONFIG.SVG_DIR, file).replace(/\\/g, '/');
        const id = toIconId(relative);

        names.push(id);
        symbols.push(await processSvg(file, id));
    }

    names.sort();

    const sprite = [
        '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true">',
        ...symbols,
        '</svg>',
    ].join('');

    const keyType = names.map((key) => `'${key}'`).join(' | ');

    const spriteOutput =
        `${CONFIG.FILE_HEADER}\n` + `export const sprite = \`${sprite.replace(/`/g, '\\`')}\`;`;

    const typeOutput = `${CONFIG.FILE_HEADER}\n` + `export type SpriteKey = ${keyType};`;

    await Promise.all([
        ensureDir(path.dirname(CONFIG.OUT_SPRITE_FILE)),
        ensureDir(path.dirname(CONFIG.OUT_TYPE_FILE)),
    ]);

    await Promise.all([
        fs.writeFile(CONFIG.OUT_SPRITE_FILE, spriteOutput, 'utf-8'),
        fs.writeFile(CONFIG.OUT_TYPE_FILE, typeOutput, 'utf-8'),
    ]);

    log.success(`Generated ${names.length} icon(s)`);
}

/**
 * Запуск процесса генерации
 */
async function main() {
    log.info(`Attempting to generate sprite from ${highlightLink(CONFIG.SVG_DIR)}`);

    try {
        const { files } = await readFiles();

        await writeOutputs(files);
    } catch (err) {
        log.error('Generation failed:', err);

        await handleFallback();
    }
}

main();
