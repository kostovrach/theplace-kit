export default defineNuxtPlugin(() => {
    const isHydrated = useState('app-hydrated', () => false);

    onNuxtReady(() => {
        isHydrated.value = true;
    });
});
