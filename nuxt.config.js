import pkg from './package.json'

export default {
  ssr: false,
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Satellite-Absolute',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/png',
        href: '/static/favicon_16.png',
        sizes: '16x16',
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: '/static/favicon_32.png',
        sizes: '32x32',
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: '/static/favicon.png',
        sizes: '96x96',
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: '/static/favicon_32.png',
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    // Third Party
    { src: '~/plugins/thirdparty/fontawesome.ts' },
    { src: '~/plugins/thirdparty/vscrolllock.ts', ssr: false },
    { src: '~/plugins/thirdparty/clipboard.ts' },
    { src: '~/plugins/thirdparty/clickoutside.ts' },
    { src: '~/plugins/thirdparty/filesize.ts' },
    { src: '~/plugins/thirdparty/persist.ts', ssr: false },
    { src: '~/plugins/thirdparty/vue2-touch-events.ts' },
    { src: '~/plugins/thirdparty/vue-js-modal.ts'},
    // Local
    { src: '~/plugins/local/notifications.ts' },
    { src: '~/plugins/local/config.ts' },
    { src: '~/plugins/local/dayjs.ts' },
    { src: '~/plugins/local/mock.ts' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // '@nuxtjs/ngrok',
    '@nuxtjs/style-resources',
    '@nuxtjs/device',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    'nuxt-i18n',
    '@nuxtjs/toast',
    '@nuxtjs/pwa',
    [
      'nuxt-mq',
      {
        // Default breakpoint for SSR
        defaultBreakpoint: 'sm',
        breakpoints: {
          sm: 450,
          md: 1250,
          lg: Infinity,
        },
      },
    ],
  ],

  toast: {
    position: 'top-center',
    duration: 1000,
    containerClass: 'toasty-container',
  },

  styleResources: {
    less: './assets/styles/vars/*.less',
  },

  pwa: {
    manifest: {
      name: 'Satellite.im',
      short_name: 'Satellite.im',
      description: 'A decentralized chat & filesharing application',
      lang: 'en',
      useWebmanifestExtension: false,
      display: 'standalone',
      background_color: '#16161e',
      theme_color: '#16161e',
      orientation: 'portrait',
      prefer_related_applications: false,
    },
    icon: {
      source: '/static/icon.png',
    },
  },

  i18n: {
    defaultLocale: 'en',
    langDir: '~/locales',
    locales: [
      {
        code: 'en',
        file: 'en-US.js',
      },
    ],
    vueI18n: {
      fallbackLocale: 'en',
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
  publicRuntimeConfig: {
    clientName: pkg.name,
    clientVersion: pkg.version,
  },
}
