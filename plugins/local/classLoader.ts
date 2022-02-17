// This file is used to bind local classes to vue global context

import Vue from 'vue'
import { Config } from '~/config'
// Libs
import SolanaManager from '~/libraries/Solana/SolanaManager/SolanaManager'
import SoundManager from '~/libraries/SoundManager/SoundManager'
import WebRTC from '~/libraries/WebRTC/WebRTC'
import Crypto from '~/libraries/Crypto/Crypto'
import Security from '~/libraries/Security/Security'
import { RootStore } from '~/types/store/store'
import TextileManager from '~/libraries/Textile/TextileManager'
import { Alerts } from '~/libraries/ui/Alerts'
import { Bucket } from '~/libraries/Files/remote/textile/Bucket'
import { TextileFS } from '~/libraries/Files/TextileFS'
// Utils
import Hounddog from '~/utilities/Hounddog'
import Logger from '~/utilities/Logger'
import BucketManager from '~/libraries/Textile/BucketManager'
import Cursor from '~/libraries/ui/Cursor'

declare module 'vue/types/vue' {
  interface Vue {
    $Config: any
    $WebRTC: WebRTC
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
    $Bucket: Bucket
    $FileSystem: TextileFS
  }
}

declare module '@nuxt/types' {
  interface Context {
    $Config: any
    $WebRTC: WebRTC
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
    $Bucket: Bucket
    $FileSystem: TextileFS
  }
}

Vue.prototype.$WebRTC = new WebRTC()
Vue.prototype.$SolanaManager = new SolanaManager()
Vue.prototype.$Sounds = new SoundManager()
Vue.prototype.$Crypto = new Crypto()
Vue.prototype.$Security = new Security()
Vue.prototype.$TextileManager = new TextileManager()
Vue.prototype.$Config = Config
Vue.prototype.$Hounddog = new Hounddog(Vue.prototype.$store)
Vue.prototype.$Logger = new Logger(Vue.prototype.$Config.debug)
Vue.prototype.$Alerts = new Alerts()
Vue.prototype.$Bucket = new Bucket()
Vue.prototype.$FileSystem = new TextileFS()

// Add typed store alias to Vue prototype
Object.defineProperty(Vue.prototype, '$typedStore', {
  get(this: Vue) {
    return this.$store
  },
})
