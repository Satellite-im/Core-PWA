import * as getters from '~/store/ui/getters'
import InitialUIState from '~/store/ui/state'
import { Flairs, GlyphMarketViewStatus, Themes } from './types'

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
              'https://satellite.mypinata.cloud/ipfs/QmXrmiCxkyfpsAY18qzVBPv9TpCbTUToowQEsYy1Pm5C9b/hawk.png',
              'https://satellite.mypinata.cloud/ipfs/QmXrmiCxkyfpsAY18qzVBPv9TpCbTUToowQEsYy1Pm5C9b/ducklings.png',
              'https://satellite.mypinata.cloud/ipfs/QmXrmiCxkyfpsAY18qzVBPv9TpCbTUToowQEsYy1Pm5C9b/owl.png',
              'https://satellite.mypinata.cloud/ipfs/QmXrmiCxkyfpsAY18qzVBPv9TpCbTUToowQEsYy1Pm5C9b/penguins.png',
              'https://satellite.mypinata.cloud/ipfs/QmXrmiCxkyfpsAY18qzVBPv9TpCbTUToowQEsYy1Pm5C9b/robin.png',
              'https://satellite.mypinata.cloud/ipfs/QmXrmiCxkyfpsAY18qzVBPv9TpCbTUToowQEsYy1Pm5C9b/stork.png',
              'https://satellite.mypinata.cloud/ipfs/QmXrmiCxkyfpsAY18qzVBPv9TpCbTUToowQEsYy1Pm5C9b/yellow_bird.png',
            ],
          },
          url: 'https://satellite.mypinata.cloud/ipfs/QmXrmiCxkyfpsAY18qzVBPv9TpCbTUToowQEsYy1Pm5C9b/ducklings.png',
          count: 1,
        },
        {
          pack: {
            name: 'Count 3',
            description: 'Short description can go here. Lorem ipsum.',
            artist: 'John Treanor',
            id: '0123',
            stickerURLs: [
              'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/AHH.gif',
              'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/AHHcloseup.gif',
              'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/Coy_02.gif',
              'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/Cry.gif',
              'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/Cry2.gif',
              'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/Laugh.png',
              'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/Luv.gif',
              'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/Luv_02.gif',
              'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/Sad3.gif',
              'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/ThumbsDownNew.48.gif',
              'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/ThumbsUP.gif',
              'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/ThumbsUPNew.gif',
            ],
          },
          url: 'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/Coy_02.gif',
          count: 3,
        },
        {
          pack: {
            name: 'Count 2',
            description: 'Short description can go here. Lorem ipsum.',
            artist: 'John Treanor',
            id: '0123',
            stickerURLs: [
              'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/AHH.gif',
              'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/AHHcloseup.gif',
              'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/Coy_02.gif',
              'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/Cry.gif',
              'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/Cry2.gif',
              'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/Laugh.png',
              'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/Luv.gif',
              'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/Luv_02.gif',
              'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/Sad3.gif',
              'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/ThumbsDownNew.48.gif',
              'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/ThumbsUP.gif',
              'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/ThumbsUPNew.gif',
            ],
          },
          url: 'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/ThumbsUP.gif',
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
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/AHH.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/AHHcloseup.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/Coy_02.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/Cry.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/Cry2.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/Laugh.png',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/Luv.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/Luv_02.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/Sad3.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/ThumbsDownNew.48.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/ThumbsUP.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/ThumbsUPNew.gif',
          ],
        },
        url: 'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/Coy_02.gif',
        count: 3,
      },
      {
        pack: {
          name: 'Count 2',
          description: 'Short description can go here. Lorem ipsum.',
          artist: 'John Treanor',
          id: '0123',
          stickerURLs: [
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/AHH.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/AHHcloseup.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/Coy_02.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/Cry.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/Cry2.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/Laugh.png',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/Luv.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/Luv_02.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/Sad3.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/ThumbsDownNew.48.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/ThumbsUP.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/ThumbsUPNew.gif',
          ],
        },
        url: 'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/ThumbsUP.gif',
        count: 2,
      },
      {
        pack: {
          name: 'Count 1',
          description: 'Short description can go here. Lorem ipsum.',
          artist: 'Dina Brodsky',
          id: '0903',
          stickerURLs: [
            'https://satellite.mypinata.cloud/ipfs/QmXrmiCxkyfpsAY18qzVBPv9TpCbTUToowQEsYy1Pm5C9b/hawk.png',
            'https://satellite.mypinata.cloud/ipfs/QmXrmiCxkyfpsAY18qzVBPv9TpCbTUToowQEsYy1Pm5C9b/ducklings.png',
            'https://satellite.mypinata.cloud/ipfs/QmXrmiCxkyfpsAY18qzVBPv9TpCbTUToowQEsYy1Pm5C9b/owl.png',
            'https://satellite.mypinata.cloud/ipfs/QmXrmiCxkyfpsAY18qzVBPv9TpCbTUToowQEsYy1Pm5C9b/penguins.png',
            'https://satellite.mypinata.cloud/ipfs/QmXrmiCxkyfpsAY18qzVBPv9TpCbTUToowQEsYy1Pm5C9b/robin.png',
            'https://satellite.mypinata.cloud/ipfs/QmXrmiCxkyfpsAY18qzVBPv9TpCbTUToowQEsYy1Pm5C9b/stork.png',
            'https://satellite.mypinata.cloud/ipfs/QmXrmiCxkyfpsAY18qzVBPv9TpCbTUToowQEsYy1Pm5C9b/yellow_bird.png',
          ],
        },
        url: 'https://satellite.mypinata.cloud/ipfs/QmXrmiCxkyfpsAY18qzVBPv9TpCbTUToowQEsYy1Pm5C9b/ducklings.png',
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
