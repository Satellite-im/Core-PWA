import { EmojiUsage, UIState } from './types'
import { Alert, AlertState } from '~/libraries/ui/Alerts'

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
  allUnseenNotifications: (state: UIState): Alert[] => {
    return [...state.notifications]
      .sort((a, b) => {
        return b.at - a.at
      })
      .filter((noti) => {
        return noti.state === AlertState.UNREAD
      })
  },
  getAlertCount: (state: UIState) => {
    return state.notificationsAlertCounter
  },
  swiperSlideIndex: (state: UIState) => {
    return state.swiperSlideIndex
  },
  isFilesIndexLoading: (state: UIState): boolean => {
    return Boolean(state.filesUploadStatus)
  },
}

export default getters
