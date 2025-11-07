declare module '@nuxt/schema' {
  interface NuxtConfig {
    svgSprite?: {
      input?: string
      output?: string
      defaultSprite?: string
      elementClass?: string
      optimize?: boolean
    }
  }
  interface NuxtOptions {
    svgSprite?: {
      input?: string
      output?: string
      defaultSprite?: string
      elementClass?: string
      optimize?: boolean
    }
  }
}
