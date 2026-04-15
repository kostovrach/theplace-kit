type FileSizeBase = 'SI' | 'IEC';

export function normalizeFileSize(raw: string | number, base: FileSizeBase = 'SI'): string {
    const bytes = Number(raw);
    if (!Number.isFinite(bytes) || bytes <= 0) return '0 kB';

    const step = base === 'SI' ? 1000 : 1024;

    const units = [
        { unit: 'GB', value: step ** 3 },
        { unit: 'MB', value: step ** 2 },
        { unit: 'kB', value: step },
    ];

    const match = units.find((u) => bytes >= u.value) ?? units[units.length - 1];

    if (!match) return '0 kB';

    const size = bytes / match.value;

    return `${parseFloat(size.toFixed(1))} ${match.unit}`;
}
