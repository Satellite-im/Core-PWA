const { TextEncoder, TextDecoder } = require('util')
    global.TextEncoder = TextEncoder
    global.TextDecoder = TextDecoder

import IdentityManager from "../libraries/Textile/IdentityManager"


describe('Test class IdentityManager', () => {

it('IdentityManager-initFromWallet', () => {
// Arguments
const wallet1 = undefined!

// Method call
const identityManager = new IdentityManager()
 identityManager.initFromWallet(wallet1)
})

it('IdentityManager-createRandom', async () => {
// Arguments


// Method call
const identityManager = new IdentityManager()
const result = await identityManager.createRandom()

// Expect result
expect(result).to.be.not.undefined!
})

it('IdentityManager-initFromPrivateKey', () => {
// Arguments
const privateKey1 = 'Oha'

// Method call
const identityManager = new IdentityManager()
 identityManager.initFromPrivateKey(privateKey1)
})

it('IdentityManager-authorize', async () => {
// Arguments
const identity1 = undefined!

// Method call
const identityManager = new IdentityManager()
const result = await identityManager.authorize(identity1)

// Expect result
expect(result).not.toBe('undefined')
})

it('IdentityManager-isInitialized', () => {
// Arguments


// Method call
const identityManager = new IdentityManager()
 identityManager.isInitialized()
})

it('IdentityManager-client', () => {
// Arguments
const client1 = undefined!

// Property call
const identityManager = new IdentityManager()
identityManager.client = client1
const result = identityManager.client

// Expect result
expect(result).toEqual(client1)
})

it('IdentityManager-users', () => {
// Arguments
const users1 = undefined!

// Property call
const identityManager = new IdentityManager()
identityManager.users = users1
const result = identityManager.users

// Expect result
expect(result).toEqual(users1)
})

it('IdentityManager-identity', () => {
// Arguments
const identity2 = undefined!

// Property call
const identityManager = new IdentityManager()
identityManager.identity = identity2
const result = identityManager.identity

// Expect result
expect(result).toEqual(identity2)
})

})
