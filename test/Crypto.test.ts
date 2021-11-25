import Crypto from '../libraries/Crypto/Crypto'

describe.skip('Test class Crypto', () => { //temporary until "ReferenceError: crypto is not defined" gets fixed
const crypto = new Crypto()

it('Crypto-init', () => {
// Arguments
const keypair1 = undefined

// Method call
 crypto.init(keypair1!)
})

it('Crypto-computeSharedSecret', () => {
// Arguments
const recipientPublicKey1 = undefined

// Method call

 crypto.computeSharedSecret(recipientPublicKey1!)
})

it('Crypto-aesKeyFromSharedSecret', async () => {
// Arguments
const sharedSecret1 = 'Oha'

// Method call

const result = await crypto.aesKeyFromSharedSecret(sharedSecret1)

// Expect result
expect(result).not.toBe('undefined')
})

it('Crypto-hash', () => {
// Arguments
const data1 = undefined

// Method call

 crypto.hash(data1!)
})

it('Crypto-initializeRecipient', async () => {
// Arguments
const recipientPublicKey2 = undefined

// Method call

const result = await crypto.initializeRecipient(recipientPublicKey2!)

// Expect result
expect(result).not.toBe('undefined')
})

it('Crypto-joinIvAndData', () => {
// Arguments
const iv1 = undefined!
const data2 = undefined!

// Method call

 crypto.joinIvAndData(iv1, data2)
})

it('Crypto-separateIvFromData', () => {
// Arguments
const buf1 = undefined!

// Method call

 crypto.separateIvFromData(buf1)
})

it('Crypto-encrypt', async () => {
// Arguments
const data3 = 'Oha'
const key1 = undefined

// Method call

const result = await crypto.encrypt(data3, key1!)

// Expect result
expect(result).not.toBe('undefined')
})

it('Crypto-decrypt', async () => {
// Arguments
const encryptedString1 = 'Oha'
const key2 = undefined!

// Method call

const result = await crypto.decrypt(encryptedString1, key2)

// Expect result
expect(result).not.toBe('undefined')
})

it('Crypto-encryptFor', () => {
// Arguments
const recipientAddress1 = 'Oha'
const data4 = 'Oha'

// Method call

 crypto.encryptFor(recipientAddress1, data4)
})

it('Crypto-decryptFrom', () => {
// Arguments
const senderAddress1 = 'Oha'
const data5 = 'Oha'

// Method call

 crypto.decryptFrom(senderAddress1, data5)
})

it('Crypto-isInitialized', () => {
// Arguments

// Method call

 crypto.isInitialized()
})

it('Crypto-getSecret', () => {
// Arguments
const address1 = 'Oha'

// Method call

 crypto.getSecret(address1)
})

it('Crypto-decryptWithPassword', async () => {
// Arguments
const encryptedString2 = 'Oha'
const password1 = 'Oha'

// Method call

const result = await crypto.decryptWithPassword(encryptedString2, password1)

// Expect result
expect(result).not.toBe('undefined')
})

it('Crypto-encryptWithPassword', async () => {
// Arguments
const plaintext1 = 'Oha'
const password2 = 'Oha'

// Method call

const result = await crypto.encryptWithPassword(plaintext1, password2)

// Expect result
expect(result).not.toBe('undefined')
})

it('Crypto-signMessageWithKey', () => {
// Arguments
const privateKey1 = undefined!
const message1 = 'Oha'

// Method call

 crypto.signMessageWithKey(privateKey1, message1)
})

it('Crypto-signMessage', () => {
// Arguments
const message2 = 'Oha'

// Method call

 crypto.signMessage(message2)
})

it('Crypto-signingKey', () => {
// Arguments
const signingKey1 = undefined

// Property call

crypto.signingKey = signingKey1
const result = crypto.signingKey

// Expect result
expect(result).toEqual(signingKey1)
})

it('Crypto-aesKeys', () => {
// Arguments
const aesKeys1 = undefined!

// Property call

crypto.aesKeys = aesKeys1
const result = crypto.aesKeys

// Expect result
expect(result).toEqual(aesKeys1)
})

it('Crypto-hashedSecrets', () => {
// Arguments
const hashedSecrets1 = undefined!

// Property call

crypto.hashedSecrets = hashedSecrets1
const result = crypto.hashedSecrets

// Expect result
expect(result).toEqual(hashedSecrets1)
})

})