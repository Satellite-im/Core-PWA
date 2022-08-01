import { EmojiUsage, UIState } from './types'
import { Alert, AlertState } from '~/libraries/ui/Alerts'

const getters = {
  getSortedMostUsedEmojis: (state: UIState): EmojiUsage[] => {
    return [...state.mostEmojiUsed].sort((a, b) => b.count - a.count)
  },
  getSortedRecentGlyphs: (state: UIState) => {
    return [...state.recentGlyphs].sort((a, b) => b.count - a.count)
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
}

export default getters
