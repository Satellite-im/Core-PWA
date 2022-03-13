import { EventEmitter } from 'events'
import {
  IdlTypes,
  Program,
  Provider,
  utils,
  Wallet,
} from '@project-serum/anchor'
import { TypeDef } from '@project-serum/anchor/dist/cjs/program/namespace/types'
import {
  GetProgramAccountsFilter,
  KeyedAccountInfo,
  PublicKey,
  SystemProgram,
} from '@solana/web3.js'
import base58 from 'micro-base58'
import { Friends, IDL } from './FriendsProgram.idl'
import {
  FriendAccount,
  FriendsEvents,
  FriendStatus,
} from './FriendsProgram.types'
import { Config } from '~/config'
import Solana from '~/libraries/Solana/SolanaManager/SolanaManager'

export const FRIENDS_PROGRAM_ID = new PublicKey(
  Config.solana.friendsProgramExId,
)

export default class FriendsProgram extends EventEmitter {
  solana?: Solana
  program?: Program<Friends>
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

    const payer = this._getPayer()

    const provider = new Provider(this.solana.connection, new Wallet(payer), {
      commitment: Config.solana.defaultCommitment,
    })

    this.program = new Program<Friends>(IDL, FRIENDS_PROGRAM_ID, provider)
  }

  /**
   * @method _getSolana
   * Returns the solana instance for friends
   * @returns the solana instance
   */
  protected _getSolana() {
    if (!this.solana) {
      throw new Error('Solana not initialized')
    }

    return this.solana
  }

  /**
   * @method _getProgram
   * Returns the anchor program instance for friends
   * @returns the anchor program instance
   */
  protected _getProgram() {
    if (!this.program) {
      throw new Error('Friends program not initialized')
    }

    return this.program
  }

  /**
   * @method _getPayer
   * Retrieve the active account from Solana wallet
   * @returns the payer account
   */
  protected _getPayer() {
    const payer = this.solana?.getActiveAccount()

    if (!payer) {
      throw new Error('Missing payer')
    }

    return payer
  }

  /**
   * @method getPayer
   * Retrieve the active account from Solana wallet
   * @returns the payer account
   */
  getPayer() {
    return this._getPayer()
  }

  /**
   * @method makeRequest
   * make frend request
   * @param to receipient key
   */
  async makeRequest(to: PublicKey, k: String) {
    const program = this._getProgram()

    const payer = this._getPayer()

    const request = this.requestKey(payer.publicKey, to)
    await program.rpc.makeRequest(payer.publicKey, to, k, {
      accounts: {
        request,
        user: payer.publicKey,
        payer: payer.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [payer],
    })
  }

  /**
   * @method denyRequest
   * deny friend request
   * @param request friend request key
   */
  async denyRequest(request: PublicKey) {
    const program = this._getProgram()

    const payer = this._getPayer()

    await program.rpc.denyRequest({
      accounts: {
        request,
        user: payer.publicKey,
      },
      signers: [payer],
    })
  }

  /**
   * @method acceptRequest
   * accept friend request
   * @param request
   */
  async acceptRequest(request: PublicKey, k: String) {
    const program = this._getProgram()

    const payer = this._getPayer()

    await program.rpc.acceptRequest(k, {
      accounts: {
        request,
        user: payer.publicKey,
      },
      signers: [payer],
    })
  }

  /**
   * @method removeRequest
   * remove friend request
   * @param request friend request key
   */
  async removeRequest(request: PublicKey) {
    const program = this._getProgram()

    const payer = this._getPayer()

    await program.rpc.removeRequest({
      accounts: {
        request,
        user: payer.publicKey,
        payer,
      },
      signers: [payer],
    })
  }

  /**
   * @method removeFriend
   * remove friend
   * @param to
   */
  async removeFriend(request: PublicKey) {
    const program = this._getProgram()

    const payer = this._getPayer()

    await program.rpc.removeFriend({
      accounts: {
        request,
        user: payer.publicKey,
      },
      signers: [payer],
    })
  }

  public requestKey(from: PublicKey, to: PublicKey) {
    const program = this._getProgram()
    const request = utils.publicKey.findProgramAddressSync(
      [from.toBuffer(), to.toBuffer()],
      program.programId,
    )
    return request[0]
  }

  /**
   * @method getAccountsByStatus
   * Gets all the friend accounts related to the program, filtered by the
   * given status code
   * @param status the status code to filter
   * (0 not assigned, 1 pending, 2 accepted, 3 refused, 4 removed)
   * @returns a list of incoming and outgoing requests filtered by status
   */
  async getFriendAccountsByStatus(
    status: FriendStatus,
  ): Promise<{ incoming: FriendAccount[]; outgoing: FriendAccount[] }> {
    const program = this._getProgram()

    const payer = this._getPayer()

    const fromKeyAndStatus = base58(
      Buffer.from([...payer.publicKey.toBytes(), status]),
    )

    const statusAndToKey = base58(
      Buffer.from([status, ...payer.publicKey.toBytes()]),
    )

    const outgoingTemp = await program.account.friendRequest.all([
      {
        memcmp: { offset: 8, bytes: fromKeyAndStatus },
      },
    ])

    const incomingTemp = await program.account.friendRequest.all([
      {
        memcmp: { offset: 8 + 32, bytes: statusAndToKey },
      },
    ])

    const outgoing = outgoingTemp.map(this._parseAccount)
    const incoming = incomingTemp.map(this._parseAccount)

    return {
      incoming,
      outgoing,
    }
  }

  /**
   * @method getFriendAccount
   * Retrieves a friend account from a given public key
   * @param requestKey the public key of the friend account
   * @returns the raw friend account object
   */
  async getFriendAccount(requestKey: PublicKey) {
    const program = this._getProgram()
    try {
      const account = await program.account.friendRequest.fetch(requestKey)
      if (account === null) {
        return null
      }
      return this._parseAccount({ publicKey: requestKey, account })
    } catch (error) {
      console.log(error)
      return null
    }
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
    const { from, to, status, fromEncryptedKey, toEncryptedKey } = account
    return {
      accountId: publicKey.toString(),
      from: from.toString(),
      status: status as unknown as number,
      to: to.toString(),
      fromMailboxId: fromEncryptedKey as string,
      toMailboxId: toEncryptedKey as string,
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
    const solana = this._getSolana()
    const payer = this._getPayer()
    const program = this._getProgram()
    const { connection } = solana

    const incomingRequestBytes = base58(
      Buffer.from([FriendStatus.PENDING, ...payer.publicKey.toBytes()]),
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
      Buffer.from([...payer.publicKey.toBytes(), FriendStatus.ACCEPTED]),
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
      Buffer.from([...payer.publicKey.toBytes(), FriendStatus.REFUSED]),
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
    const friendRequestRemovedBytes = base58(
      Buffer.from([...payer.publicKey.toBytes(), FriendStatus.REMOVED]),
    )

    const friendRequestRemovedFilter: GetProgramAccountsFilter = {
      memcmp: { offset: 8, bytes: friendRequestRemovedBytes },
    }

    connection.onProgramAccountChange(
      FRIENDS_PROGRAM_ID,
      this.buildEventHandler(FriendsEvents.FRIEND_REMOVED),
      Config.solana.defaultCommitment,
      [friendRemovedFilter],
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
