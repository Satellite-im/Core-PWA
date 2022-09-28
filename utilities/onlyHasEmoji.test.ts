import { onlyHasEmoji } from '~/utilities/onlyHasEmoji'

describe('test onlyHasEmoji utility', () => {
  it('should return true for only-emoji argument', () => {
    const argument = '🙏'
    const result = onlyHasEmoji(argument)

    expect(result).toBeTruthy()
  })

  it('should return false for combined emoji-text argument', () => {
    const argument = '🙏text'
    const result = onlyHasEmoji(argument)

    expect(result).toBeFalsy()
  })

  it('should return false for text only argument', () => {
    const argument = 'text'
    const result = onlyHasEmoji(argument)

    expect(result).toBeFalsy()
  })

  it('should return false for empty string argument', () => {
    const argument = ''
    const result = onlyHasEmoji(argument)

    expect(result).toBeFalsy()
  })
})
