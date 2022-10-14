import { RegistrationStatus } from '~/store/accounts/types'
import { CaptureMouseTypes } from '~/store/settings/types'
import * as mutations from '~/store/ui/mutations'

// So we don't have annoying snapshot fails. (https://stackoverflow.com/questions/42935903/jest-snapshot-testing-how-to-ignore-part-of-the-snapshot-file-in-jest-test-resu)
Date.now = jest.fn(() => 1645617999076)
const dateNow = Date.now()

describe('mutations', () => {
  const initialRootState: any = {
    accounts: {
      storePin: true,
      loading: true,
      locked: true,
      pin: '',
      pinHash: '',
      active: '',
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
      },
      registrationStatus: RegistrationStatus.IN_PROGRESS,
      lastVisited: '',
    },
    friends: {
      incomingRequests: [
        {
          requestId: '',
          account: {
            accountId: '',
            from: '',
            status: 123,
            fromMailboxId: '',
            toMailboxId: '',
            to: '',
          },
          pending: true,
          from: '',
          userInfo: {
            name: '',
            servers: {},
            status: '',
            photoHash: '',
          },
        },
      ],
      outgoingRequests: [
        {
          to: '',
          requestId: '',
          account: {
            accountId: '',
            from: '',
            status: 123,
            fromMailboxId: '',
            toMailboxId: '',
            to: '',
          },
          pending: true,
        },
      ],
      all: [
        {
          publicKey: 'NoWiFi4you',
          typingState: 'NOT_TYPING',
          item: {},
          pending: true,
          activeChat: true,
          name: 'Taurus Nix',
          address: '0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
          account: {
            accountId: 'Checking Account',
            from: '.',
            status: 429,
            fromMailboxId: '12345',
            toMailboxId: 'v4.0.0-rc.4',
            to: './path/to/file',
          },
          status: '',
          state: 'idle',
          unreadCount: 123,
          profilePicture: '',
          badge: 'community',
          userAccount: '',
          mailboxId: '',
        },
      ],
    },
    settings: {
      audioInput: '',
      audioOutput: '',
      videoInput: '',
      captureMouse: CaptureMouseTypes.always,
      noiseSuppression: true,
      echoCancellation: true,
      bitrate: 96000,
      sampleSize: 24,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      userHasGivenAudioAccess: false,
      userDeniedAudioAccess: false,
      keybinds: {
        toggleMute: 'alt+m',
        toggleDeafen: 'alt+d',
        openSettings: 'alt+s',
        callActiveChat: 'alt+c',
      },
      embeddedLinks: true,
      displayCurrentActivity: true,
    },
  }
  const initialState = {
    callHeight: 'auto',
    isMobileNavVisible: false,
    contextMenuStatus: false,
    showSidebar: true,
    showSearchResult: false,
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
      error: false,
      glyph: false,
      marketplace: false,
      quickchat: false,
      wallet: false,
    },
    glyphModalPackId: '',
    chatbarContent: '',
    replyChatbarMessage: {
      from: '',
      id: '',
      payload: '',
    },
    chatbarFocus: false,
    fullscreen: false,
    enhancers: {
      containerWidth: 0,
      defaultHeight: '30rem',
      defaultWidth: '24rem',
      floating: false,
      position: [0, 0],
      route: 'emoji',
      show: false,
    },
    address: '0xc61b9bb3a7a0767e3179713f3a5c7a9aedce193c',
    messages: [
      {
        id: dateNow,
        at: dateNow,
        type: 'group',
        from: dateNow,
        to: '0x07ee55aa48bb72dcc6e9d78256648910de513eca',
        messages: [
          {
            id: dateNow,
            at: dateNow,
            type: 'text',
            payload: 'payload',
            reactions: [],
            replies: [],
          },
        ],
      },
      {
        id: dateNow,
        at: dateNow,
        type: 'group',
        from: '0xc61b9bb3a7a0767e3179713f3a5c7a9aedce193c',
        to: '0x07ee55aa48bb72dcc6e9d78256648910de513eca',
        messages: [
          {
            id: dateNow,
            at: dateNow,
            type: 'text',
            payload: 'message',
            reactions: [],
            replies: [],
          },
        ],
      },
    ],
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
    recentGlyphs: [
      {
        pack: {
          name: 'Birds',
          description: 'Short description can go here. Lorem ipsum.',
          artist: 'Dina Brodsky',
          id: '0903',
          stickerURLs: [
            'https://satellite.mypinata.cloud/ipfs/QmXrmiCxkyfpsAY18qzVBPv9TpCbTUToowQEsYy1Pm5C9b/$1/hawk.webp',
            'https://satellite.mypinata.cloud/ipfs/QmXrmiCxkyfpsAY18qzVBPv9TpCbTUToowQEsYy1Pm5C9b/$1/ducklings.webp',
            'https://satellite.mypinata.cloud/ipfs/QmXrmiCxkyfpsAY18qzVBPv9TpCbTUToowQEsYy1Pm5C9b/$1/owl.webp',
            'https://satellite.mypinata.cloud/ipfs/QmXrmiCxkyfpsAY18qzVBPv9TpCbTUToowQEsYy1Pm5C9b/$1/penguins.webp',
            'https://satellite.mypinata.cloud/ipfs/QmXrmiCxkyfpsAY18qzVBPv9TpCbTUToowQEsYy1Pm5C9b/$1/robin.webp',
            'https://satellite.mypinata.cloud/ipfs/QmXrmiCxkyfpsAY18qzVBPv9TpCbTUToowQEsYy1Pm5C9b/$1/stork.webp',
            'https://satellite.mypinata.cloud/ipfs/QmXrmiCxkyfpsAY18qzVBPv9TpCbTUToowQEsYy1Pm5C9b/$1/yellow_bird.webp',
          ],
        },
        url: 'https://satellite.mypinata.cloud/ipfs/QmXrmiCxkyfpsAY18qzVBPv9TpCbTUToowQEsYy1Pm5C9b/$1/ducklings.webp',
        count: 1,
      },
      {
        pack: {
          name: 'Astrobunny',
          description: 'Short description can go here. Lorem ipsum.',
          artist: 'John Treanor',
          id: '0123',
          stickerURLs: [
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/AHH.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/AHHcloseup.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/Coy_02.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/Cry.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/Cry2.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/Laugh.webp',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/Luv.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/Luv_02.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/Sad3.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/ThumbsDownNew.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/ThumbsUP.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/ThumbsUPNew.gif',
          ],
        },
        url: 'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/Coy_02.gif',
        count: 1,
      },
      {
        pack: {
          name: 'Astrobunny',
          description: 'Short description can go here. Lorem ipsum.',
          artist: 'John Treanor',
          id: '0123',
          stickerURLs: [
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/AHH.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/AHHcloseup.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/Coy_02.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/Cry.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/Cry2.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/Laugh.webp',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/Luv.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/Luv_02.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/Sad3.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/ThumbsDownNew.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/ThumbsUP.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/ThumbsUPNew.gif',
          ],
        },
        url: 'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/ThumbsUP.gif',
        count: 1,
      },
    ],
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
    isLoadingFileIndex: true,
    fileDownloadList: ['string'],
    renameItem: {},
  }

  test('toggleContextMenu', () => {
    const localizedState = { ...initialState }
    mutations.default.toggleContextMenu(localizedState, true)
    expect(localizedState.contextMenuStatus).toBeTruthy()
  })

  test('showSidebar', () => {
    const localizedState = { ...initialState }
    mutations.default.showSidebar(localizedState, true)
    expect(localizedState.showSidebar).toBeTruthy()
  })

  test('setContextMenuValues', () => {
    const localizedState = { ...initialState }
    mutations.default.setContextMenuValues(localizedState, true)
    expect(localizedState.contextMenuValues).toBeTruthy()
  })

  test('setContextMenuPosition', () => {
    const localizedState = { ...initialState }
    const object = {
      x: 4,
      y: 2,
    }
    mutations.default.setContextMenuPosition(localizedState, object)
    expect(localizedState.contextMenuPosition).toMatchObject(object)
  })

  test.skip('setFullProfile', () => {
    const localizedState = { ...initialState }
    const object = {
      name: 'John',
    }
    mutations.default.setFullProfile(localizedState, object)
    expect(localizedState.fullProfile).toMatchObject(object)
  })

  test('chatbarContent', () => {
    const localizedState = { ...initialState }
    mutations.default.chatbarContent(localizedState, 'string')
    expect(localizedState.chatbarContent).toBe('string')
  })

  test('setChatImageOverlay', () => {
    const passedInImageOverlay = undefined
    const localizedState = { ...initialState }
    mutations.default.setChatImageOverlay(localizedState, passedInImageOverlay)
    expect(localizedState.chatImageOverlay).toBeUndefined()
  })

  test('toggleEnhancers with non-default options', () => {
    const localizedState = { ...initialState }
    const object = {
      show: false,
      floating: true,
      position: [10],
      defaultWidth: '100',
      defaultHeight: '100',
      containerWidth: 17605,
      route: 'Et maiores amet nesciunt.',
    }
    mutations.default.toggleEnhancers(localizedState, object)
    expect(JSON.stringify(localizedState.enhancers)).toBe(
      JSON.stringify(object),
    )
    // The reason we're doing JSON.stringify to both the expected and received part is because if we don't, we'll get the `serializes to the same string` error.
  })

  test('toggleEnhancers with default options', () => {
    const localizedState = { ...initialState }
    mutations.default.toggleEnhancers(localizedState, {})
    expect(localizedState.enhancers).toBe(localizedState.enhancers)
    /*
     As paradoxical as it may seem here, this is very much normal. Consider the following ternary operation:

     typeof options.floating !== 'undefined'
     ? options.floating
     : state.enhancers.floating,

     If we do not pass an object (options) containing the floating property (options.floating),
     it will fall back to the existing value it has: which is what `state.enhancers.floating` has.
     Hence, what we're doing is checking if the state we are checking (state.enhancers) would be mutated
     if there were no options being passed into it.
     */
  })

  test('setChatbarFocus', () => {
    const localizedState = { ...initialState }
    mutations.default.setChatbarFocus(localizedState, true)
    expect(localizedState.chatbarFocus).toBeTruthy()
  })

  test('setIsMobileNavVisible', () => {
    const localizedState = { ...initialState }
    mutations.default.setIsMobileNavVisible(localizedState, true)
    expect(localizedState.isMobileNavVisible).toBeTruthy()
  })

  test('setSettingsRoute', () => {
    const localizedState = { ...initialState }
    mutations.default.setSettingsRoute(localizedState, 'profile')
    expect(localizedState.settingsRoute).toBe('profile')
  })

  test('setGlyphModalPackId', () => {
    const localizedState = { ...initialState }
    mutations.default.setGlyphModalPackId(localizedState, 'string')
    expect(localizedState.glyphModalPackId).toBe('string')
  })

  test('toggleModal', () => {
    const localizedState = { ...initialState }
    const object = {
      name: 'quickchat',
      state: true,
    }
    mutations.default.toggleModal(localizedState, object)
    expect(localizedState.modals).toMatchObject({
      [object.name]: object.state,
    })

    /*
     * The reason we're doing the matcher the above way is rather than .toMatchObject(object) if we don't
     * it will be expecting:
     * {"name": "quickchat",
     * "state": true, }
     * rather than
     * {"quickchat": true}
     */
  })

  test('toggleModal with a non-existent modal', () => {
    const localizedState = { ...initialState }
    const object = {
      name: 'non-existent modal',
      state: true,
    }
    mutations.default.toggleModal(localizedState, object)
    expect(localizedState.modals).toMatchObject({
      [object.name]: object.state,
    })

    // This would not throw an error, because it will just create a new key with the boolean as a value
  })

  test('toggleModal with a non-existent modal', () => {
    const localizedState = { ...initialState }
    const object = {
      name: 'non-existent modal',
      state: true,
    }
    mutations.default.toggleModal(localizedState, object)
    expect(localizedState.modals).toMatchObject({
      [object.name]: object.state,
    })

    // This would not throw an error, because it will just create a new key with the boolean as a value
  })

  test('toggleErrorNetworkModal', () => {
    const localizedState = { ...initialState }
    const argument = { state: true, action: null }
    mutations.default.toggleErrorNetworkModal(localizedState, argument)
    expect(localizedState.modals.errorNetwork).toMatchObject({
      isOpen: argument.state,
      action: argument.action,
    })
  })

  test('setGlyphMarketplaceView', () => {
    const localizedState = { ...initialState }
    const object = { a: 'b' }
    mutations.default.setGlyphMarketplaceView(localizedState, object)
    expect(localizedState.glyphMarketplaceView).toBe(object)
  })

  test('setHoveredGlyphInfo', () => {
    const localizedState = { ...initialState }
    const object = { a: 'b' }
    mutations.default.setHoveredGlyphInfo(localizedState, object)
    expect(localizedState.hoveredGlyphInfo).toBe(object)
  })

  test('updateMostUsedEmoji with existing emoji', () => {
    const localizedState = { ...initialState }
    const object = {
      name: 'flag_id',
      emoji: '🇮🇩',
    }
    mutations.default.updateMostUsedEmoji(localizedState, object)
    expect(localizedState.mostEmojiUsed).toContainEqual({
      code: 'flag_id',
      content: '🇮🇩',
      count: 4, // This emoji has been used 3 times in the past, by sending this message (via this unit): we've incremented this to 4 from 3.
    })
  })

  test('updateMostUsedEmoji with new emoji', () => {
    const localizedState = { ...initialState }
    const object = {
      name: 'flag_south_africa',
      emoji: '🇿🇦',
    }
    mutations.default.updateMostUsedEmoji(localizedState, object)
    expect(localizedState.mostEmojiUsed).toContainEqual({
      code: 'flag_south_africa',
      content: '🇿🇦',
      count: 1, // This emoji has been not been used in the past, by sending this message (via this unit): we've incremented this to 1 from 0.
    })
  })

  test('updateMostUsedGlyph with existing emoji', () => {
    const localizedState = { ...initialState }
    const object = {
      pack: {
        name: 'Birds',
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
      url: 'https://satellite.mypinata.cloud/ipfs/QmXrmiCxkyfpsAY18qzVBPv9TpCbTUToowQEsYy1Pm5C9b/$1/ducklings.webp',
      count: 2, // Since this glyph has been used before, it will be incremented from 1 to 2.
    }
    mutations.default.updateRecentGlyphs(localizedState, object)
    expect(localizedState.recentGlyphs).toMatchSnapshot()
  })

  test('updateMostUsedGlyph with new emoji', () => {
    const localizedState = { ...initialState }
    const object = {
      pack: {
        name: 'name',
        artist: 'artist',
        id: 'id',
        stickerURLs: ['string1', 'string2'],
      },
      url: 'Sit rerum praesentium aut ut molestiae voluptatem et sed. Ut iste amet reprehenderit facilis eos fugit. Odit earum ut vero eligendi modi esse omnis officia.\n \rTempora voluptas modi fuga ex consequatur provident pariatur. Voluptatem exercitationem est necessitatibus. Aut nobis beatae itaque aut alias ut ipsam. Consequatur et similique ipsa eveniet voluptates beatae quidem. Aut quas velit distinctio consequatur voluptatem doloribus.\n \rLabore sint voluptate. Eveniet dolorem veritatis in corrupti esse maiores porro consequatur. Optio qui ut doloribus sequi sunt ipsa provident. Tempora qui beatae. Sit modi perferendis fugit perferendis. Debitis suscipit inventore.',
    }
    mutations.default.updateRecentGlyphs(localizedState, object)
    expect(localizedState.recentGlyphs).toContainEqual({
      pack: object.pack,
      url: object.url,
      count: 1, // This emoji has been not been used in the past, by sending this message (via this unit): we've incremented this to 1 from 0.
    })
  })

  test('settingReaction', () => {
    const localizedState = { ...initialState }
    mutations.default.settingReaction(localizedState, true)
    expect(localizedState.settingReaction).toBeTruthy()
  })

  test('setEditMessage', () => {
    const localizedState = { ...initialState }
    const object = {
      payload: 'payload',
      id: '5d802d44-23c3-49d8-a725-407bd17eb56b',
      from: 'Retha Larkin',
    }
    mutations.default.setEditMessage(localizedState, object)
    expect(localizedState.editMessage).toMatchObject(object)
  })

  test('setCallHeight', () => {
    const localizedState = { ...initialState }
    const argument = '12'
    mutations.default.setCallHeight(localizedState, argument)
    expect(localizedState.callHeight).toEqual(argument)
  })

  test('setCallHeight with number', () => {
    const localizedState = { ...initialState }
    const argument = 12 // Does not have to be string
    mutations.default.setCallHeight(localizedState, argument)
    expect(localizedState.callHeight).toEqual(argument)
  })
})
