import emblaCarouselVue from 'embla-carousel-vue';
import type { EmblaOptionsType } from 'embla-carousel';

export const useEmblaCarousel = (options?: EmblaOptionsType) => {
    return emblaCarouselVue(options || {});
};
