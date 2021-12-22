// This file is used to bind local classes to vue global context

import Vue from 'vue'
import { Config } from '~/config'
// Libs
import SolanaManager from '~/libraries/Solana/SolanaManager/SolanaManager'
import SoundManager from '~/libraries/SoundManager/SoundManager'
import WebRTC from '~/libraries/WebRTC/WebRTC'
import StreamManager from '~/libraries/WebRTC/StreamManager'
import Crypto from '~/libraries/Crypto/Crypto'
import Security from '~/libraries/Security/Security'
import { RootStore } from '~/types/store/store'
import TextileManager from '~/libraries/Textile/TextileManager'
import { Alerts } from '~/libraries/ui/Alerts'
// Utils
import Hounddog from '~/utilities/Hounddog'
import Logger from '~/utilities/Logger'
import BucketManager from '~/libraries/Textile/BucketManager';

declare module 'vue/types/vue' {
  interface Vue {
    $Config: any
    $WebRTC: WebRTC
    $StreamManager: StreamManager
    $SolanaManager: SolanaManager
    $Sounds: SoundManager
    $Crypto: Crypto
    $Security: Security
    $typedStore: RootStore
    $TextileManager: TextileManager
    $BucketManager: BucketManager
    $Hounddog: Hounddog
    $Logger: Logger
    $Alerts: Alerts
  }
}

declare module '@nuxt/types' {
  interface Context {
    $Config: any
    $WebRTC: WebRTC
    $StreamManager: StreamManager
    $SolanaManager: SolanaManager
    $Sounds: SoundManager
    $Crypto: Crypto
    $Security: Security
    $typedStore: RootStore
    $TextileManager: TextileManager
    $BucketManager: BucketManager
    $Hounddog: Hounddog
    $Logger: Logger
    $Alerts: Alerts
  }
}

Vue.prototype.$WebRTC = new WebRTC()
Vue.prototype.$StreamManager = new StreamManager()
Vue.prototype.$SolanaManager = new SolanaManager()
Vue.prototype.$Sounds = new SoundManager()
Vue.prototype.$Crypto = new Crypto()
Vue.prototype.$Security = new Security()
Vue.prototype.$TextileManager = new TextileManager()
Vue.prototype.$Config = Config
Vue.prototype.$Hounddog = new Hounddog(Vue.prototype.$store)
Vue.prototype.$Logger = new Logger(Vue.prototype.$Config.debug)
Vue.prototype.$Alerts = new Alerts()

// Add typed store alias to Vue prototype
Object.defineProperty(Vue.prototype, '$typedStore', {
  get(this: Vue) {
    return this.$store
  },
})
