import { EmojiUsage, UIState } from './types'

const getters = {
  getSortedMostUsedEmojis: (state: UIState): EmojiUsage[] => {
    return [...state.mostEmojiUsed].sort((a, b) => b.count - a.count)
  },
  getSortedRecentGlyphs: (state: UIState) => {
    return [...state.recentGlyphs].sort((a, b) => b.count - a.count)
  },
  showSidebar: (state: UIState) => {
    return state.showSidebar
  },
  swiperSlideIndex: (state: UIState) => {
    return state.swiperSlideIndex
  },
  isFilesIndexLoading: (state: UIState): boolean => {
    return Boolean(state.filesUploadStatus)
  },
}

export default getters
