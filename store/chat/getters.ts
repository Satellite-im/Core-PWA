import { ChatState } from './types'
import { RootState } from '~/types/store/store'

const getters = {
  getFiles: (
    state: ChatState,
    getters: any,
    rootState: RootState,
    rootGetters: any,
  ) => {
    const address = rootGetters?.['conversation/recipient']?.address ?? ''
    return state.files?.[address] ?? []
  },
}

export default getters
