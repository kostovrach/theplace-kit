import { sprite } from '~/utils/sprite';

export default defineNuxtPlugin(() => {
    const container = document.createElement('div');

    container.innerHTML = sprite;
    container.id = 'sprite';

    container.style.display = 'none';
    container.style.position = 'absolute';
    container.style.width = '0';
    container.style.height = '0';
    container.style.overflow = 'hidden';

    container.ariaHidden = 'true';

    document.body.append(container);
});
