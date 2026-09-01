import { styleText } from 'node:util';
import path from 'node:path';

export const CONFIG = {
    /** Корень проекта */
    ROOT: process.cwd(),

    /** Шапка сгенерированных файлов */
    FILE_HEADER: '// Auto-generated. Do not edit.',

    /** Циклическая обработка svg-файлов */
    MULTIPASS: true,

    /** Директория исходных файлов */
    get SVG_DIR() {
        return path.join(CONFIG.ROOT, 'app/assets/svg');
    },

    /** Файл для записи тела спрайта */
    get OUT_SPRITE_FILE() {
        return path.join(CONFIG.ROOT, 'app/utils/sprite.ts');
    },

    /** Файл для записи типа ключа */
    get OUT_TYPE_FILE() {
        return path.join(CONFIG.ROOT, 'app/types/sprite-key.ts');
    },
} as const;
