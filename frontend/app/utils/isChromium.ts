/**
 * Проверка, запущен ли браузер на Chromium-движке
 *
 * @returns `true`, если браузер Chrome / Edge / Opera
 */
export function isChromium() {
    const userAgent = navigator.userAgent.toLowerCase();

    return (
        userAgent.includes('chrome') ||
        userAgent.includes('edg') ||
        userAgent.includes('opr') ||
        userAgent.includes('opera')
    );
}
