import {
    KeyboardStates, wireBaseMessage, wireDataMessage, wireIdentificationMessage, wireKeyboardState, wireRefuseConnectionMessage, wireSignalMessage
} from '~/libraries/WebRTC/encoders'

describe('check all constants', () => {
  it('wireBaseMessage to return correctly', () => {
    expect(wireBaseMessage).toMatchSnapshot()
  })

  it('wireIdentificationMessage to return correctly', () => {
    expect(wireIdentificationMessage).toMatchSnapshot()
  })

  it('wireDataMessage to return correctly', () => {
    expect(wireDataMessage).toMatchSnapshot()
  })

  it('wireSignalMessage to return correctly', () => {
    expect(wireSignalMessage).toMatchSnapshot()
  })

  it('wireRefuseConnectionMessage to return correctly', () => {
    expect(wireRefuseConnectionMessage).toMatchSnapshot()
  })

  it('KeyboardStates to return correctly', () => {
    expect(KeyboardStates).toMatchSnapshot()
  })

  it('wireKeyboardState to return correctly', () => {
    expect(wireKeyboardState).toMatchSnapshot()
  })
})
