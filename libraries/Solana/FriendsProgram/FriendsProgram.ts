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

  /**
   * @method init
   * Initializes the class with the SolanaManager instance
   * @param solana SolanaManager instance
   */
  init(solana: Solana) {
    this.solana = solana
  }

  /**
   * @method createDerivedAccount
   * Utility function to create derived accounts that are owned by the friends program
   * @param seedKey the seed key to generate the account
   * @param seedString the seed string to generate the account
   * @param params instruction params containing the friend public key
   * @param confirmOptionsOverride Solana confirm options to be eventually
   * overwritten (eg. commitment, preflightCommitment)
   * @returns the public key of the generated account
   */
  async createDerivedAccount(
    seedKey: PublicKey,
    seedString: string,
    params: CreateFriendParams,
    confirmOptionsOverride?: ConfirmOptions,
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
      FRIENDS_PROGRAM_ID,
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

  /**
   * @method createFriend
   * Generates and initializes a friend account that represent the
   * friendship of 2 accounts
   * @param userFromKey the public key of the user that sent the request
   * @param userToKey the public key of the recipient
   * @param confirmOptionsOverride Solana confirm options to be eventually
   * overwritten (eg. commitment, preflightCommitment)
   * @returns the public key of the generated friend account
   */
  async createFriend(
    userFromKey: PublicKey,
    userToKey: PublicKey,
    confirmOptionsOverride?: ConfirmOptions,
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
      confirmOptionsOverride,
    )

    if (!friendKey) throw new Error('Derived account error')

    return friendKey
  }

  /**
   * @method initFriendRequest
   * Generate the transaction object for a new friend request to be sent
   * @param friendKey the public key of the friend account that
   * has been derived in straight order (fromKey first and toKey after)
   * @param friend2Key the public key of the friend account that
   * has been derived in mirrored order (toKey first and fromKey after)
   * @param userFromKey the public key of the sender
   * @param userToKey the public key of the recipient
   * @param fromPaddedBuffer the buffer representation of the encrypted textile
   * mailbox id related to the sender
   * @returns the generated transaction object
   */
  initFriendRequest(
    friendKey: PublicKey,
    friend2Key: PublicKey,
    userFromKey: PublicKey,
    userToKey: PublicKey,
    fromPaddedBuffer: Uint8Array,
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

  /**
   * @method initAcceptFriendRequest
   * Generate the transaction object to accept a friend request
   * @param friendKey the public key of the friend account that contains the
   * friend request to be accepted
   * @param userFromKey the public key of the sender
   * @param userToKey the public key of the recipient
   * @param toPaddedBuffer the buffer representation of the encrypted textile
   * mailbox id related to the recipient
   * @returns the generated transaction object
   */
  initAcceptFriendRequest(
    friendKey: PublicKey,
    userFromKey: PublicKey,
    userToKey: PublicKey,
    toPaddedBuffer: Uint8Array,
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

  /**
   * @method initDenyFriendRequest
   * Generates the transaction object to be sent to deny an existing friend
   * request
   * @param friendKey the public key of the friend request to be denied
   * @param userFromKey the public key of the sender
   * @param userToKey the public key of the recipient
   * @returns a transaction object ready to be sent through the network
   */
  initDenyFriendRequest(
    friendKey: PublicKey,
    userFromKey: PublicKey,
    userToKey: PublicKey,
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

  /**
   * @method initRemoveFriendRequest
   * Generates the transaction object to be sent to remove an existing friend
   * request
   * @param friendKey the public key of the friend request to be removed
   * @param userFromKey the public key of the sender
   * @param userToKey the public key of the recipient
   * @returns a transaction object ready to be sent through the network
   */
  initRemoveFriendRequest(
    friendKey: PublicKey,
    userFromKey: PublicKey,
    userToKey: PublicKey,
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

  /**
   * @method initRemoveFriend
   * Generates the transaction object to be sent to remove an existing friend
   * @param friendKey the public key of the friend account to be removed
   * @param userFromKey the public key of the sender
   * @param userToKey the public key of the recipient
   * @param initiator a flag that indicates if the request was initially sent by the current user
   * @returns a transaction object ready to be sent through the network
   */
  initRemoveFriend(
    friendKey: PublicKey,
    userFromKey: PublicKey,
    userToKey: PublicKey,
    initiator: boolean,
  ) {
    return new TransactionInstruction({
      keys: [
        { pubkey: friendKey, isSigner: false, isWritable: true },
        { pubkey: userFromKey, isSigner: initiator, isWritable: false },
        { pubkey: userToKey, isSigner: !initiator, isWritable: false },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      ],
      programId: FRIENDS_PROGRAM_ID,
      data: encodeInstructionData({
        removeFriend: {},
      }),
    })
  }

  /**
   * @method createFriendRequest
   * Generates and sends a transaction to create a new frend request and register
   * it on the network
   * @param friendKey the public key of the friend account that
   * has been derived in straight order (fromKey first and toKey after)
   * @param friend2Key the public key of the friend account that
   * has been derived in mirrored order (toKey first and fromKey after)
   * @param userFromKey the public key of the sender
   * @param userToKey the public key of the recipient
   * @param fromPaddedBuffer the buffer representation of the encrypted textile
   * mailbox id related to the sender
   * @param confirmOptionsOverride Solana confirm options to be eventually
   * overwritten (eg. commitment, preflightCommitment)
   * @returns the id of the transaction that has been sent
   */
  createFriendRequest(
    friendKey: PublicKey,
    friend2Key: PublicKey,
    userFromAccount: Keypair,
    userToKey: PublicKey,
    fromPaddedBuffer: Uint8Array,
    confirmOptionsOverride?: ConfirmOptions,
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
        fromPaddedBuffer,
      ),
    )

    return sendAndConfirmTransaction(
      connection,
      transaction,
      [payerAccount, userFromAccount],
      {
        commitment: Config.solana.defaultCommitment,
        preflightCommitment: Config.solana.defaultPreflightCommitment,
        ...confirmOptionsOverride,
      },
    )
  }

  /**
   * @method acceptFriendRequest
   * Generates and sends a transaction to accept an existing friend request. It can
   * be done only by the recipient of the request
   * @param friendKey the public key of the friend account that contains the
   * friend request to be accepted
   * @param userFromKey the public key of the sender
   * @param userToKey the public key of the recipient
   * @param toPaddedBuffer the buffer representation of the encrypted textile
   * mailbox id related to the recipient
   * @param confirmOptionsOverride Solana confirm options to be eventually
   * overwritten (eg. commitment, preflightCommitment)
   * @returns the id of the transaction that has been sent
   */
  acceptFriendRequest(
    friendKey: PublicKey,
    userFromKey: PublicKey,
    userToAccount: Keypair,
    toPaddedBuffer: Uint8Array,
    confirmOptionsOverride?: ConfirmOptions,
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
        toPaddedBuffer,
      ),
    )
    console.log('acceptFriendRequest')
    console.log('connection', connection)
    console.log('transaction', transaction)
    console.log('payerAccount', payerAccount)
    console.log('userToAccount', userToAccount)

    return sendAndConfirmTransaction(
      connection,
      transaction,
      [payerAccount, userToAccount],
      {
        commitment: Config.solana.defaultCommitment,
        preflightCommitment: Config.solana.defaultPreflightCommitment,
        ...confirmOptionsOverride,
      },
    )
  }

  /**
   * @method denyFriendRequest
   * Generates and sends a transaction to deny an existing friend request. It can
   * be done only by the recipient of the request
   * @param friendKey the public key of the friend request to be denied
   * @param userFromKey the public key of the sender
   * @param userToKey the public key of the recipient
   * @param confirmOptionsOverride Solana confirm options to be eventually
   * overwritten (eg. commitment, preflightCommitment)
   * @returns the id of the transaction that has been sent
   */
  denyFriendRequest(
    friendKey: PublicKey,
    userFromKey: PublicKey,
    userToAccount: Keypair,
    confirmOptionsOverride?: ConfirmOptions,
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
        userToAccount.publicKey,
      ),
    )

    return sendAndConfirmTransaction(
      connection,
      transaction,
      [payerAccount, userToAccount],
      {
        commitment: Config.solana.defaultCommitment,
        preflightCommitment: Config.solana.defaultPreflightCommitment,
        ...confirmOptionsOverride,
      },
    )
  }

  /**
   * @method removeFriendRequest
   * Generates and sends a transaction to remove an existing friend request. It can
   * be done only by the original sender of the request
   * @param friendKey the public key of the friend account to be removed
   * @param userFromKey the public key of the sender
   * @param userToKey the public key of the recipient
   * @param confirmOptionsOverride Solana confirm options to be eventually
   * overwritten (eg. commitment, preflightCommitment)
   * @returns the id of the transaction that has been sent
   */
  removeFriendRequest(
    friendKey: PublicKey,
    userFromAccount: Keypair,
    userToKey: PublicKey,
    confirmOptionsOverride?: ConfirmOptions,
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
        userToKey,
      ),
    )

    console.log('removeFriendRequest')
    console.log('connection', connection)
    console.log('transaction', transaction)
    console.log('payerAccount', payerAccount)
    console.log('userFromAccount', userFromAccount)

    return sendAndConfirmTransaction(
      connection,
      transaction,
      [payerAccount, userFromAccount],
      {
        commitment: Config.solana.defaultCommitment,
        preflightCommitment: Config.solana.defaultPreflightCommitment,
        ...confirmOptionsOverride,
      },
    )
  }

  /**
   * @method removeFriend
   * Generates and sends a transaction to remove an existing friend. It can be
   * done by both the sender and the recipient
   * @param friendAccount the keypair related to the friend account
   * @param confirmOptionsOverride Solana confirm options to be eventually
   * overwritten (eg. commitment, preflightCommitment)
   * @returns the id of the transaction that has been sent
   */
  removeFriend(
    friendAccount: FriendAccount,
    signer: Keypair,
    confirmOptionsOverride?: ConfirmOptions,
  ) {
    if (!this.solana) {
      throw new Error('Friends program not initialized')
    }

    const { connection } = this.solana
    const payerAccount = this.solana.getActiveAccount()
    if (!payerAccount) return null

    const friendAccountKey = new PublicKey(friendAccount.accountId)
    const userFromKey = new PublicKey(friendAccount.from)
    const userToKey = new PublicKey(friendAccount.to)

    const isInitiator = userFromKey.toBase58() === signer.publicKey.toBase58()

    const transaction = new Transaction().add(
      this.initRemoveFriend(
        friendAccountKey,
        userFromKey,
        userToKey,
        isInitiator,
      ),
    )

    console.log('removeFriend')
    console.log('connection', connection)
    console.log('transaction', transaction)
    console.log('payerAccount', payerAccount)
    console.log('signer', signer)

    return sendAndConfirmTransaction(
      connection,
      transaction,
      [payerAccount, signer],
      {
        commitment: Config.solana.defaultCommitment,
        preflightCommitment: Config.solana.defaultPreflightCommitment,
        ...confirmOptionsOverride,
      },
    )
  }

  /**
   * @method getFriend
   * Retrieves a friend account from a given public key
   * @param friendKey the public key of the friend account
   * @returns the raw friend account object
   */
  async getFriend(friendKey: PublicKey) {
    if (!this.solana) {
      throw new Error('Friends program not initialized')
    }

    const { connection } = this.solana
    const accountInfo = await connection.getAccountInfo(
      friendKey,
      Config.solana.defaultCommitment,
    )

    if (accountInfo === null) {
      return null
      //   throw new Error('Error: cannot find the account')
    }
    return friendLayout.decode(Buffer.from(accountInfo.data))
  }

  /**
   * @method getParsedFriend
   * Retrieves a friend account from a given public key and parses it
   * @param friendKey the public key of the friend account
   * @returns the parsed friend object
   */
  async getParsedFriend(friendKey: PublicKey) {
    if (!this.solana) {
      throw new Error('Friends program not initialized')
    }

    const { connection } = this.solana
    const accountInfo = await connection.getAccountInfo(
      friendKey,
      Config.solana.defaultCommitment,
    )

    if (accountInfo === null) {
      return null
    }

    // friendLayout.decode(Buffer.from(accountInfo.data))

    return parseFriendAccount({ pubkey: friendKey, account: accountInfo })
  }

  /**
   * @method computeFriendAccountKey
   * Computes the friend account key from 2 given public keys
   * @param userFromKey the public key to be used at position 0
   * @param userToKey the public key to be used at position 1
   * @returns the computed public key
   */
  async computeFriendAccountKey(userFromKey: PublicKey, userToKey: PublicKey) {
    const { key } = await publicKeyFromSeeds(
      [userFromKey.toBytes(), userToKey.toBytes()],
      Seeds.Friend,
      FRIENDS_PROGRAM_ID,
    )

    return key
  }

  /**
   * @method getFriendAccountsByStatus
   * Gets all the friend accounts related to the program, filtered by the
   * given status code
   * @param status the status code to filter
   * (0 not assigned, 1 pending, 2 accepted, 3 refused, 4 removed)
   * @returns a list of incoming and outgoing requests filtered by status
   */
  async getFriendAccountsByStatus(status: FriendStatus) {
    if (!this.solana) {
      throw new Error('Friends program not initialized')
    }

    const { connection } = this.solana

    const payerAccount = this.solana.getActiveAccount()
    if (!payerAccount) {
      throw new Error('User account not found')
    }

    const fromKeyAndStatus = base58(
      Buffer.from([...payerAccount.publicKey.toBytes(), status]),
    )

    const statusAndToKey = base58(
      Buffer.from([status, ...payerAccount.publicKey.toBytes()]),
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

  /**
   * @method buildEventHandler
   * Utility function that is used for building event handlers to
   * be used together with the emit function inherited from the EventEmitter class
   * @param friendEvent the friend event to listen
   * new_request, new_friend, request_denied, request_removed, friend_removed
   * @returns the event handler
   */
  buildEventHandler(friendEvent: FriendsEvents) {
    return ({ accountId, accountInfo }: KeyedAccountInfo) => {
      const parsedFriend = parseFriendAccount({
        pubkey: accountId,
        account: accountInfo,
      })
      this.emit(friendEvent, parsedFriend)
    }
  }

  /**
   * @method subscribeToFriendsEvents
   * Subscribes to all friends events internally
   * External listeners can be registered using the addEventListener function
   */
  subscribeToFriendsEvents() {
    if (!this.solana) {
      throw new Error('Friends program not initialized')
    }

    const { connection } = this.solana
    const payerAccount = this.solana.getActiveAccount()
    if (!payerAccount) {
      throw new Error('User account not found')
    }

    // Filter for incoming requests checks the status and the recipient
    // public key starting from a 32 byte offset because the account is
    // formatted that way
    // [32 bytes (sender public key)][1 byte (status)][32 bytes (recipient public key)]
    const incomingRequestBytes = base58(
      Buffer.from([FriendStatus.PENDING, ...payerAccount.publicKey.toBytes()]),
    )

    const incomingRequestsFilter: GetProgramAccountsFilter = {
      memcmp: { offset: 32, bytes: incomingRequestBytes },
    }

    connection.onProgramAccountChange(
      FRIENDS_PROGRAM_ID,
      this.buildEventHandler(FriendsEvents.NEW_REQUEST),
      Config.solana.defaultCommitment,
      [incomingRequestsFilter],
    )

    const incomingRequestMirroredBytes = base58(
      Buffer.from([FriendStatus.PENDING, ...payerAccount.publicKey.toBytes()]),
    )

    const incomingRequestMirroredFilter: GetProgramAccountsFilter = {
      memcmp: { offset: 32, bytes: incomingRequestMirroredBytes },
    }

    connection.onProgramAccountChange(
      FRIENDS_PROGRAM_ID,
      this.buildEventHandler(FriendsEvents.NEW_REQUEST),
      Config.solana.defaultCommitment,
      [incomingRequestMirroredFilter],
    )

    // Filter for new friends checks only if an outgoing request has been accepted
    // because we suppose the incoming request acceptance to be catch directly after the
    // success of the acceptRequest action
    // This filter checks the sender public key (our) and the status
    // [32 bytes (sender public key)][1 byte (status)][32 bytes (recipient public key)]
    const newFriendFromOutgoingBytes = base58(
      Buffer.from([...payerAccount.publicKey.toBytes(), FriendStatus.ACCEPTED]),
    )

    const newFriendFromOutgoingFilter: GetProgramAccountsFilter = {
      memcmp: { offset: 0, bytes: newFriendFromOutgoingBytes },
    }

    connection.onProgramAccountChange(
      FRIENDS_PROGRAM_ID,
      this.buildEventHandler(FriendsEvents.NEW_FRIEND),
      Config.solana.defaultCommitment,
      [newFriendFromOutgoingFilter],
    )

    const friendRequestNewMirroredBytes = base58(
      Buffer.from([FriendStatus.ACCEPTED, ...payerAccount.publicKey.toBytes()]),
    )

    const friendRequestNewMirroredFilter: GetProgramAccountsFilter = {
      memcmp: { offset: 32, bytes: friendRequestNewMirroredBytes },
    }

    connection.onProgramAccountChange(
      FRIENDS_PROGRAM_ID,
      this.buildEventHandler(FriendsEvents.NEW_FRIEND),
      Config.solana.defaultCommitment,
      [friendRequestNewMirroredFilter],
    )

    // Filter for new friends checks only if an outgoing request has been denied
    // This filter checks the sender public key (our) and the status
    // [32 bytes (sender public key)][1 byte (status)][32 bytes (recipient public key)]
    const friendRequestDeniedBytes = base58(
      Buffer.from([...payerAccount.publicKey.toBytes(), FriendStatus.REFUSED]),
    )

    const friendRequestDeniedFilter: GetProgramAccountsFilter = {
      memcmp: { offset: 0, bytes: friendRequestDeniedBytes },
    }

    connection.onProgramAccountChange(
      FRIENDS_PROGRAM_ID,
      this.buildEventHandler(FriendsEvents.REQUEST_DENIED),
      Config.solana.defaultCommitment,
      [friendRequestDeniedFilter],
    )

    const friendRequestDeniedMirroredBytes = base58(
      Buffer.from([FriendStatus.REFUSED, ...payerAccount.publicKey.toBytes()]),
    )

    const friendRequestDeniedMirroredFilter: GetProgramAccountsFilter = {
      memcmp: { offset: 32, bytes: friendRequestDeniedMirroredBytes },
    }

    connection.onProgramAccountChange(
      FRIENDS_PROGRAM_ID,
      this.buildEventHandler(FriendsEvents.REQUEST_DENIED),
      Config.solana.defaultCommitment,
      [friendRequestDeniedMirroredFilter],
    )

    // To listen for friend removal we need to filter from both directions
    // because the account can be on from or to field depending on who was the
    // original sender of the friend request
    // This filter checks the sender public key (our) and the status
    // [32 bytes (sender public key)][1 byte (status)][32 bytes (recipient public key)]
    const friendRequestRemovedBytes = base58(
      Buffer.from([...payerAccount.publicKey.toBytes(), FriendStatus.REMOVED]),
    )

    const friendRequestRemovedFilter: GetProgramAccountsFilter = {
      memcmp: { offset: 0, bytes: friendRequestRemovedBytes },
    }

    connection.onProgramAccountChange(
      FRIENDS_PROGRAM_ID,
      this.buildEventHandler(FriendsEvents.FRIEND_REMOVED),
      Config.solana.defaultCommitment,
      [friendRequestRemovedFilter],
    )

    const friendRequestRemovedMirroredBytes = base58(
      Buffer.from([FriendStatus.REMOVED, ...payerAccount.publicKey.toBytes()]),
    )

    const friendRequestRemovedMirroredFilter: GetProgramAccountsFilter = {
      memcmp: { offset: 32, bytes: friendRequestRemovedMirroredBytes },
    }

    connection.onProgramAccountChange(
      FRIENDS_PROGRAM_ID,
      this.buildEventHandler(FriendsEvents.FRIEND_REMOVED),
      Config.solana.defaultCommitment,
      [friendRequestRemovedMirroredFilter],
    )
  }

  /**
   * @method addEventListener
   * Adds a new event listener for a specific event. It's a wrapper to the
   * inherited addListener function from EventEmitter
   * @param type type of the event to subscribe
   * @param callback callback function to be invoked when the
   * event occours
   */
  addEventListener(
    type: FriendsEvents,
    callback: (friendAccount?: FriendAccount) => void,
  ) {
    this.addListener(type, callback)
  }

  /**
   * @method removeEventListener
   * Removes an event listener. It's a wrapper to the
   * inherited removeListener function from EventEmitter
   * @param type type of the event to subscribe
   * @param listener callback function to be removed
   */
  removeEventListener(
    type: FriendsEvents,
    listener: (friendAccount?: FriendAccount) => void,
  ) {
    this.removeListener(type, listener)
  }
}
