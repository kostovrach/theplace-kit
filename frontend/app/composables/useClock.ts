export function useClock(timezone = 'Europe/Samara', locale = 'ru-RU') {
    const time = ref('');

    function updateClock() {
        time.value = new Date().toLocaleTimeString(locale, {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: timezone,
            hour12: false,
        });
    }

    let intervalId: NodeJS.Timeout;

    onMounted(() => {
        updateClock();
        intervalId = setInterval(updateClock, 1000);
    });

    onUnmounted(() => {
        clearInterval(intervalId);
    });

    return { time };
}
