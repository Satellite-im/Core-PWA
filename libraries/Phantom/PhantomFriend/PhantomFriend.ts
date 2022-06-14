import { EventEmitter } from 'events'
import { Program, web3, utils, IdlTypes } from '@project-serum/anchor'

import {
  GetProgramAccountsFilter,
  KeyedAccountInfo,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js'
import { TypeDef } from '@project-serum/anchor/dist/cjs/program/namespace/types'
import base58 from 'micro-base58'
import PhantomManager from '../PhantomManager/PhantomManager'
import {
  FriendAccount,
  FriendsEvents,
  FriendStatus,
} from '../../Solana/FriendsProgram/FriendsProgram.types'
import { Friends, IDL } from '../../Solana/FriendsProgram/FriendsProgram.idl'
import { Config } from '../../../config'

export const FRIENDS_PROGRAM_ID = new PublicKey(
  Config.solana.friendsProgramExId,
)

export default class PhantomFriends extends EventEmitter {
  phantomManager?: PhantomManager
  program?: Program<Friends>
  subscriptions?: { [eventName: string]: number }

  constructor(phantomManager: PhantomManager) {
    super()
    if (phantomManager) {
      this.init(phantomManager)
    }
  }

  init(phantomManager: PhantomManager) {
    this.phantomManager = phantomManager

    const provider = this._getPhantomManager()._getProvider()

    this.program = new Program<Friends>(IDL, FRIENDS_PROGRAM_ID, provider)
  }

  /**
   * @method _getPhantomManager
   * Retrieve the phantom manager instance
   */
  protected _getPhantomManager() {
    if (!this.phantomManager) {
      throw new Error('Phantom Manager not initialized')
    }
    return this.phantomManager
  }

  /**
   * @method _getProgram
   * Returns the anchor program instance for group chat
   * @returns the anchor program instance
   */
  protected _getProgram() {
    if (!this.program) {
      throw new Error('Group Chat Manager not initialized')
    }

    return this.program
  }

  /**
   * @method _getPayer
   * Retrieve the active account from Solana wallet
   * @returns the payer account
   */
  protected _getPayer() {
    const payer = this._getPhantomManager().getwalletPublicKey()
    if (!payer) {
      throw new Error('Missing payer')
    }

    return payer
  }

  /**
   * @method _parseAccount
   * Parse the account as FriendAccount
   * @param account
   * @returns the account
   */
  protected _parseAccount({
    publicKey,
    account,
  }: {
    publicKey: PublicKey
    account: TypeDef<Friends['accounts'][0], IdlTypes<Friends>>
  }): FriendAccount {
    const {
      from,
      to,
      status: statusObject,
      fromEncryptedKey,
      toEncryptedKey,
    }: {
      from: PublicKey
      to: PublicKey
      status: any
      fromEncryptedKey: any
      toEncryptedKey: any
    } = account
    const status = statusObject.pending
      ? FriendStatus.PENDING
      : statusObject.accepted
      ? FriendStatus.ACCEPTED
      : statusObject.denied
      ? FriendStatus.DENIED
      : statusObject.removed
      ? FriendStatus.REMOVED
      : FriendStatus.UNINITIALIZED
    return {
      accountId: publicKey.toString(),
      from: from.toString(),
      status,
      to: to.toString(),
      fromMailboxId: fromEncryptedKey as string,
      toMailboxId: toEncryptedKey as string,
    }
  }

  /**
   * @method makeRequest
   * Make friend request
   * @param request friend request account publickey
   * @param first sender or recipient public key, whichever is greater (in bytes)
   * @param second sender or recipient public key, whichever is smaller (in bytes)
   * @param k textile encryption key for sender
   * @returns transaction hash string of make friend request
   */
  async makeRequest(
    request: PublicKey,
    first: PublicKey,
    second: PublicKey,
    k: String,
  ) {
    const program = this._getProgram()

    const payer = this._getPayer()

    // Throws if Adapter is not set
    const $PhantomWalletAdapter = this._getPhantomManager().getAdapter()

    const tx = program.transaction.makeRequest(first, second, k, {
      accounts: {
        request,
        user: payer,
        payer,
        systemProgram: SystemProgram.programId,
      },
    })

    tx.recentBlockhash = (
      await this._getPhantomManager().connection.getLatestBlockhash()
    ).blockhash

    tx.feePayer = payer
    const signed = await $PhantomWalletAdapter?.signTransaction(tx)
    const sent = await $PhantomWalletAdapter?.sendTransaction(
      signed,
      this._getPhantomManager().connection,
    )

    return sent
  }

  /**
   * @method denyRequest
   * Deny friend request
   * @param request friend request account public key
   * @returns transaction hash string of deny friend request
   */
  async denyRequest(request: PublicKey) {
    const program = this._getProgram()

    const payer = this._getPayer()

    // Throws if Adapter is not set
    const $PhantomWalletAdapter = this._getPhantomManager().getAdapter()

    const tx = program.transaction.denyRequest({
      accounts: {
        request,
        user: payer,
      },
    })
    tx.recentBlockhash = (
      await this._getPhantomManager().connection.getLatestBlockhash()
    ).blockhash

    tx.feePayer = payer
    const signed = await $PhantomWalletAdapter?.signTransaction(tx)
    const sent = await $PhantomWalletAdapter?.sendTransaction(
      signed,
      this._getPhantomManager().connection,
    )

    return sent
  }

  /**
   * @method acceptRequest
   * Accept friend request
   * @param request friend request account public key
   * @param k textile encryption key for recipient
   * @returns transaction hash of accept friend request
   */
  async acceptRequest(request: PublicKey, k: String) {
    const program = this._getProgram()

    const payer = this._getPayer()

    // Throws if Adapter is not set
    const $PhantomWalletAdapter = this._getPhantomManager().getAdapter()

    const tx = program.transaction.acceptRequest(k, {
      accounts: {
        request,
        user: payer,
      },
    })

    tx.feePayer = payer
    const signed = await $PhantomWalletAdapter?.signTransaction(tx)
    const sent = await $PhantomWalletAdapter?.sendTransaction(
      signed,
      this._getPhantomManager().connection,
    )

    return sent
  }

  /**
   * @method removeRequest
   * Remove friend request
   * @param request friend request account public key
   */
  async removeRequest(request: PublicKey) {
    const program = this._getProgram()

    const payer = this._getPayer()

    // Throws if Adapter is not set
    const $PhantomWalletAdapter = this._getPhantomManager().getAdapter()

    const tx = program.transaction.removeRequest({
      accounts: {
        request,
        user: payer,
      },
    })

    tx.feePayer = payer
    const signed = await $PhantomWalletAdapter?.signTransaction(tx)
    const sent = await $PhantomWalletAdapter?.sendTransaction(
      signed,
      this._getPhantomManager().connection,
    )

    return sent
  }

  /**
   * @method closeRequest
   * Close friend request from sender's side
   * @param request friend request account public key
   */
  async closeRequest(request: PublicKey) {
    const program = this._getProgram()

    const payer = this._getPayer()

    // Throws if Adapter is not set
    const $PhantomWalletAdapter = this._getPhantomManager().getAdapter()

    const tx = program.transaction.closeRequest({
      accounts: {
        request,
        user: payer,
        payer,
      },
    })

    tx.feePayer = payer
    const signed = await $PhantomWalletAdapter?.signTransaction(tx)
    const sent = await $PhantomWalletAdapter?.sendTransaction(
      signed,
      this._getPhantomManager().connection,
    )

    return sent
  }

  /**
   * @method removeFriend
   * Remove friend
   * @param request friend request account public key
   */
  async removeFriend(request: PublicKey) {
    const program = this._getProgram()

    const payer = this._getPayer()

    // Throws if Adapter is not set
    const $PhantomWalletAdapter = this._getPhantomManager().getAdapter()

    const tx = program.transaction.removeFriend({
      accounts: {
        request,
        user: payer,
      },
    })

    tx.feePayer = payer
    const signed = await $PhantomWalletAdapter?.signTransaction(tx)
    const sent = await $PhantomWalletAdapter?.sendTransaction(
      signed,
      this._getPhantomManager().connection,
    )

    return sent
  }

  /**
   * @method removeFriendAndCloseAccount
   * Remove friend and close friend request account
   * @param request friend request account public key
   * @param closeAccountAndRefund original sender public key to refund after closing the account
   */
  async removeFriendAndCloseAccount(
    request: PublicKey,
    closeAccountAndRefund?: PublicKey,
  ) {
    const program = this._getProgram()

    const payer = this._getPayer()

    // Throws if Adapter is not set
    const $PhantomWalletAdapter = this._getPhantomManager().getAdapter()

    const removeFriendInstruction = program.instruction.removeFriend({
      accounts: {
        request,
        user: payer,
      },
    })

    const atomicTransaction = new Transaction()

    atomicTransaction.add(removeFriendInstruction)

    if (closeAccountAndRefund) {
      const closeRequestInstruction = program.instruction.closeRequest({
        accounts: {
          request,
          user: payer,
          payer: closeAccountAndRefund,
        },
      })

      atomicTransaction.add(closeRequestInstruction)
    }

    atomicTransaction.feePayer = payer
    const signed = await $PhantomWalletAdapter?.signTransaction(
      atomicTransaction,
    )

    const sent = await $PhantomWalletAdapter?.sendTransaction(
      signed,
      this._getPhantomManager().connection,
    )

    return sent
  }

  /**
   * @method computeAccountKeys
   * Computes the friend account public key from 2 given public keys
   * @param from the public key to be used at position 0
   * @param to the public key to be used at position 1
   * @returns the computed public key
   */
  public computeAccountKeys(from: PublicKey, to: PublicKey) {
    const program = this._getProgram()

    const [first, second] = [from, to].sort((a: PublicKey, b: PublicKey) => {
      const aValue = parseInt(a.toBuffer().toString('hex'), 16)
      const bValue = parseInt(b.toBuffer().toString('hex'), 16)
      return bValue - aValue
    })

    const request = utils.publicKey.findProgramAddressSync(
      [first.toBuffer(), second.toBuffer()],
      program.programId,
    )
    return { request: request[0], first, second }
  }

  /**
   * @method getIncomingAccountsByStatus
   * Gets all incoming friend accounts related to the program, filtered by the given status code
   * @param status the status code to filter
   * (0 not assigned, 1 pending, 2 accepted, 3 refused, 4 removed)
   * @returns a list of incoming filtered by status
   */
  async getIncomingAccountsByStatus(
    status: FriendStatus,
  ): Promise<FriendAccount[]> {
    const program = this._getProgram()

    const payer = this._getPayer()

    const statusAndToKey = base58(Buffer.from([status, ...payer.toBytes()]))

    const incomingTemp = await program.account.friendRequest.all([
      {
        memcmp: { offset: 32 + 8, bytes: statusAndToKey },
      },
    ])

    const incoming = incomingTemp.map(this._parseAccount)
    return incoming
  }

  /**
   * @method getOutgoingAccountsByStatus
   * Gets all outgoing friend accounts related to the program, filtered by given status code
   * @param status the status code to filter
   * (0 not assigned, 1 pending, 2 accepted, 3 refused, 4 removed)
   * @returns a list of outgoing filtered by status
   */
  async getOutgoingAccountsByStatus(
    status: FriendStatus,
  ): Promise<FriendAccount[]> {
    const program = this._getProgram()

    const payer = this._getPayer()

    const fromKeyAndStatus = base58(Buffer.from([...payer.toBytes(), status]))

    const outgoingTemp = await program.account.friendRequest.all([
      {
        memcmp: { offset: 8, bytes: fromKeyAndStatus },
      },
    ])

    const outgoing = outgoingTemp.map(this._parseAccount)
    return outgoing
  }

  /**
   * @method getAccountsByStatus
   * Gets all the friend accounts related to the program, filtered by given status code
   * @param status the status code to filter
   * (0 not assigned, 1 pending, 2 accepted, 3 refused, 4 removed)
   * @returns a list of incoming and outgoing requests filtered by status
   */
  async getAccountsByStatus(
    status: FriendStatus,
  ): Promise<{ incoming: FriendAccount[]; outgoing: FriendAccount[] }> {
    const [incoming, outgoing] = await Promise.all([
      this.getIncomingAccountsByStatus(status),
      this.getOutgoingAccountsByStatus(status),
    ])
    return {
      incoming,
      outgoing,
    }
  }

  /**
   * @method getAccount
   * Retrieves a friend account from a given public key
   * @param accountKey the public key of the friend account
   * @returns the raw friend account object
   */
  async getAccount(accountKey: PublicKey) {
    const program = this._getProgram()
    try {
      const account = await program.account.friendRequest.fetch(accountKey)
      return this._parseAccount({ publicKey: accountKey, account })
    } catch (error) {
      return null
    }
  }

  /**
   * @method getAccountStatus
   * Retrieves a friend account from a given public key
   * @param accountKey the public key of the friend account
   * @returns the account status code
   */
  async getAccountStatus(accountKey: PublicKey) {
    const program = this._getProgram()
    try {
      const account = await program.account.friendRequest.fetch(accountKey)
      return this._parseAccount({ publicKey: accountKey, account }).status
    } catch (error) {
      return FriendStatus.UNINITIALIZED
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
      const program = this._getProgram()
      const account: TypeDef<
        Friends['accounts'][0],
        IdlTypes<Friends>
      > = program.account.friendRequest.coder.accounts.decode(
        'friendRequest',
        accountInfo.data,
      )
      this.emit(
        friendEvent,
        this._parseAccount({ publicKey: accountId, account }),
      )
    }
  }

  /**
   * @method subscribeToEvents
   * Subscribes to all friends events internally
   * External listeners can be registered using the addEventListener function
   */
  subscribeToEvents() {
    // Throws if Adapter is not set
    const $PhantomManager = this._getPhantomManager()

    const payer = this._getPayer()
    const connection = $PhantomManager._getConnection()

    const incomingRequestBytes = base58(
      Buffer.from([FriendStatus.PENDING, ...payer.toBytes()]),
    )

    const incomingRequestsFilter: GetProgramAccountsFilter = {
      memcmp: { offset: 32 + 8, bytes: incomingRequestBytes },
    }

    connection.onProgramAccountChange(
      FRIENDS_PROGRAM_ID,
      this.buildEventHandler(FriendsEvents.NEW_REQUEST),
      Config.solana.defaultCommitment,
      [incomingRequestsFilter],
    )

    // Filter for new friends checks only if an outgoing request has been accepted
    // because we suppose the incoming request acceptance to be catch directly after the
    // success of the acceptRequest action
    // This filter checks the sender public key (our) and the status
    // [32 bytes (sender public key)][1 byte (status)][32 bytes (recipient public key)]
    const newFriendFromOutgoingBytes = base58(
      Buffer.from([...payer.toBytes(), FriendStatus.ACCEPTED]),
    )

    const newFriendFromOutgoingFilter: GetProgramAccountsFilter = {
      memcmp: { offset: 8, bytes: newFriendFromOutgoingBytes },
    }

    connection.onProgramAccountChange(
      FRIENDS_PROGRAM_ID,
      this.buildEventHandler(FriendsEvents.NEW_FRIEND),
      Config.solana.defaultCommitment,
      [newFriendFromOutgoingFilter],
    )

    // Filter for new friends checks only if an outgoing request has been denied
    // This filter checks the sender public key (our) and the status
    // [32 bytes (sender public key)][1 byte (status)][32 bytes (recipient public key)]
    const friendRequestDeniedBytes = base58(
      Buffer.from([...payer.toBytes(), FriendStatus.DENIED]),
    )

    const friendRequestDeniedFilter: GetProgramAccountsFilter = {
      memcmp: { offset: 8, bytes: friendRequestDeniedBytes },
    }

    connection.onProgramAccountChange(
      FRIENDS_PROGRAM_ID,
      this.buildEventHandler(FriendsEvents.REQUEST_DENIED),
      Config.solana.defaultCommitment,
      [friendRequestDeniedFilter],
    )

    // To listen for friend removal we need to filter from both directions
    // because the account can be on from or to field depending on who was the
    // original sender of the friend request
    // This filter checks the sender public key (our) and the status
    // [32 bytes (sender public key)][1 byte (status)][32 bytes (recipient public key)]
    const friendRemovedBytes = base58(
      Buffer.from([...payer.toBytes(), FriendStatus.REMOVED]),
    )

    const friendRemovedFilter: GetProgramAccountsFilter = {
      memcmp: { offset: 8, bytes: friendRemovedBytes },
    }

    connection.onProgramAccountChange(
      FRIENDS_PROGRAM_ID,
      this.buildEventHandler(FriendsEvents.FRIEND_REMOVED),
      Config.solana.defaultCommitment,
      [friendRemovedFilter],
    )

    const friendRemovedMirroredBytes = base58(
      Buffer.from([FriendStatus.REMOVED, ...payer.toBytes()]),
    )

    const friendRemovedMirroredFilter: GetProgramAccountsFilter = {
      memcmp: { offset: 32 + 8, bytes: friendRemovedMirroredBytes },
    }

    connection.onProgramAccountChange(
      FRIENDS_PROGRAM_ID,
      this.buildEventHandler(FriendsEvents.FRIEND_REMOVED),
      Config.solana.defaultCommitment,
      [friendRemovedMirroredFilter],
    )

    // Filter for remove friend requests checks only if an incoming request has been removed
    // This filter checks the status and recipient public key
    // [32 bytes (sender public key)][1 byte (status)][32 bytes (recipient public key)]
    const friendRequestRemovedBytes = base58(
      Buffer.from([FriendStatus.REQUEST_REMOVED, ...payer.toBytes()]),
    )

    const friendRequestRemovedFilter: GetProgramAccountsFilter = {
      memcmp: { offset: 32 + 8, bytes: friendRequestRemovedBytes },
    }

    connection.onProgramAccountChange(
      FRIENDS_PROGRAM_ID,
      this.buildEventHandler(FriendsEvents.REQUEST_REMOVED),
      Config.solana.defaultCommitment,
      [friendRequestRemovedFilter],
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
}
