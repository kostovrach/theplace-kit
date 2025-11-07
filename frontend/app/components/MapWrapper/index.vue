<template>
    <ClientOnly>
        <YandexMap
            class="map"
            @click="markersIdx = null"
            @mouseleave="markersIdx = null"
            :settings="{
                location: {
                    center: [50.18, 53.22],
                    zoom: 12,
                },
            }"
        >
            <YandexMapDefaultSchemeLayer />
            <YandexMapDefaultFeaturesLayer />
            <YandexMapControls :settings="{ position: 'right' }">
                <YandexMapZoomControl />
                <YandexMapGeolocationControl />
            </YandexMapControls>
            <YandexMapControls :settings="{ position: 'left top' }">
                <YandexMapOpenMapsButton />
            </YandexMapControls>
            <!-- <YandexMapUiMarker
                v-for="(marker, idx) in markers?.addresses"
                :key="idx"
                :settings="{
                    onClick: () => (markersIdx === idx ? (markersIdx = null) : (markersIdx = idx)),
                    coordinates: marker.point.coordinates,
                    title: '',
                    color: 'blue',
                    popup: { show: markersIdx === idx, position: 'bottom right', offset: 10 },
                }"
            >
                <template #popup>
                    <div class="map__marker">
                        <div class="map__marker-head">
                            {{ marker.address }}
                        </div>
                        <div class="map__marker-body" v-if="marker.phone">
                            Телефон:
                            <a :href="`tel:${marker.phone.trim().split(' ').join('')}`">
                                {{ marker.phone }}
                            </a>
                        </div>
                        <div class="map__marker-footer" v-if="marker.working_hours">
                            {{ marker.working_hours }}
                        </div>
                    </div>
                </template>
            </YandexMapUiMarker> -->
            <!-- <YandexMapSignpost
                :settings="{
                    points: markers?.addresses.map((el) => el.point.coordinates) as LngLat[],
                }"
            /> -->
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

    // state
    const markersIdx = ref<number | null>(null);
</script>

<style lang="scss">
    @use '~/assets/scss/abstracts' as *;

    .map {
        $p: &;
    }
</style>
