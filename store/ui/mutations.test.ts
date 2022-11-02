import { User } from '~/libraries/Iridium/users/types'
import mutations from '~/store/ui/mutations'
import InitialUIState from '~/store/ui/state'
import { SettingsRoutes } from '~/store/ui/types'

// So we don't have annoying snapshot fails. (https://stackoverflow.com/questions/42935903/jest-snapshot-testing-how-to-ignore-part-of-the-snapshot-file-in-jest-test-resu)
Date.now = jest.fn(() => 1645617999076)
const dateNow = Date.now()

describe('mutations', () => {
  test('toggleContextMenu', () => {
    const localizedState = { ...InitialUIState() }
    mutations.toggleContextMenu(localizedState, true)
    expect(localizedState.contextMenuStatus).toBeTruthy()
  })

  test('showSidebar', () => {
    const localizedState = { ...InitialUIState() }
    mutations.showSidebar(localizedState, true)
    expect(localizedState.showSidebar).toBeTruthy()
  })

  test('setContextMenuValues', () => {
    const localizedState = { ...InitialUIState() }
    mutations.setContextMenuValues(localizedState, true)
    expect(localizedState.contextMenuValues).toBeTruthy()
  })

  test('setContextMenuPosition', () => {
    const localizedState = { ...InitialUIState() }
    const object = {
      x: 4,
      y: 2,
    }
    mutations.setContextMenuPosition(localizedState, object)
    expect(localizedState.contextMenuPosition).toMatchObject(object)
  })

  test('setFullProfile', () => {
    const localizedState = { ...InitialUIState() }
    const object: User = {
      did: '123',
      name: 'John',
    }
    mutations.setFullProfile(localizedState, object)
    expect(localizedState.fullProfile).toMatchObject(object)
  })

  test('chatbarContent', () => {
    const localizedState = { ...InitialUIState() }
    mutations.chatbarContent(localizedState, 'string')
    expect(localizedState.chatbarContent).toBe('string')
  })

  test('setChatImageOverlay', () => {
    const passedInImageOverlay = undefined
    const localizedState = { ...InitialUIState() }
    mutations.setChatImageOverlay(localizedState, passedInImageOverlay)
    expect(localizedState.chatImageOverlay).toBeUndefined()
  })

  test('setChatbarFocus', () => {
    const localizedState = { ...InitialUIState() }
    mutations.setChatbarFocus(localizedState, true)
    expect(localizedState.chatbarFocus).toBeTruthy()
  })

  test('setIsMobileNavVisible', () => {
    const localizedState = { ...InitialUIState() }
    mutations.setIsMobileNavVisible(localizedState, true)
    expect(localizedState.isMobileNavVisible).toBeTruthy()
  })

  test('setSettingsRoute', () => {
    const localizedState = { ...InitialUIState() }
    mutations.setSettingsRoute(localizedState, SettingsRoutes.PROFILE)
    expect(localizedState.settingsRoute).toBe(SettingsRoutes.PROFILE)
  })

  test('setGlyphModalPackId', () => {
    const localizedState = { ...InitialUIState() }
    mutations.setGlyphModalPackId(localizedState, 'string')
    expect(localizedState.glyphModalPackId).toBe('string')
  })

  test('toggleModal', () => {
    const localizedState = { ...InitialUIState() }
    const object = {
      name: 'quickchat',
      state: true,
    }
    mutations.toggleModal(localizedState, object)
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
    const localizedState = { ...InitialUIState() }
    const object = {
      name: 'non-existent modal',
      state: true,
    }
    mutations.toggleModal(localizedState, object)
    expect(localizedState.modals).toMatchObject({
      [object.name]: object.state,
    })

    // This would not throw an error, because it will just create a new key with the boolean as a value
  })

  test('toggleErrorNetworkModal', () => {
    const localizedState = { ...InitialUIState() }
    const argument = { state: true, action: null }
    mutations.toggleErrorNetworkModal(localizedState, argument)
    expect(localizedState.modals.errorNetwork).toMatchObject({
      isOpen: argument.state,
      action: argument.action,
    })
  })

  test('setGlyphMarketplaceView', () => {
    const localizedState = { ...InitialUIState() }
    const object = { a: 'b' }
    mutations.setGlyphMarketplaceView(localizedState, object)
    expect(localizedState.glyphMarketplaceView).toBe(object)
  })

  test('setHoveredGlyphInfo', () => {
    const localizedState = { ...InitialUIState() }
    const object = { a: 'b' }
    mutations.setHoveredGlyphInfo(localizedState, object)
    expect(localizedState.hoveredGlyphInfo).toBe(object)
  })

  test('setEditMessage', () => {
    const localizedState = { ...InitialUIState() }
    const object = {
      payload: 'payload',
      id: '5d802d44-23c3-49d8-a725-407bd17eb56b',
      from: 'Retha Larkin',
    }
    mutations.setEditMessage(localizedState, object)
    expect(localizedState.editMessage).toMatchObject(object)
  })

  test('setCallHeight', () => {
    const localizedState = { ...InitialUIState() }
    const argument = '12'
    mutations.setCallHeight(localizedState, argument)
    expect(localizedState.callHeight).toEqual(argument)
  })

  test('setCallHeight with number', () => {
    const localizedState = { ...InitialUIState() }
    const argument = 12 // Does not have to be string
    mutations.setCallHeight(localizedState, argument)
    expect(localizedState.callHeight).toEqual(argument)
  })

  test('updateMostUsedEmoji', () => {
    const localizedState = { ...InitialUIState() }
    const argument = {
      name: 'thumbup',
      emoji: '👍',
      count: 1,
    }
    mutations.updateMostUsedEmoji(localizedState, argument)
    expect(localizedState.mostEmojiUsed).toEqual([
      {
        code: argument.name,
        content: argument.emoji,
        count: argument.count,
      },
    ])
  })

  test('updateMostUsedEmoji with existing glyph', () => {
    const localizedState = { ...InitialUIState() }
    const argument = {
      name: 'thumbup',
      emoji: '👍',
      count: 1,
    }
    mutations.updateMostUsedEmoji(localizedState, argument)
    expect(localizedState.mostEmojiUsed).toEqual([
      {
        code: argument.name,
        content: argument.emoji,
        count: argument.count,
      },
    ])
    mutations.updateMostUsedEmoji(localizedState, argument)
    expect(localizedState.mostEmojiUsed[0]).toMatchObject({ count: 2 })
    // We use [0] because there is only 1 element in the array
  })
})
