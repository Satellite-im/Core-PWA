import { GlyphMarketViewStatus, Themes, Flairs } from './types'
import * as getters from '~/store/ui/getters'
import InitialUIState from '~/store/ui/state'

describe('init', () => {
  let inst: any

  beforeEach(() => {
    inst = getters.default
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
})
