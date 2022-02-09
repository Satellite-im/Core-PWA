import Vue from 'vue'
import { Bucket } from '~/libraries/Files/remote/textile/Bucket'
import { ActionsArguments } from '~/types/store/store'
import { TextileConfig } from '~/types/textile/manager'
import { BucketState } from '~/store/bucket/types'
import { Fil } from '~/libraries/Files/Fil'

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
    commit('bucketInitialized', true)

    // add dummy data
    const mockFileData = {
      _name: 'TestFile.png',
      _descrption: 'Test file description',
      hash: 'bafkreichz6yyvllpr6akxiqahvvmipf4qbumfa5srfgvventyxdbwrbaga',
    }

    const file = new Fil(...Object.values(mockFileData))

    $Bucket.fileSystem.addChild(file)
    $Bucket.fileSystem.createDirectory('dir')

    commit('updateFileSystem', $Bucket.fileSystem)
  },
}
