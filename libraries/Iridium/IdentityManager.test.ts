import IdentityManager from './IdentityManager'
const crypto = require('crypto')

Object.defineProperty(global.self, 'crypto', {
  value: {
    getRandomValues: (arr) => crypto.randomBytes(arr.length),
  },
})

describe('', () => {
  test('generateEntropyMessage', () => {
    const localParam = {
      address: 'address',
      secret: 'secret',
    }
    const result = IdentityManager.generateEntropyMessage(
      localParam.address,
      localParam.secret,
    )
    expect(result).toEqual(
      '******************************************************************************** \n' +
        'READ THIS MESSAGE CAREFULLY. \n' +
        'DO NOT SHARE THIS SIGNED MESSAGE WITH ANYONE OR THEY WILL HAVE READ AND WRITE \n' +
        'ACCESS TO THIS APPLICATION. \n' +
        'DO NOT SIGN THIS MESSAGE IF THE FOLLOWING IS NOT TRUE OR YOU DO NOT CONSENT \n' +
        'TO THE CURRENT APPLICATION HAVING ACCESS TO THE FOLLOWING APPLICATION. \n' +
        '******************************************************************************** \n' +
        'The Solana address used by this application is: \n' +
        '\n' +
        localParam.address +
        '\n' +
        '\n' +
        '\n' +
        'By signing this message, you authorize the current application to use the \n' +
        'following app associated with the above address: \n' +
        '\n' +
        'Satellite' +
        '\n' +
        '\n' +
        '\n' +
        'The hash of your non-recoverable, private, non-persisted password or secret \n' +
        'phrase is: \n' +
        '\n' +
        localParam.secret +
        '\n' +
        '\n' +
        '\n' +
        '******************************************************************************** \n' +
        'ONLY SIGN THIS MESSAGE IF YOU CONSENT TO THE CURRENT PAGE ACCESSING THE KEYS \n' +
        'ASSOCIATED WITH THE ABOVE ADDRESS AND APPLICATION. \n' +
        'AGAIN, DO NOT SHARE THIS SIGNED MESSAGE WITH ANYONE OR THEY WILL HAVE READ AND \n' +
        'WRITE ACCESS TO THIS APPLICATION. \n' +
        '******************************************************************************** \n',
    )
  })
  test('seedRandom', async () => {
    const result = await IdentityManager.seedRandom()
    expect(result).not.toBeFalsy() // The result exists
  })
})
