export function isChromium() {
    const userAgent = navigator.userAgent.toLowerCase();

    return (
        userAgent.includes('chrome') ||
        userAgent.includes('edg') ||
        userAgent.includes('opr') ||
        userAgent.includes('opera')
    );
}
