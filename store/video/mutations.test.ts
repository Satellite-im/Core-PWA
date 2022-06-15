import * as mutations from '~/store/video/mutations'
import { VideoState } from '~/store/video/types'

describe('mutations.default.toggleCamera', () => {
  test('0', () => {
    const videoState: VideoState = {
      disabled: true,
    }
    const result: any = mutations.default.toggleCamera(videoState)
    expect(videoState).toHaveProperty('disabled', false)
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const videoState: VideoState = {
      disabled: false,
    }
    const result: any = mutations.default.toggleCamera(videoState)
    expect(videoState).toHaveProperty('disabled', true)
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.default.setDisabled', () => {
  test('0', () => {
    const result: any = mutations.default.setDisabled({ disabled: false }, true)
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.default.setDisabled(
      { disabled: false },
      false,
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.default.setDisabled({ disabled: true }, true)
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.default.setDisabled({ disabled: true }, false)
    expect(result).toMatchSnapshot()
  })
})
