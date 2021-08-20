import { NuxtState } from '@nuxt/types/app'

export default {
  toggleIncomingCall(state: NuxtState, id: String) {
    state.media.incomingCall = id
  },
  setMessages(state: NuxtState, messages: any[]) {
    state.media.messages = messages
  },
  sendMessage(state: NuxtState, message: any) {
    const messages: any[] = [...state.media.messages]
    const lastIndex = messages.length - 1
    const lastMessage = messages[lastIndex]
    if (lastMessage) {
      const messageContent = {
        id: Date.now(),
        at: Date.now(),
        type: 'text',
        payload: message.value,
      }
      if (lastMessage.from === message.user.address) {
        state.media.messages[lastIndex].messages.push({
          ...messageContent,
        })
      } else {
        state.media.messages.push({
          id: Date.now(),
          at: Date.now(),
          type: 'group',
          from: message.user.address,
          to: '0x07ee55aa48bb72dcc6e9d78256648910de513eca',
          messages: [
            {
              ...messageContent,
            },
          ],
        })
      }
    }
  },
}
