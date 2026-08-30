/**
 * Извлекает из URL корневой домен
 * @param input `https://example.com:3000/example-path/`
 * @returns `example.com`
 */
export function normalizeUrl(input: string): string {
    if (!input || typeof input !== 'string') return '';

    const value = input.trim();
    if (!value) return '';

    try {
        const hasProtocol = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(value);
        const url = new URL(hasProtocol ? value : `http://${value}`);

        return url.hostname;
    } catch {
        return fallbackExtract(value);
    }
}

function fallbackExtract(value: string): string {
    let result = value.replace(/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//, '');

    result = result.split('/')[0]!.split('?')[0]!.split('#')[0]!;

    result = result.split(':')[0]!;

    return result;
}
