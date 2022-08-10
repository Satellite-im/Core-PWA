import {
  wireBaseMessage,
  wireIdentificationMessage,
  wireDataMessage,
  wireSignalMessage,
  wireRefuseConnectionMessage,
  KeyboardStates,
  wireKeyboardState,
} from '~/libraries/WebRTC/encoders'

describe('check all constants', () => {
  it.skip('wireBaseMessage to return correctly', () => {
    expect(wireBaseMessage).toMatchSnapshot()
  })

  it.skip('wireIdentificationMessage to return correctly', () => {
    expect(wireIdentificationMessage).toMatchSnapshot()
  })

  it.skip('wireDataMessage to return correctly', () => {
    expect(wireDataMessage).toMatchSnapshot()
  })

  it.skip('wireSignalMessage to return correctly', () => {
    expect(wireSignalMessage).toMatchSnapshot()
  })

  it.skip('wireRefuseConnectionMessage to return correctly', () => {
    expect(wireRefuseConnectionMessage).toMatchSnapshot()
  })

  it.skip('KeyboardStates to return correctly', () => {
    expect(KeyboardStates).toMatchSnapshot()
  })

  it.skip('wireKeyboardState to return correctly', () => {
    expect(wireKeyboardState).toMatchSnapshot()
  })
})
