// This file is used to bind local classes to vue global context

import Vue from 'vue'
import { Config } from '~/config'
// Libs
import SolanaManager from '~/libraries/Solana/SolanaManager/SolanaManager'
import SoundManager from '~/libraries/SoundManager/SoundManager'
import Crypto from '~/libraries/Crypto/Crypto'
import Security from '~/libraries/Security/Security'
import { RootStore } from '~/types/store/store'
// Utils
import Logger from '~/utilities/Logger'
import BlockchainClient from '~/libraries/BlockchainClient'
import SolanaAdapter from '~/libraries/BlockchainClient/adapters/SolanaAdapter'

declare module 'vue/types/vue' {
  interface Vue {
    $Config: typeof Config
    $SolanaManager: SolanaManager
    $Sounds: SoundManager
    $Crypto: Crypto
    $Security: Security
    $typedStore: RootStore
    $Logger: Logger
  }
}

declare module '@nuxt/types' {
  interface Context {
    $Config: typeof Config
    $SolanaManager: SolanaManager
    $Sounds: SoundManager
    $Crypto: Crypto
    $Security: Security
    $typedStore: RootStore
    $Logger: Logger
  }
}

Vue.prototype.$SolanaManager = new SolanaManager()
Vue.prototype.$Sounds = new SoundManager()
Vue.prototype.$Crypto = new Crypto()
Vue.prototype.$Security = new Security()
Vue.prototype.$Config = Config
Vue.prototype.$Logger = new Logger(Vue.prototype.$Config.debug)
Vue.prototype.$BlockchainClient = BlockchainClient.getInstance()
// Add typed store alias to Vue prototype
Object.defineProperty(Vue.prototype, '$typedStore', {
  get(this: Vue) {
    return this.$store
  },
})
