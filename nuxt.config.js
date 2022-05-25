import { defineNuxtConfig } from '@nuxt/bridge'
import pkg from './package.json'

export default defineNuxtConfig({
  alias: {
    tslib: 'tslib/tslib.es6.js',
  },
  bridge: {
    nitro: false,
    meta: true,
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
    extendRoutes(routes, resolve) {
      routes.push({
        path: '/friends/list/:id',
        components: {
          default: resolve(__dirname, 'pages/friends/list'),
        },
      })
    },
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no',
      },
      { hid: 'description', name: 'description', content: '' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
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
  css: ['@/assets/styles/framework/framework.less'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    // Third Party
    { src: '~/plugins/thirdparty/vscrolllock.ts', ssr: false },
    { src: '~/plugins/thirdparty/clickoutside.ts' },
    { src: '~/plugins/thirdparty/filesize.ts' },
    { src: '~/plugins/thirdparty/persist.ts', ssr: false },
    { src: '~/plugins/thirdparty/multiselect.ts' },
    { src: '~/plugins/thirdparty/v-calendar.ts' },
    { src: '~/plugins/thirdparty/videoplayer.ts' },
    { src: '~/plugins/thirdparty/swiper.ts' },
    // Local
    { src: '~/plugins/local/classLoader.ts' },
    { src: '~/plugins/local/notifications.ts', mode: 'client' },
    { src: '~/plugins/local/config.ts' },
    { src: '~/plugins/local/dayjs.ts' },
    { src: '~/plugins/local/mock.ts' },
    { src: '~/plugins/local/style.ts' },
    { src: '~/plugins/local/envinfo.ts' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: {
    dirs: [
      '~/components',
      '~/components/views/chat',
      '~/components/views/navigation',
      '~/components/views/',
    ],
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: ['@nuxtjs/style-resources', '@nuxtjs/device'],

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
          xs: 360,
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
    less: './assets/styles/framework/*.less',
  },

  pwa: {
    meta: {
      mobileAppIOS: true,
      appleStatusBarStyle: 'black-translucent',
      viewportFit: 'cover',
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
      permissions: ['unlimitedStorage', 'fullscreen'],
    },
    icon: {
      source: '/static/favicon.png',
    },
    workbox: {
      // uncomment next line to test local
      // enabled: true,
      runtimeCaching: [
        {
          urlPattern: 'https://satellite.mypinata.cloud/ipfs/*',
          handler: 'StaleWhileRevalidate',
          method: 'GET',
          strategyOptions: {
            cacheName: 'ipfs',
            cacheExpiration: {
              maxAgeSeconds: 7 * 24 * 60 * 60 * 52, // 1 year
            },
          },
        },
      ],
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
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map'
      }
      config.node = {
        fs: 'empty',
        encoding: 'empty',
        child_process: 'empty',
        dgram: 'empty',
        tls: 'empty',
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
    transpile: ['libp2p'],
    babel: {
      plugins: ['lodash'],
      compact: true,
    },
  },
  publicRuntimeConfig: {
    clientName: pkg.name,
    clientVersion: pkg.version,
    textileKey: process.env.TEXTILE_API_KEY,
  },
  webpack: {
    watchOptions: {
      ignored: ['/node_modules/', '/.vscode/'],
    },
    stats: 'verbose',
  },
  // Ignore types files inside vuex modules otherwise they are included in the
  // vuex configuration
  ignore: ['**/*.test.*', 'store/*/types.ts'],
})
