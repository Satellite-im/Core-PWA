// This file is used to bind local classes to vue global context

import Vue from 'vue'
import WebRTC from '~/utilities/WebRTC/WebRTC'
import SolanaManager from '~/utilities/SolanaManager/SolanaManager'

declare module 'vue/types/vue' {
  interface Vue {
    $WebRTC: typeof WebRTC
    $SolanaManager: typeof SolanaManager
  }
}

declare module '@nuxt/types' {
  interface Context {
    $WebRTC: typeof WebRTC
    $SolanaManager: typeof SolanaManager
  }
}

Vue.prototype.$WebRTC = new WebRTC()
Vue.prototype.$SolanaManager = new SolanaManager()
