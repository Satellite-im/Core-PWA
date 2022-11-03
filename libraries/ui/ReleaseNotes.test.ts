import fetchMock, { enableFetchMocks } from 'jest-fetch-mock'
import * as ReleaseNotes from '~/libraries/ui/ReleaseNotes'
enableFetchMocks()

describe('ReleaseNotes.ReleaseNotes', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  test('Receive successful response', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ mockedField: 'mockedData' }))

    const result = await ReleaseNotes.ReleaseNotes()
    expect(result.mockedField).toEqual('mockedData')
    expect(fetchMock.mock.calls.length).toEqual(1)
    expect(fetchMock.mock.calls[0][0]).toEqual(
      'https://api.github.com/repos/Satellite-im/Core-PWA/releases/latest',
    )
  })

  test('Receive TypeError response', async () => {
    fetchMock.mockResponseOnce(() => {
      throw new TypeError('mock error')
    })
    global.console.error = jest.fn()

    try {
      const result = await ReleaseNotes.ReleaseNotes()
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError)
      expect(console.error).toHaveBeenCalled()
    }
  })
})
