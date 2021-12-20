import FriendsProgram from "../libraries/Solana/FriendsProgram/FriendsProgram"

describe.skip('Test class FriendsProgram', () => {

it('FriendsProgram-init', () => {
// Arguments
const solana1 = undefined!
const solana2 = undefined!

// Method call
const friendsProgram = new FriendsProgram(solana1)
 friendsProgram.init(solana2)
})

it('FriendsProgram-createDerivedAccount', () => {
// Arguments
const solana3 = undefined!
const seedKey1 = undefined!
const seedString1 = 'Oha'
const params1 = undefined!
const confirmOptionsOverride1 = undefined!

// Method call
const friendsProgram = new FriendsProgram(solana3)
 friendsProgram.createDerivedAccount(seedKey1, seedString1, params1, confirmOptionsOverride1)
})

it('FriendsProgram-createFriend', () => {
// Arguments
const solana4 = undefined!
const userFromKey1 = undefined!
const userToKey1 = undefined!
const confirmOptionsOverride2 = undefined!

// Method call
const friendsProgram = new FriendsProgram(solana4)
 friendsProgram.createFriend(userFromKey1, userToKey1, confirmOptionsOverride2)
})

it('FriendsProgram-initFriendRequest', () => {
// Arguments
const solana5 = undefined!
const friendKey1 = undefined!
const friend2Key1 = undefined!
const userFromKey2 = undefined!
const userToKey2 = undefined!
const fromPaddedBuffer1 = undefined!

// Method call
const friendsProgram = new FriendsProgram(solana5)
 friendsProgram.initFriendRequest(friendKey1, friend2Key1, userFromKey2, userToKey2, fromPaddedBuffer1)
})

it('FriendsProgram-initAcceptFriendRequest', () => {
// Arguments
const solana6 = undefined!
const friendKey2 = undefined!
const userFromKey3 = undefined!
const userToKey3 = undefined!
const toPaddedBuffer1 = undefined!

// Method call
const friendsProgram = new FriendsProgram(solana6)
 friendsProgram.initAcceptFriendRequest(friendKey2, userFromKey3, userToKey3, toPaddedBuffer1)
})

it('FriendsProgram-initDenyFriendRequest', () => {
// Arguments
const solana7 = undefined!
const friendKey3 = undefined!
const userFromKey4 = undefined!
const userToKey4 = undefined!

// Method call
const friendsProgram = new FriendsProgram(solana7)
 friendsProgram.initDenyFriendRequest(friendKey3, userFromKey4, userToKey4)
})

it('FriendsProgram-initRemoveFriendRequest', () => {
// Arguments
const solana8 = undefined!
const friendKey4 = undefined!
const userFromKey5 = undefined!
const userToKey5 = undefined!

// Method call
const friendsProgram = new FriendsProgram(solana8)
 friendsProgram.initRemoveFriendRequest(friendKey4, userFromKey5, userToKey5)
})

it('FriendsProgram-initRemoveFriend', () => {
// Arguments
const solana9 = undefined!
const friendKey5 = undefined!
const userFromKey6 = undefined!
const userToKey6 = undefined!
const initiator1 = undefined!

// Method call
const friendsProgram = new FriendsProgram(solana9)
 friendsProgram.initRemoveFriend(friendKey5, userFromKey6, userToKey6, initiator1)
})

it('FriendsProgram-createFriendRequest', () => {
// Arguments
const solana10 = undefined!
const friendKey6 = undefined!
const friend2Key2 = undefined!
const userFromAccount1 = undefined!
const userToKey7 = undefined!
const fromPaddedBuffer2 = undefined!
const confirmOptionsOverride3 = undefined!

// Method call
const friendsProgram = new FriendsProgram(solana10)
 friendsProgram.createFriendRequest(friendKey6, friend2Key2, userFromAccount1, userToKey7, fromPaddedBuffer2, confirmOptionsOverride3)
})

it('FriendsProgram-acceptFriendRequest', () => {
// Arguments
const solana11 = undefined!
const friendKey7 = undefined!
const userFromKey7 = undefined!
const userToAccount1 = undefined!
const toPaddedBuffer2 = undefined!
const confirmOptionsOverride4 = undefined!

// Method call
const friendsProgram = new FriendsProgram(solana11)
 friendsProgram.acceptFriendRequest(friendKey7, userFromKey7, userToAccount1, toPaddedBuffer2, confirmOptionsOverride4)
})

it('FriendsProgram-denyFriendRequest', () => {
// Arguments
const solana12 = undefined!
const friendKey8 = undefined!
const userFromKey8 = undefined!
const userToAccount2 = undefined!
const confirmOptionsOverride5 = undefined!

// Method call
const friendsProgram = new FriendsProgram(solana12)
 friendsProgram.denyFriendRequest(friendKey8, userFromKey8, userToAccount2, confirmOptionsOverride5)
})

it('FriendsProgram-removeFriendRequest', () => {
// Arguments
const solana13 = undefined!
const friendKey9 = undefined!
const userFromAccount2 = undefined!
const userToKey8 = undefined!
const confirmOptionsOverride6 = undefined!

// Method call
const friendsProgram = new FriendsProgram(solana13)
 friendsProgram.removeFriendRequest(friendKey9, userFromAccount2, userToKey8, confirmOptionsOverride6)
})

it('FriendsProgram-removeFriend', () => {
// Arguments
const solana14 = undefined!
const friendAccount1 = undefined!
const signer1 = undefined!
const confirmOptionsOverride7 = undefined!

// Method call
const friendsProgram = new FriendsProgram(solana14)
 friendsProgram.removeFriend(friendAccount1, signer1, confirmOptionsOverride7)
})

it('FriendsProgram-getFriend', () => {
// Arguments
const solana15 = undefined!
const friendKey10 = undefined!

// Method call
const friendsProgram = new FriendsProgram(solana15)
 friendsProgram.getFriend(friendKey10)
})

it('FriendsProgram-getParsedFriend', () => {
// Arguments
const solana16 = undefined!
const friendKey11 = undefined!

// Method call
const friendsProgram = new FriendsProgram(solana16)
 friendsProgram.getParsedFriend(friendKey11)
})

it('FriendsProgram-computeFriendAccountKey', () => {
// Arguments
const solana17 = undefined!
const userFromKey9 = undefined!
const userToKey9 = undefined!

// Method call
const friendsProgram = new FriendsProgram(solana17)
 friendsProgram.computeFriendAccountKey(userFromKey9, userToKey9)
})

it('FriendsProgram-getFriendAccountsByStatus', () => {
// Arguments
const solana18 = undefined!
const status1 = undefined!

// Method call
const friendsProgram = new FriendsProgram(solana18)
 friendsProgram.getFriendAccountsByStatus(status1)
})

it('FriendsProgram-buildEventHandler', () => {
// Arguments
const solana19 = undefined!
const friendEvent1 = undefined!

// Method call
const friendsProgram = new FriendsProgram(solana19)
 friendsProgram.buildEventHandler(friendEvent1)
})

it('FriendsProgram-subscribeToFriendsEvents', () => {
// Arguments
const solana20 = undefined!

// Method call
const friendsProgram = new FriendsProgram(solana20)
 friendsProgram.subscribeToFriendsEvents()
})

it('FriendsProgram-addEventListener', () => {
// Arguments
const solana21 = undefined!
const type1 = undefined!
const callback1 = undefined!

// Method call
const friendsProgram = new FriendsProgram(solana21)
 friendsProgram.addEventListener(type1, callback1)
})

it('FriendsProgram-removeEventListener', () => {
// Arguments
const solana22 = undefined!
const type2 = undefined!
const listener1 = undefined!

// Method call
const friendsProgram = new FriendsProgram(solana22)
 friendsProgram.removeEventListener(type2, listener1)
})

it('FriendsProgram-solana', () => {
// Arguments
const solana23 = undefined!
const solana24 = undefined!

// Property call
const friendsProgram = new FriendsProgram(solana23)
friendsProgram.solana = solana24
const result = friendsProgram.solana

// Expect result
expect(result).toEqual(solana24)
})

it('FriendsProgram-subscriptions', () => {
// Arguments
const solana25 = undefined!
const subscriptions1 = undefined!

// Property call
const friendsProgram = new FriendsProgram(solana25)
friendsProgram.subscriptions = subscriptions1
const result = friendsProgram.subscriptions

// Expect result
expect(result).toEqual(subscriptions1)
})

})
