// This file is used to bind local classes to vue global context

import Vue from 'vue'
import SolanaManager from '~/utilities/SolanaManager/SolanaManager'
import SoundManager from '~/utilities/SoundManager/SoundManager'
import WebRTC from '~/utilities/WebRTC/WebRTC'

declare module 'vue/types/vue' {
  interface Vue {
    $WebRTC: typeof WebRTC
    $SolanaManager: typeof SolanaManager
    $Sounds: SoundManager
  }
}

declare module '@nuxt/types' {
  interface Context {
    $WebRTC: typeof WebRTC
    $SolanaManager: typeof SolanaManager
    $Sounds: SoundManager
  }
}

Vue.prototype.$WebRTC = new WebRTC()
Vue.prototype.$SolanaManager = new SolanaManager()
Vue.prototype.$Sounds = new SoundManager()
