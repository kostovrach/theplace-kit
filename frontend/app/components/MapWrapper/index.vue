<template>
    <ClientOnly>
        <YandexMap
            class="map"
            @click="markersIdx = null"
            :settings="{
                location: {
                    center: props.center,
                    zoom: props.zoom,
                },
                theme: props.theme,
            }"
        >
            <YandexMapDefaultSchemeLayer />
            <YandexMapDefaultFeaturesLayer />
            <YandexMapControls v-if="props.controls" :settings="{ position: 'right' }">
                <YandexMapZoomControl />
                <YandexMapGeolocationControl />
            </YandexMapControls>
            <YandexMapControls v-if="props.controls" :settings="{ position: 'left top' }">
                <YandexMapOpenMapsButton />
            </YandexMapControls>
            <YandexMapUiMarker
                v-for="(marker, idx) in props.markers"
                :key="idx"
                :settings="{
                    onClick: () => (markersIdx === idx ? (markersIdx = null) : (markersIdx = idx)),
                    coordinates: marker.point.coordinates,
                    color: 'red',
                    popup: { show: markersIdx === idx, position: 'bottom right', offset: 10 },
                }"
            >
                <template #popup>
                    <div class="map__marker">
                        <div class="map__marker-title">
                            {{ marker.title }}
                        </div>
                        <div class="map__marker-subtitle" v-if="marker.subtitle">
                            {{ marker.subtitle }}
                        </div>
                    </div>
                </template>
            </YandexMapUiMarker>
            <YandexMapSignpost
                :settings="{
                    points: props.markers.map((el) => el.point.coordinates),
                }"
            />
        </YandexMap>
    </ClientOnly>
</template>

<script setup lang="ts">
    import type { LngLat } from '@yandex/ymaps3-types';

    import {
        YandexMap,
        YandexMapDefaultSchemeLayer,
        YandexMapDefaultFeaturesLayer,
        YandexMapUiMarker,
        YandexMapControls,
        YandexMapZoomControl,
        YandexMapSignpost,
        YandexMapGeolocationControl,
        YandexMapOpenMapsButton,
    } from 'vue-yandex-maps';

    const props = withDefaults(
        defineProps<{
            markers: {
                title: string;
                subtitle: string | null;
                point: {
                    coordinates: LngLat;
                    type: string;
                };
            }[];
            theme?: 'light' | 'dark';
            center?: LngLat;
            zoom?: number;
            controls?: boolean;
        }>(),
        {
            markers: () => [],
            center: () => [50.18, 53.22],
            zoom: 8,
            theme: 'light',
            controls: false,
        }
    );

    // state
    const markersIdx = ref<number | null>(null);
</script>

<style lang="scss">
    @use '~/assets/scss/abstracts' as *;

    .map {
        $p: &;
        &__marker {
            &-title {
                font-size: rem(15);
                font-weight: $fw-semi;
            }
            &-subtitle {
                font-size: rem(13);
                opacity: 0.8;
                line-height: 1.4;
                margin-top: rem(6);
            }
        }
    }
</style>
