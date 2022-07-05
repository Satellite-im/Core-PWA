import { IridiumState } from './types'
import { ActionsArguments } from '~/types/store/store'
import { IridiumWalletConfig } from '~/types/iridium/manager'
import iridium from '~/libraries/Iridium/IridiumManager'
import logger from '~/plugins/local/logger'
import fileSystem from '~/libraries/Files/FilSystem'
import { mimeType } from '~/utilities/FileType'
import { FileType } from '~/libraries/Enums/enums'
import createThumbnail from '~/utilities/Thumbnail'
import blobToBase64 from '~/utilities/BlobToBase64'

export default {
  /**
   * @description Initializes the TextileManager class and retrieves the
   * Textile public key that must be shared to friends in order to receive
   * messages
   * @param param0 Action Arguments
   * @param config Textile configuration (id, pass, wallet)
   */
  async initialize(
    { commit }: ActionsArguments<IridiumState>,
    config: IridiumWalletConfig,
  ) {
    await iridium.init(config)
    commit(
      'accounts/setAccountIds',
      {
        did: iridium.connector?.id,
        peerId: iridium.connector?.peerId,
      },
      { root: true },
    )

    /* Log CSAM Consent Data for future ticket as Hogan requested */
    logger.log('CSAM Consent Data', 'CSAM', iridium.profile?.state)
    commit('setInitialized', true)
  },
  /**
   * @description upload file to ipfs
   * @param param0 Action Arguments
   * @param upload file and nsfw status
   */
  async uploadFile({}, upload: { file: File; nsfw: boolean }) {
    const { file, nsfw } = upload
    const res = await iridium.files?.upload({ file })
    const thumbnail = await createThumbnail(file, 400)

    fileSystem.createFile({
      id: res?.path,
      name: file.name,
      size: file.size,
      type: Object.values(FileType).includes(file.type as FileType)
        ? (file.type as FileType)
        : FileType.GENERIC,
      thumbnail: thumbnail ? await blobToBase64(thumbnail) : '',
      nsfw,
    })
  },
}
