import { Flairs, GlyphMarketViewStatus, Themes } from './types'
import * as getters from '~/store/ui/getters'
import InitialUIState from '~/store/ui/state'

describe.skip('init', () => {
  let inst: any

  beforeEach(() => {
    inst = getters.default
  })

  it('should return the isFilesIndexLoading property of the initial state', () => {
    const result: any = inst.isFilesIndexLoading(InitialUIState(), {}, {}, [])
    expect(result).toBeTruthy()
    expect(result).toMatchSnapshot()
  })

  it('should return the showSidebar property of the initial state', () => {
    const result: any = inst.showSidebar(InitialUIState())
    expect(result).toBeTruthy()
    expect(result).toMatchSnapshot()
  })

  it('should not return the showSidebar property of the initial state', () => {
    //  An error will be thrown because the arguments passed into the constructor is not proper
    const result: any = inst.showSidebar({})
    expect(result).not.toBeTruthy()
  })

  it('should return the swiperSlideIndex property of the initial state', () => {
    const result: any = inst.swiperSlideIndex(InitialUIState())
    expect(result).toBe(0)
    expect(result).toMatchSnapshot()
  })

  it('should not return the swiperSlideIndex property of the initial state', () => {
    //  An error will be thrown because the arguments passed into the constructor is not proper
    const result: any = inst.swiperSlideIndex({})
    expect(result).toBeUndefined()
    expect(result).not.toBeTruthy()
  })

  test('sort most recent glyphs', () => {
    const localState = {
      contextMenuStatus: false,
      showSidebarUsers: true,
      showSidebar: true,
      showSearchResult: false,
      showSettings: false,
      settingsSideBar: true,
      quickProfile: false,
      userProfile: {},
      contextMenuValues: [],
      contextMenuPosition: { x: 0, y: 0 },
      quickProfilePosition: { x: 0, y: 0 },
      modals: {
        newfolder: false,
        createServer: false,
        marketplace: false,
        wallet: false,
        quickchat: false,
        walletMini: false,
        error: false,
        changelog: false,
        glyph: false,
        userProfile: false,
      },
      glyphModalPack: '',
      chatbarContent: '',
      replyChatbarContent: { id: '', from: '', payload: '' },
      chatbarFocus: false,
      fullscreen: false,
      showPinned: false,
      enhancers: {
        show: false,
        floating: false,
        position: [0, 0],
        defaultWidth: '24rem',
        defaultHeight: '30rem',
        containerWidth: 0,
        route: 'emotes',
      },
      messages: [],
      unreadMessage: 0,
      isScrollOver: false,
      isTyping: false,
      isReacted: false,
      activeChannel: undefined,
      settingReaction: { status: false, groupID: null, messageID: null },
      hoveredGlyphInfo: undefined,
      glyphMarketplaceView: {
        view: GlyphMarketViewStatus.HOME,
        shopId: null,
      },
      editMessage: { id: '', from: '', payload: '' },
      recentReactions: ['👍', '😂', '♥️'],
      mostEmojiUsed: [],
      recentGlyphs: [
        // Order is 1, 3, 2.
        {
          pack: {
            name: 'Count 1',
            description: 'Short description can go here. Lorem ipsum.',
            artist: 'Dina Brodsky',
            id: '0903',
            stickerURLs: [
              'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/hawk.webp',
              'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/ducklings.webp',
              'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/owl.webp',
              'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/penguins.webp',
              'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/robin.webp',
              'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/stork.webp',
              'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/yellow_bird.webp',
            ],
          },
          url: 'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/ducklings.webp',
          count: 1,
        },
        {
          pack: {
            name: 'Count 3',
            description: 'Short description can go here. Lorem ipsum.',
            artist: 'John Treanor',
            id: '0123',
            stickerURLs: [
              'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/AHH.gif',
              'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/AHHcloseup.gif',
              'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Coy_02.gif',
              'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Cry.gif',
              'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Cry2.gif',
              'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Laugh.webp',
              'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Luv.gif',
              'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Luv_02.gif',
              'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Sad3.gif',
              'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsDownNew.gif',
              'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsUP.gif',
              'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsUPNew.gif',
            ],
          },
          url: 'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Coy_02.gif',
          count: 3,
        },
        {
          pack: {
            name: 'Count 2',
            description: 'Short description can go here. Lorem ipsum.',
            artist: 'John Treanor',
            id: '0123',
            stickerURLs: [
              'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/AHH.gif',
              'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/AHHcloseup.gif',
              'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Coy_02.gif',
              'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Cry.gif',
              'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Cry2.gif',
              'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Laugh.webp',
              'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Luv.gif',
              'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Luv_02.gif',
              'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Sad3.gif',
              'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsDownNew.gif',
              'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsUP.gif',
              'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsUPNew.gif',
            ],
          },
          url: 'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsUP.gif',
          count: 2,
        },
      ],
      theme: {
        base: Themes[0],
        flair: Flairs[0],
      },
    }
    const result: any = inst.getSortedRecentGlyphs(localState)
    expect(result).toEqual([
      // Order is 3,2,1
      {
        pack: {
          name: 'Count 3',
          description: 'Short description can go here. Lorem ipsum.',
          artist: 'John Treanor',
          id: '0123',
          stickerURLs: [
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/AHH.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/AHHcloseup.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Coy_02.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Cry.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Cry2.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Laugh.webp',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Luv.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Luv_02.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Sad3.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsDownNew.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsUP.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsUPNew.gif',
          ],
        },
        url: 'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Coy_02.gif',
        count: 3,
      },
      {
        pack: {
          name: 'Count 2',
          description: 'Short description can go here. Lorem ipsum.',
          artist: 'John Treanor',
          id: '0123',
          stickerURLs: [
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/AHH.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/AHHcloseup.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Coy_02.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Cry.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Cry2.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Laugh.webp',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Luv.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Luv_02.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Sad3.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsDownNew.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsUP.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsUPNew.gif',
          ],
        },
        url: 'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsUP.gif',
        count: 2,
      },
      {
        pack: {
          name: 'Count 1',
          description: 'Short description can go here. Lorem ipsum.',
          artist: 'Dina Brodsky',
          id: '0903',
          stickerURLs: [
            'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/hawk.webp',
            'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/ducklings.webp',
            'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/owl.webp',
            'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/penguins.webp',
            'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/robin.webp',
            'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/stork.webp',
            'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/yellow_bird.webp',
          ],
        },
        url: 'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/ducklings.webp',
        count: 1,
      },
    ])
    expect(result).toMatchSnapshot()
  })
  test('sort most used emojis', () => {
    const localState = {
      contextMenuStatus: false,
      showSidebarUsers: true,
      showSidebar: true,
      showSearchResult: false,
      showSettings: false,
      settingsSideBar: true,
      quickProfile: false,
      userProfile: {},
      contextMenuValues: [],
      contextMenuPosition: { x: 0, y: 0 },
      quickProfilePosition: { x: 0, y: 0 },
      modals: {
        newfolder: false,
        createServer: false,
        marketplace: false,
        wallet: false,
        quickchat: false,
        walletMini: false,
        error: false,
        changelog: false,
        glyph: false,
        userProfile: false,
      },
      glyphModalPack: '',
      chatbarContent: '',
      replyChatbarContent: { id: '', from: '', payload: '' },
      chatbarFocus: false,
      fullscreen: false,
      showPinned: false,
      enhancers: {
        show: false,
        floating: false,
        position: [0, 0],
        defaultWidth: '24rem',
        defaultHeight: '30rem',
        containerWidth: 0,
        route: 'emotes',
      },
      messages: [],
      unreadMessage: 0,
      isScrollOver: false,
      isTyping: false,
      isReacted: false,
      activeChannel: undefined,
      settingReaction: { status: false, groupID: null, messageID: null },
      hoveredGlyphInfo: undefined,
      glyphMarketplaceView: {
        view: GlyphMarketViewStatus.HOME,
        shopId: null,
      },
      editMessage: { id: '', from: '', payload: '' },
      recentReactions: ['👍', '😂', '♥️'],
      mostEmojiUsed: [
        {
          code: 'thumbup',
          content: '👍',
          count: 1,
        },
        {
          code: 'flag_id',
          content: '🇮🇩',
          count: 3,
        },
        {
          code: 'pray',
          content: '🙏 ',
          count: 2,
        },
      ],
      recentGlyphs: [],
      theme: {
        base: Themes[0],
        flair: Flairs[0],
      },
    }
    const result: any = inst.getSortedMostUsedEmojis(localState)
    expect(result).toEqual([
      // Order is 3,2,1
      {
        code: 'flag_id',
        content: '🇮🇩',
        count: 3,
      },
      {
        code: 'pray',
        content: '🙏 ',
        count: 2,
      },
      {
        code: 'thumbup',
        content: '👍',
        count: 1,
      },
    ])
    expect(result).toMatchSnapshot()
  })
  test('get all unseen notifications', () => {
    const localState = {
      contextMenuStatus: false,
      showSidebarUsers: true,
      showSidebar: true,
      notifications: [
        {
          _id: '01g2y9d6499169rzs5etrff48w',
          _mod: 1652431427721842400,
          at: 1652431426842,
          content: {
            description: 'New DM',
            title: 'Notification',
          },
          from: 'Andre2',
          id: '69c1ad1d-37e9-4ff5-b929-de5509512a11',
          state: 'UNREAD',
          type: 'Direct Message',
        },
        {
          _id: '01g2ya7w44h4c5mm4bgyedkrvy',
          _mod: 1652432302212590600,
          at: 1652432301322,
          content: {
            description: 'New DM',
            title: 'Notification',
          },
          from: 'Andre2',
          id: '62fceb8d-60a5-4434-92e8-c07f52f9e8e6',
          state: 'UNREAD',
          type: 'Direct Message',
        },
      ],
      showSearchResult: false,
      showSettings: false,
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
        callToAction: false,
        changelog: false,
        createServer: false,
        creategroup: false,
        crop: false,
        error: false,
        glyph: false,
      },
      groupInvite: {
        isOpen: false,
        marketplace: false,
        newfolder: false,
        quickchat: false,
        renameFile: false,
        userProfile: false,
        wallet: false,
        walletMini: false,
        glyphModalPack: '',
        chatbarContent: '',
      },
      replyChatbarContent: {
        from: '',
        id: '',
        payload: '',
        chatbarFocus: false,
        fullscreen: false,
        showPinned: false,
      },
      enhancers: {
        containerWidth: 0,
        defaultHeight: '30rem',
        defaultWidth: '24rem',
        floating: false,
        position: [0, 0],
        route: 'emotes',
        show: false,
        messages: [],
        unreadMessage: 0,
        isScrollOver: false,
        showOlderMessagesInfo: false,
        isTyping: false,
        isReacted: false,
        activeChannel: undefined,
      },
      settingReaction: {
        groupID: null,
        messageID: null,
        status: false,
        hoveredGlyphInfo: undefined,
      },
      glyphMarketplaceView: {
        shopId: null,
        view: 'home',
      },
      editMessage: {
        from: '',
        id: '',
        payload: '',
        mostEmojiUsed: [],
        recentGlyphs: [],
      },
      theme: {},
      base: {
        class: '',
        name: 'default',
        text: 'Default',
        value: 'default',
      },
      flair: {
        text: 'Satellite',
        value: '#2761fd',
        filesUploadStatus: '',
        renameItem: undefined,
        filePreview: undefined,
        fileDownloadList: [],
        chatImageOverlay: undefined,
      },
      fileSort: {
        asc: true,
        category: 'modified',
      },
      swiperSlideIndex: 0,
    }
    const result: any = inst.allUnseenNotifications(localState)
    expect(result).toEqual([
      {
        _id: '01g2ya7w44h4c5mm4bgyedkrvy',
        _mod: 1652432302212590600,
        at: 1652432301322,
        content: { description: 'New DM', title: 'Notification' },
        from: 'Andre2',
        id: '62fceb8d-60a5-4434-92e8-c07f52f9e8e6',
        state: 'UNREAD',
        type: 'Direct Message',
      },
      {
        _id: '01g2y9d6499169rzs5etrff48w',
        _mod: 1652431427721842400,
        at: 1652431426842,
        content: { description: 'New DM', title: 'Notification' },
        from: 'Andre2',
        id: '69c1ad1d-37e9-4ff5-b929-de5509512a11',
        state: 'UNREAD',
        type: 'Direct Message',
      },
    ])
    expect(result).toMatchSnapshot()
  })
})
