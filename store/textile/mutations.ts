import { TextileState } from './types'

const mutations = {
  textileInitialized(state: TextileState, status: boolean) {
    state.initialized = status
  },
  setMailboxId(state: TextileState, mailboxId: string) {
    state.mailboxId = mailboxId
  },
}

export default mutations
