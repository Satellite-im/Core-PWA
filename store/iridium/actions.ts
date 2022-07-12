import { IridiumState } from './types'
import { ActionsArguments } from '~/types/store/store'
import { IridiumWalletConfig } from '~/types/iridium/manager'
import iridium from '~/libraries/Iridium/IridiumManager'
import logger from '~/plugins/local/logger'

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
   * @description Initializes the TextileManager class and retrieves the
   * Textile public key that must be shared to friends in order to receive
   * messages
   * @param param0 Action Arguments
   * @param config Textile configuration (id, pass, wallet)
   */
  async initializFromEntropy(
    { commit }: ActionsArguments<IridiumState>,
    entropy: Uint8Array,
  ) {
    await iridium.initFromEntropy(entropy)
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
}
