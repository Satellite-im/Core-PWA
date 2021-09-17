import { EventEmitter } from 'events'
import {
  SystemProgram,
  Transaction,
  TransactionInstruction,
  PublicKey,
  sendAndConfirmTransaction,
  SYSVAR_RENT_PUBKEY,
  Keypair,
  // eslint-disable-next-line import/named
  ConfirmOptions,
  // eslint-disable-next-line import/named
  KeyedAccountInfo,
  // eslint-disable-next-line import/named
  GetProgramAccountsFilter,
} from '@solana/web3.js'
import base58 from 'micro-base58'
import {
  encodeInstructionData,
  friendLayout,
  parseFriendAccount,
  parseFriendAccounts,
} from './FriendsProgram.layout'
import {
  CreateFriendParams,
  FriendAccount,
  FriendsEvents,
  FriendStatus,
} from './FriendsProgram.types'

import { Seeds, publicKeyFromSeeds } from '~/libraries/Solana/Solana'

import Solana from '~/libraries/Solana/SolanaManager/SolanaManager'
import { Config } from '~/config'

export const FRIENDS_PROGRAM_ID = new PublicKey(Config.solana.friendsProgramId)

export default class FriendsProgram extends EventEmitter {
  solana?: Solana
  subscriptions?: { [eventName: string]: number }
  constructor(solana: Solana) {
    super()
    if (solana) {
      this.init(solana)
    }
  }

  init(solana: Solana) {
    this.solana = solana
  }

  async createDerivedAccount(
    seedKey: PublicKey,
    seedString: string,
    params: CreateFriendParams,
    confirmOptionsOverride?: ConfirmOptions
  ) {
    if (!this.solana) {
      throw new Error('Friends program not initialized')
    }

    const { connection } = this.solana
    const payerAccount = this.solana.getActiveAccount()
    if (!payerAccount) return null

    const { base, key } = await publicKeyFromSeeds(
      [seedKey.toBytes(), params.createAccount.friend.friendKey],
      seedString,
      FRIENDS_PROGRAM_ID
    )

    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: payerAccount.publicKey, isSigner: true, isWritable: true },
        { pubkey: seedKey, isSigner: false, isWritable: false },
        { pubkey: base[0], isSigner: false, isWritable: false },
        { pubkey: key, isSigner: false, isWritable: true },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      programId: FRIENDS_PROGRAM_ID,
      data: encodeInstructionData(params),
    })

    const transaction = new Transaction().add(instruction)

    await sendAndConfirmTransaction(connection, transaction, [payerAccount], {
      commitment: Config.solana.defaultCommitment,
      preflightCommitment: Config.solana.defaultPreflightCommitment,
      ...confirmOptionsOverride,
    })
    return key
  }

  async createFriend(
    userFromKey: PublicKey,
    userToKey: PublicKey,
    confirmOptionsOverride?: ConfirmOptions
  ) {
    if (!this.solana) {
      throw new Error('Friends program not initialized')
    }

    const payerAccount = this.solana.getActiveAccount()
    if (!payerAccount) return null
    if (!userFromKey) return null

    const params = {
      createAccount: {
        friend: { friendKey: userToKey.toBytes() },
      },
    }
    const friendKey = await this.createDerivedAccount(
      userFromKey,
      Seeds.Friend,
      params,
      confirmOptionsOverride
    )

    if (!friendKey) throw new Error('Derived account error')

    return friendKey
  }

  initFriendRequest(
    friendKey: PublicKey,
    friend2Key: PublicKey,
    userFromKey: PublicKey,
    userToKey: PublicKey,
    fromPaddedBuffer: Uint8Array
  ) {
    return new TransactionInstruction({
      keys: [
        { pubkey: friendKey, isSigner: false, isWritable: true },
        { pubkey: friend2Key, isSigner: false, isWritable: true },
        { pubkey: userFromKey, isSigner: true, isWritable: false },
        { pubkey: userToKey, isSigner: false, isWritable: true },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      ],
      programId: FRIENDS_PROGRAM_ID,
      data: encodeInstructionData({
        makeRequest: {
          tex: [
            fromPaddedBuffer.slice(0, 32),
            fromPaddedBuffer.slice(32, 64),
            fromPaddedBuffer.slice(64, 96),
            fromPaddedBuffer.slice(96, 128),
          ],
        },
      }),
    })
  }

  initAcceptFriendRequest(
    friendKey: PublicKey,
    userFromKey: PublicKey,
    userToKey: PublicKey,
    toPaddedBuffer: Uint8Array
  ) {
    return new TransactionInstruction({
      keys: [
        { pubkey: friendKey, isSigner: false, isWritable: true },
        { pubkey: userFromKey, isSigner: false, isWritable: true },
        { pubkey: userToKey, isSigner: true, isWritable: false },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      ],
      programId: FRIENDS_PROGRAM_ID,
      data: encodeInstructionData({
        acceptRequest: {
          tex: [
            toPaddedBuffer.slice(0, 32),
            toPaddedBuffer.slice(32, 64),
            toPaddedBuffer.slice(64, 96),
            toPaddedBuffer.slice(96, 128),
          ],
        },
      }),
    })
  }

  initDenyFriendRequest(
    friendKey: PublicKey,
    userFromKey: PublicKey,
    userToKey: PublicKey
  ) {
    return new TransactionInstruction({
      keys: [
        { pubkey: friendKey, isSigner: false, isWritable: true },
        { pubkey: userFromKey, isSigner: false, isWritable: true },
        { pubkey: userToKey, isSigner: true, isWritable: false },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      ],
      programId: FRIENDS_PROGRAM_ID,
      data: encodeInstructionData({
        denyRequest: {},
      }),
    })
  }

  initRemoveFriendRequest(
    friendKey: PublicKey,
    userFromKey: PublicKey,
    userToKey: PublicKey
  ) {
    return new TransactionInstruction({
      keys: [
        { pubkey: friendKey, isSigner: false, isWritable: true },
        { pubkey: userFromKey, isSigner: true, isWritable: false },
        { pubkey: userToKey, isSigner: false, isWritable: true },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      ],
      programId: FRIENDS_PROGRAM_ID,
      data: encodeInstructionData({
        removeRequest: {},
      }),
    })
  }

  initRemoveFriend(
    friendKey: PublicKey,
    userFromKey: PublicKey,
    userToKey: PublicKey
  ) {
    return new TransactionInstruction({
      keys: [
        { pubkey: friendKey, isSigner: false, isWritable: true },
        { pubkey: userFromKey, isSigner: true, isWritable: false },
        { pubkey: userToKey, isSigner: false, isWritable: true },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      ],
      programId: FRIENDS_PROGRAM_ID,
      data: encodeInstructionData({
        removeFriend: {},
      }),
    })
  }

  createFriendRequest(
    friendKey: PublicKey,
    friend2Key: PublicKey,
    userFromAccount: Keypair,
    userToKey: PublicKey,
    fromPaddedBuffer: Uint8Array,
    confirmOptionsOverride?: ConfirmOptions
  ) {
    if (!this.solana) {
      throw new Error('Friends program not initialized')
    }

    const { connection } = this.solana
    const payerAccount = this.solana.getActiveAccount()
    if (!payerAccount) return null

    const transaction = new Transaction().add(
      this.initFriendRequest(
        friendKey,
        friend2Key,
        userFromAccount.publicKey,
        userToKey,
        fromPaddedBuffer
      )
    )

    return sendAndConfirmTransaction(
      connection,
      transaction,
      [payerAccount, userFromAccount],
      {
        commitment: Config.solana.defaultCommitment,
        preflightCommitment: Config.solana.defaultPreflightCommitment,
        ...confirmOptionsOverride,
      }
    )
  }

  acceptFriendRequest(
    friendKey: PublicKey,
    userFromKey: PublicKey,
    userToAccount: Keypair,
    toPaddedBuffer: Uint8Array,
    confirmOptionsOverride?: ConfirmOptions
  ) {
    if (!this.solana) {
      throw new Error('Friends program not initialized')
    }

    const { connection } = this.solana
    const payerAccount = this.solana.getActiveAccount()
    if (!payerAccount) return null

    const transaction = new Transaction().add(
      this.initAcceptFriendRequest(
        friendKey,
        userFromKey,
        userToAccount.publicKey,
        toPaddedBuffer
      )
    )

    return sendAndConfirmTransaction(
      connection,
      transaction,
      [payerAccount, userToAccount],
      {
        commitment: Config.solana.defaultCommitment,
        preflightCommitment: Config.solana.defaultPreflightCommitment,
        ...confirmOptionsOverride,
      }
    )
  }

  denyFriendRequest(
    friendKey: PublicKey,
    userFromKey: PublicKey,
    userToAccount: Keypair,
    confirmOptionsOverride?: ConfirmOptions
  ) {
    if (!this.solana) {
      throw new Error('Friends program not initialized')
    }

    const { connection } = this.solana
    const payerAccount = this.solana.getActiveAccount()
    if (!payerAccount) return null

    const transaction = new Transaction().add(
      this.initDenyFriendRequest(
        friendKey,
        userFromKey,
        userToAccount.publicKey
      )
    )

    return sendAndConfirmTransaction(
      connection,
      transaction,
      [payerAccount, userToAccount],
      {
        commitment: Config.solana.defaultCommitment,
        preflightCommitment: Config.solana.defaultPreflightCommitment,
        ...confirmOptionsOverride,
      }
    )
  }

  removeFriendRequest(
    friendKey: PublicKey,
    userFromAccount: Keypair,
    userToKey: PublicKey,
    confirmOptionsOverride?: ConfirmOptions
  ) {
    if (!this.solana) {
      throw new Error('Friends program not initialized')
    }

    const { connection } = this.solana
    const payerAccount = this.solana.getActiveAccount()
    if (!payerAccount) return null

    const transaction = new Transaction().add(
      this.initRemoveFriendRequest(
        friendKey,
        userFromAccount.publicKey,
        userToKey
      )
    )

    return sendAndConfirmTransaction(
      connection,
      transaction,
      [payerAccount, userFromAccount],
      {
        commitment: Config.solana.defaultCommitment,
        preflightCommitment: Config.solana.defaultPreflightCommitment,
        ...confirmOptionsOverride,
      }
    )
  }

  removeFriend(
    friendKey: PublicKey,
    userFromAccount: Keypair,
    userToKey: PublicKey,
    confirmOptionsOverride?: ConfirmOptions
  ) {
    if (!this.solana) {
      throw new Error('Friends program not initialized')
    }

    const { connection } = this.solana
    const payerAccount = this.solana.getActiveAccount()
    if (!payerAccount) return null

    const transaction = new Transaction().add(
      this.initRemoveFriend(friendKey, userFromAccount.publicKey, userToKey)
    )

    return sendAndConfirmTransaction(
      connection,
      transaction,
      [payerAccount, userFromAccount],
      {
        commitment: Config.solana.defaultCommitment,
        preflightCommitment: Config.solana.defaultPreflightCommitment,
        ...confirmOptionsOverride,
      }
    )
  }

  async getFriend(friendKey: PublicKey) {
    if (!this.solana) {
      throw new Error('Friends program not initialized')
    }

    const { connection } = this.solana
    const accountInfo = await connection.getAccountInfo(
      friendKey,
      Config.solana.defaultCommitment
    )

    if (accountInfo === null) {
      return null
      //   throw new Error('Error: cannot find the account')
    }
    return friendLayout.decode(Buffer.from(accountInfo.data))
  }

  async getParsedFriend(friendKey: PublicKey) {
    if (!this.solana) {
      throw new Error('Friends program not initialized')
    }

    const { connection } = this.solana
    const accountInfo = await connection.getAccountInfo(
      friendKey,
      Config.solana.defaultCommitment
    )

    if (accountInfo === null) {
      return null
    }

    // friendLayout.decode(Buffer.from(accountInfo.data))

    return parseFriendAccount({ pubkey: friendKey, account: accountInfo })
  }

  async computeFriendAccountKey(userFromKey: PublicKey, userToKey: PublicKey) {
    const { key } = await publicKeyFromSeeds(
      [userFromKey.toBytes(), userToKey.toBytes()],
      Seeds.Friend,
      FRIENDS_PROGRAM_ID
    )

    return key
  }

  async getFriendAccountsByStatus(status: FriendStatus) {
    if (!this.solana) {
      throw new Error('Friends program not initialized')
    }

    const { connection } = this.solana

    const userAccount = this.solana.getUserAccount()
    if (!userAccount) {
      throw new Error('User account not found')
    }

    const fromKeyAndStatus = base58(
      Buffer.from([...userAccount.publicKey.toBytes(), status])
    )

    const statusAndToKey = base58(
      Buffer.from([status, ...userAccount.publicKey.toBytes()])
    )

    const outgoing = await connection.getProgramAccounts(FRIENDS_PROGRAM_ID, {
      filters: [{ memcmp: { offset: 0, bytes: fromKeyAndStatus } }],
    })

    const incoming = await connection.getProgramAccounts(FRIENDS_PROGRAM_ID, {
      filters: [{ memcmp: { offset: 32, bytes: statusAndToKey } }],
    })

    return {
      incoming: parseFriendAccounts(incoming),
      outgoing: parseFriendAccounts(outgoing),
    }
  }

  buildEventHandler(friendEvent: FriendsEvents) {
    return ({ accountId, accountInfo }: KeyedAccountInfo) => {
      const parsedFriend = parseFriendAccount({
        pubkey: accountId,
        account: accountInfo,
      })
      this.emit(friendEvent, parsedFriend)
    }
  }

  subscribeToFriendsEvents() {
    if (!this.solana) {
      throw new Error('Friends program not initialized')
    }

    const { connection } = this.solana
    const userAccount = this.solana.getUserAccount()
    if (!userAccount) {
      throw new Error('User account not found')
    }

    // Filter for incoming requests checks the status and the recipient
    // public key starting from a 32 byte offset because the account is
    // formatted that way
    // [32 bytes (sender public key)][1 byte (status)][32 bytes (recipient public key)]
    const incomingRequestBytes = base58(
      Buffer.from([FriendStatus.PENDING, ...userAccount.publicKey.toBytes()])
    )

    const incomingRequestsFilter: GetProgramAccountsFilter = {
      memcmp: { offset: 32, bytes: incomingRequestBytes },
    }

    connection.onProgramAccountChange(
      FRIENDS_PROGRAM_ID,
      this.buildEventHandler(FriendsEvents.NEW_REQUEST),
      Config.solana.defaultCommitment,
      [incomingRequestsFilter]
    )

    // Filter for new friends checks only if an outgoing request has been accepted
    // because we suppose the incoming request acceptance to be catch directly after the
    // success of the acceptRequest action
    // This filter checks the sender public key (our) and the status
    // [32 bytes (sender public key)][1 byte (status)][32 bytes (recipient public key)]
    const newFriendFromOutgoingBytes = base58(
      Buffer.from([...userAccount.publicKey.toBytes(), FriendStatus.ACCEPTED])
    )

    const newFriendFromOutgoingFilter: GetProgramAccountsFilter = {
      memcmp: { offset: 0, bytes: newFriendFromOutgoingBytes },
    }

    connection.onProgramAccountChange(
      FRIENDS_PROGRAM_ID,
      this.buildEventHandler(FriendsEvents.NEW_FRIEND),
      Config.solana.defaultCommitment,
      [newFriendFromOutgoingFilter]
    )

    // Filter for new friends checks only if an outgoing request has been denied
    // This filter checks the sender public key (our) and the status
    // [32 bytes (sender public key)][1 byte (status)][32 bytes (recipient public key)]
    const friendRequestDeniedBytes = base58(
      Buffer.from([...userAccount.publicKey.toBytes(), FriendStatus.REFUSED])
    )

    const friendRequestDeniedFilter: GetProgramAccountsFilter = {
      memcmp: { offset: 0, bytes: friendRequestDeniedBytes },
    }

    connection.onProgramAccountChange(
      FRIENDS_PROGRAM_ID,
      this.buildEventHandler(FriendsEvents.REQUEST_DENIED),
      Config.solana.defaultCommitment,
      [friendRequestDeniedFilter]
    )

    // To listen for friend removal we need to filter from both directions
    // because the account can be on from or to field depending on who was the
    // original sender of the friend request
    // This filter checks the sender public key (our) and the status
    // [32 bytes (sender public key)][1 byte (status)][32 bytes (recipient public key)]
    const friendRequestRemovedBytes = base58(
      Buffer.from([...userAccount.publicKey.toBytes(), FriendStatus.REMOVED])
    )

    const friendRequestRemovedFilter: GetProgramAccountsFilter = {
      memcmp: { offset: 0, bytes: friendRequestRemovedBytes },
    }

    connection.onProgramAccountChange(
      FRIENDS_PROGRAM_ID,
      this.buildEventHandler(FriendsEvents.FRIEND_REMOVED),
      Config.solana.defaultCommitment,
      [friendRequestRemovedFilter]
    )

    const friendRequestRemovedMirroredBytes = base58(
      Buffer.from([FriendStatus.REMOVED, ...userAccount.publicKey.toBytes()])
    )

    const friendRequestRemovedMirroredFilter: GetProgramAccountsFilter = {
      memcmp: { offset: 32, bytes: friendRequestRemovedMirroredBytes },
    }

    connection.onProgramAccountChange(
      FRIENDS_PROGRAM_ID,
      this.buildEventHandler(FriendsEvents.FRIEND_REMOVED),
      Config.solana.defaultCommitment,
      [friendRequestRemovedMirroredFilter]
    )
  }

  addEventListener(
    type: FriendsEvents,
    callback: (friendAccount?: FriendAccount) => void
  ) {
    this.addListener(type, callback)
  }

  removeEventListener(
    type: FriendsEvents,
    listener: (friendAccount?: FriendAccount) => void
  ) {
    this.removeListener(type, listener)
  }
}
