import Vue from 'vue'

import { Config } from '~/config'

declare module '@nuxt/types' {
  interface Context {
    $SatelliteConfig: typeof Config
  }
}

Vue.prototype.$SatelliteConfig = Config
