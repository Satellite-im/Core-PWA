import { PrerequisiteState } from './types'
import getInitialState from './state'

const mutations = {
  setAccountsReady(state: PrerequisiteState, accountsReady: boolean) {
    state.accountsReady = accountsReady
  },
  setP2PReady(state: PrerequisiteState, p2pReady: boolean) {
    state.p2pReady = p2pReady
  },
  setTextileReady(state: PrerequisiteState, textileReady: boolean) {
    state.textileReady = textileReady
  },
  resetState(state: PrerequisiteState) {
    const initialState = getInitialState()
    state.accountsReady = initialState.accountsReady
    state.p2pReady = initialState.p2pReady
    state.textileReady = initialState.textileReady
  },
}

export default mutations
