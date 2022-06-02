import {
  decryptedMessage,
  exportedForTesting,
  fileMessage,
  glyphMessage,
  mediaMessage,
  messageEncoder,
  messageFromThread,
  rawMessage,
  reactionMessage,
  replyMessage,
  textMessage,
} from '~/libraries/Textile/encoders'

describe('check all constants', () => {
  it('rawMessage to return correctly', () => {
    expect(rawMessage).toMatchSnapshot()
  })
  it('decryptedMessage to return correctly', () => {
    expect(decryptedMessage).toMatchSnapshot()
  })
  it('messageFromThread to return correctly', () => {
    expect(messageFromThread).toMatchSnapshot()
  })
  it('reactionMessage to return correctly', () => {
    expect(reactionMessage).toMatchSnapshot()
  })
  it('fileMessage to return correctly', () => {
    expect(fileMessage).toMatchSnapshot()
  })
  it('textMessage to return correctly', () => {
    expect(textMessage).toMatchSnapshot()
  })
  it('mediaMessage to return correctly', () => {
    expect(mediaMessage).toMatchSnapshot()
  })
  it('glyphMessage to return correctly', () => {
    expect(glyphMessage).toMatchSnapshot()
  })
  it('replyMessage to return correctly', () => {
    expect(replyMessage).toMatchSnapshot()
  })
  it('messageEncoder to return correctly', () => {
    expect(messageEncoder).toMatchSnapshot()
  })
  it('function isBase64 to return correctly', () => {
    expect(exportedForTesting.isBase64('ZHVtbXl0ZXh0')).toMatchSnapshot()
  })
  it('function isBase64 to return incorrectly', () => {
    // We are not passing a base64 argument so that we get a false response
    expect(exportedForTesting.isBase64('abc')).toMatchSnapshot()
  })
  it('base64 to return correctly', () => {
    expect(exportedForTesting.base64).toMatchSnapshot()
  })
})
