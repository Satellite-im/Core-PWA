import Vue from 'vue'
import { Bucket } from '~/libraries/Files/remote/textile/Bucket'
import { ActionsArguments } from '~/types/store/store'
import { TextileConfig } from '~/types/textile/manager'
import { BucketState } from '~/store/bucket/types'

export default {
  /**
   * @description Initializes the TextileManager class and retrieves the
   * Textile public key that must be shared to friends in order to receive
   * messages
   * @param param0 Action Arguments
   * @param config Textile configuration (id, pass, wallet)
   */
  async initialize(
    { commit }: ActionsArguments<BucketState>,
    config: TextileConfig,
  ) {
    const $Bucket: Bucket = Vue.prototype.$Bucket

    await $Bucket.init(config)
    commit('updateFileSystem', $Bucket.fileSystem)
    commit('bucketInitialized', true)
  },
}
