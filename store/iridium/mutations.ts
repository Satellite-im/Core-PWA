import { IridiumState } from './types'
import logger from '~/plugins/local/logger'

const mutations = {
  setInitialized(state: IridiumState, initialized: boolean = true) {
    logger.log('iridium/store/mutations', 'setInitialized()', { initialized })
    state.initialized = initialized
  },
}

export default mutations
