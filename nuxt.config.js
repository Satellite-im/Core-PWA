import { defineNuxtConfig } from '@nuxt/bridge'
import pkg from './package.json'

export default defineNuxtConfig({
  bridge: {
    nitro: false,
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  ssr: false,
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  router: {
    mode: 'hash',
    middleware: ['authenticated'],
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Satellite-Absolute',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
      },
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
        href: '/static/favicon.png',
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    // Third Party
    { src: '~/plugins/thirdparty/vscrolllock.ts', ssr: false },
    { src: '~/plugins/thirdparty/clipboard.ts' },
    { src: '~/plugins/thirdparty/clickoutside.ts' },
    { src: '~/plugins/thirdparty/filesize.ts' },
    { src: '~/plugins/thirdparty/persist.ts', ssr: false },
    { src: '~/plugins/thirdparty/vue2-touch-events.ts' },
    { src: '~/plugins/thirdparty/multiselect.ts' },
    { src: '~/plugins/thirdparty/v-calendar.ts' },
    { src: '~/plugins/thirdparty/videoplayer.ts' },
    { src: '~/plugins/thirdparty/vuetify.ts' },
    // Local
    { src: '~/plugins/local/classLoader.ts' },
    { src: '~/plugins/local/notifications.ts', mode: 'client' },
    { src: '~/plugins/local/config.ts' },
    { src: '~/plugins/local/dayjs.ts' },
    { src: '~/plugins/local/mock.ts' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
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
          sm: 768,
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
    meta: {
      mobileAppIOS: true,
      appleStatusBarStyle: 'black-translucent',
    },
    manifest: {
      name: 'Satellite.im',
      short_name: 'Satellite.im',
      description: 'A decentralized chat & filesharing application',
      lang: 'en',
      useWebmanifestExtension: false,
      display: 'standalone',
      background_color: '#101016',
      theme_color: '#101016',
      orientation: 'portrait',
      prefer_related_applications: false,
    },
    icon: {
      source: '/static/favicon.png',
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
  build: {
    extend(config, ctx) {
      config.node = {
        fs: 'empty',
        encoding: 'empty',
      }
      if (process.env.ENVIRONMENT !== 'dev') {
        const testAttributes = ['data-cy']
        ctx.loaders.vue.compilerOptions = {
          modules: [
            {
              preTransformNode(astEl) {
                const { attrsMap, attrsList } = astEl
                testAttributes.forEach((attribute) => {
                  if (attrsMap[attribute]) {
                    delete attrsMap[attribute]
                    const index = attrsList.findIndex(
                      (x) => x.name === attribute,
                    )
                    attrsList.splice(index, 1)
                  }
                })
                return astEl
              },
            },
          ],
        }
      }
    },
    babel: { compact: true },
  },
  publicRuntimeConfig: {
    clientName: pkg.name,
    clientVersion: pkg.version,
    textileKey: process.env.TEXTILE_API_KEY,
  },
  webpack: {
    watchOptions: {
      ignored: '/node_modules/',
    },
    stats: 'verbose',
  },
  // Ignore types files inside vuex modules otherwise they are included in the
  // vuex configuration
  ignore: 'store/*/types.ts',
})
