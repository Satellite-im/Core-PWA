import Crypto from '../libraries/Crypto/Crypto.ts'

describe('Logo', () => {
  // create new instance of class
  const crypto = new Crypto()

  // test that signMessage method exists 
  test('defines signMessage()', () => {
    expect(typeof crypto.signMessage).toBe('function')
  });
  test('expect signmessage without signingKey to be null', () => {
    expect(crypto.signMessage('dogs')).toBe(null)
  });
})
