import { TextileState } from './types'

const InitalTextileState = (): TextileState => ({
  initialized: false,
  conversations: {},
  conversationLoading: false,
})

export default InitalTextileState
