import Vue from 'vue'

import { EnvInfo } from '~/utilities/EnvInfo'

declare module 'vue/types/vue' {
  interface Vue {
    $envinfo: typeof EnvInfo
  }
}

declare module '@nuxt/types' {
  interface Context {
    $envinfo: typeof EnvInfo
  }
}

Vue.prototype.$envinfo = new EnvInfo()
