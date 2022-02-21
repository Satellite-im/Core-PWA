import * as actions from '~/store/ui/actions'
import { DataStateType } from '~/store/dataState/types'
import SoundManager, { Sounds } from '~/libraries/SoundManager/SoundManager'

const $Sounds = new SoundManager()

const initialState = {
  contextMenuStatus: false,
  showSidebarUsers: true,
  showSidebar: true,
  showSearchResult: false,
  showSettings: false,
  showMedia: false,
  settingsSideBar: true,
  settingsRoute: 'personalize',
  quickProfile: false,
  userProfile: {},
  contextMenuValues: [],
  contextMenuPosition: {
    x: 0,
    y: 0,
  },
  quickProfilePosition: {
    x: 0,
    y: 0,
  },
  modals: {
    changelog: false,
    createServer: false,
    error: false,
    glyph: false,
    marketplace: false,
    newfolder: false,
    quickchat: false,
    userProfile: false,
    wallet: false,
    walletMini: false,
  },
  glyphModalPack: '',
  chatbarContent: '',
  replyChatbarContent: {
    from: '',
    id: '',
    payload: '',
  },
  chatbarFocus: false,
  fullscreen: false,
  showPinned: false,
  enhancers: {
    containerWidth: 0,
    defaultHeight: '30rem',
    defaultWidth: '24rem',
    floating: false,
    position: [0, 0],
    route: 'emotes',
    show: false,
  },
  messages: [],
  unreadMessage: 0,
  isScrollOver: false,
  isTyping: {
    address: '0xc61b9bb3a7a0767e3179713f3a5c7a9aedce193c',
    last_message:
      'Ship of the imagination consciousness across the centuries network of wormholes finite but unbounded inconspicuous motes of rock and gas.',
    name: 'Phoenix Kalindi',
    profilePicture: '',
    state: 'online',
    status: 'Working on the space station',
    unreads: 4,
  },
  isReacted: false,
  activeChannel: undefined,
  settingReaction: {
    groupID: null,
    messageID: null,
    status: false,
  },
  hoveredGlyphInfo: undefined,
  glyphMarketplaceView: {
    shopId: null,
    view: 'home',
  },
  editMessage: {
    from: '',
    id: '',
    payload: '',
  },
  recentReactions: ['😰', '😡', '👍'],
  mostEmojiUsed: [],
  recentGlyphs: [],
  theme: {
    base: {
      class: '',
      name: 'default',
      text: 'Default',
      value: 'default',
    },
    flair: {
      text: 'Satellite',
      value: '#2761fd',
    },
  },
}

describe('init', () => {
  test('setMessages', () => {
    const commit = jest.fn()
    const messages = ['message 1']
    actions.default.setMessages({ commit }, messages)
    expect(commit).toHaveBeenCalledWith('setMessages', messages)
  })
  test('sendMessage', () => {
    const commit = jest.fn()
    const rootState: any = {
      accounts: {
        storePin: true,
        loading: true,
        locked: true,
        pin: '',
        pinHash: '',
        active: 'aktief',
        gasPrice: '',
        phrase: '',
        error: '',
        encryptedPhrase: '',
        registered: true,
        details: {
          name: '',
          address: '',
          status: '',
          state: 'idle',
          unreadCount: 123,
          profilePicture: '',
          badge: 'community',
          userAccount: '',
          mailboxId: '',
          textilePubkey: '',
        },
        lastVisited: '',
      },
    }
    const message = {
      user: {
        address: 'aktief',
      },
    }

    actions.default.sendMessage({ commit, rootState }, message)
    expect(commit).toHaveBeenCalledWith('sendMessage', message)
  })
  test('sendMessage with non-matching addresses', () => {
    const commit = jest.fn()
    const rootState: any = {
      accounts: {
        storePin: true,
        loading: true,
        locked: true,
        pin: '',
        pinHash: '',
        active: 'aktief',
        gasPrice: '',
        phrase: '',
        error: '',
        encryptedPhrase: '',
        registered: true,
        details: {
          name: '',
          address: '',
          status: '',
          state: 'idle',
          unreadCount: 123,
          profilePicture: '',
          badge: 'community',
          userAccount: '',
          mailboxId: '',
          textilePubkey: '',
        },
        lastVisited: '',
      },
    }
    const message = {
      user: {
        address: 'not aktief',
      },
    }

    window.HTMLMediaElement.prototype.load = () => {
      return Promise.resolve()
    }
    window.HTMLMediaElement.prototype.play = () => {
      return Promise.resolve()
    }
    window.HTMLMediaElement.prototype.pause = () => {
      return Promise.resolve()
    }

    actions.default.sendMessage({ commit, rootState }, message)
    expect(commit).toHaveBeenCalledWith('sendMessage', message)
  })
  test('setIsScrollOver', () => {
    const commit = jest.fn()
    actions.default.setIsScrollOver({ commit }, false)
    expect(commit).toHaveBeenCalledWith('setIsScrollOver', false)
  })
  test('setIsReacted', () => {
    const commit = jest.fn()
    actions.default.setIsReacted({ commit }, false)
    expect(commit).toHaveBeenCalledWith('setIsReacted', false)
  })
  test('setActiveChannel', () => {
    const commit = jest.fn()
    actions.default.setActiveChannel(
      { commit },
      {
        type: 'type',
        id: 'id',
        name: 'name',
      },
    )
    expect(commit).toHaveBeenCalledWith('setActiveChannel', {
      type: 'type',
      id: 'id',
      name: 'name',
    })
  })
  test('addReaction', () => {
    const commit = jest.fn()
    actions.default.addReaction(
      { commit },
      {
        id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
        groupID: '9876',
        replyID: 'bc23a9d531064583ace8f67dad60f6bb',
        messageID: '9876',
        emoji: '😌',
        reactor: {
          reactions: [
            'c466a48309794261b64a4f02cfcc3d64',
            'bc23a9d531064583ace8f67dad60f6bb',
            'da7588892',
            '9876',
          ],
          reactors: [true, true, true, true],
        },
      },
    )
    expect(commit).toHaveBeenCalledWith('addReaction', {
      id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
      groupID: '9876',
      replyID: 'bc23a9d531064583ace8f67dad60f6bb',
      messageID: '9876',
      emoji: '😌',
      reactor: {
        reactions: [
          'c466a48309794261b64a4f02cfcc3d64',
          'bc23a9d531064583ace8f67dad60f6bb',
          'da7588892',
          '9876',
        ],
        reactors: [true, true, true, true],
      },
    })
    expect(commit).toHaveBeenCalledWith('updateRecentReactions', '😌')
  })
  test('openSettings', () => {
    const commit = jest.fn()
    const state = { ...initialState }
    actions.default.openSettings({ commit, state })
    expect(commit).toHaveBeenCalledWith('toggleSettings', {
      show: !state.showSettings,
    })
  })
  test('setChatbarFocus', async () => {
    const dispatch = jest.fn()
    await actions.default.setChatbarFocus({ dispatch })
    expect(dispatch).toHaveBeenCalledWith('toggleChatbarFocus')
  })
  test('toggleChatbarFocus', async () => {
    const commit = jest.fn()
    const state = { ...initialState }
    await actions.default.toggleChatbarFocus({ commit, state })
    expect(commit).toHaveBeenCalledWith('setChatbarFocus', !state.chatbarFocus)
  })
})
