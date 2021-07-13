// This file is used to bind local classes to vue global context

import Vue from 'vue'
import WebRTC from '~/utilities/WebRTC/WebRTC'

declare module 'vue/types/vue' {
  interface Vue {
    $WebRTC: typeof WebRTC
  }
}

declare module '@nuxt/types' {
  interface Context {
    $WebRTC: typeof WebRTC
  }
}

Vue.prototype.$WebRTC = new WebRTC()
