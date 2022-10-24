import { EmojiUsage, UIState } from './types'

const getters = {
  getSortedMostUsedEmojis: (state: UIState): EmojiUsage[] => {
    return [...state.mostEmojiUsed].sort((a, b) => b.count - a.count)
  },
  getSortedRecentGlyphs: (state: UIState) => {
    return [...state.recentGlyphs].sort((a, b) => b.count - a.count)
  },
}

export default getters
