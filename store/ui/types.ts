import { TranslateResult } from 'vue-i18n'
import { Glyph } from '~/types/ui/glyph'
import { MessageAttachment } from '~/libraries/Iridium/chat/types'
import { User } from '~/libraries/Iridium/users/types'

export enum GlyphMarketViewStatus {
  HOME = 'home',
  SHOP_ALL = 'shop_all',
  SHOP_DETAIL = 'shop_detail',
}

export enum ModalWindows {
  MARKETPLACE = 'marketplace',
  WALLET = 'wallet',
  CHANGELOG = 'changelog',
  GLYPH = 'glyph',
  CALL_TO_ACTION = 'callToAction',
  RENAME_FILE = 'renameFile',
  CONSENT_SCAN_CONFIRMATION = 'consentScanConfirmation',
  ERROR_NETWORK = 'errorNetwork',
}

export interface EmojiUsage {
  code: string
  count: number
  content: string
}

export enum SettingsRoutes {
  EMPTY = '',
  PERSONALIZE = 'personalize',
  PROFILE = 'profile',
  AUDIO_AND_VIDEO = 'audio & Video',
  KEY_BINDS = 'keybinds',
  ACCOUNTS_AND_DEVICES = 'accounts & Devices',
  PRIVACY_AND_PERMISSIONS = 'privacy & Permissions',
  DEVELOPER = 'developer',
  INFO = 'info',
  NOTIFICATIONS = 'notifications',
  STORAGE = 'storage',
  NETWORK = 'network',
  REALMS = 'realms',
}

export type ContextMenuItemTypes = 'primary' | 'danger' | 'disabled'

export interface ContextMenuItem {
  text: string | TranslateResult
  func: Function
  type?: ContextMenuItemTypes
}

export type Position = {
  x: number
  y: number
}

export interface UIState {
  contextMenuStatus: boolean
  contextMenuValues: ContextMenuItem[]
  quickProfile?: {
    user: User
    position: Position
    isSidebarProfile?: boolean
  }
  fullProfile?: User
  contextMenuPosition: Position
  settingsRoute: SettingsRoutes
  showSidebar: boolean
  modals: {
    [key in ModalWindows]: boolean | object
  }
  glyphModalPackId?: string
  chatbarContent: string
  chatbarFocus: boolean
  hoveredGlyphInfo: object | undefined
  glyphMarketplaceView: object
  editMessage: {
    id: string
    from: string
    payload: string
  }
  mostEmojiUsed: EmojiUsage[]
  chatImageOverlay?: MessageAttachment & { dataURL: string }
  isMobileNavVisible: boolean
  callHeight: string
}
