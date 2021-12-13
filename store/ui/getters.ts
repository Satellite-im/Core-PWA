import { UIState } from './types'

const getters = {
  getSortedMostUsedEmojis: (state: UIState) => {
    const emojis = [...state.mostEmojiUsed].sort((a, b) => b.count - a.count)
    return emojis
  },
}

export default getters
