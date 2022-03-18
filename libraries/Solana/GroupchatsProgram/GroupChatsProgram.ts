import { EventEmitter } from 'events'
import { Program, Provider, utils, Wallet } from '@project-serum/anchor'
import {
  GetProgramAccountsFilter,
  KeyedAccountInfo,
  PublicKey,
  SystemProgram,
} from '@solana/web3.js'
import {
  Group,
  Groupchats,
  GroupEvents,
  GroupEventsFilter,
  IDL,
  InvitationAccount,
  InvitationAccountsFilter,
  RawGroup,
} from './GroupchatsProgram.types'
import { Config } from '~/config'
import GroupCrypto from '~/libraries/Solana/GroupchatsProgram/GroupCrypto'
import Solana from '~/libraries/Solana/SolanaManager/SolanaManager'

export const GROUPCHATS_PROGRAM_ID = new PublicKey(
  Config.solana.groupchatsProgramId,
)

const groupSeed = Buffer.from(utils.bytes.utf8.encode('groupchat'))
const inviteSeed = Buffer.from(utils.bytes.utf8.encode('invite'))

export default class GroupChatsProgram extends EventEmitter {
  solana?: Solana
  program?: Program<Groupchats>
  subscriptions?: { [eventName: string]: number }
  _crypto?: GroupCrypto

  get crypto() {
    if (!this._crypto) {
      throw new Error('Group crypto not initialized')
    }
    return this._crypto
  }

  constructor(solana: Solana) {
    super()
    if (solana) {
      this.init(solana)
      this._crypto = new GroupCrypto(this._getPayer())
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

    this.program = new Program<Groupchats>(
      IDL,
      GROUPCHATS_PROGRAM_ID.toBase58(),
      provider,
    )
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
    const payer = this.solana?.getActiveAccount()

    if (!payer) {
      throw new Error('Missing payer')
    }

    return payer
  }

  /**
   * @method _getGroupHash
   * Get the hash from Group ID
   * @param groupId Group Id
   * @returns the hash
   */
  protected _getGroupHash(groupId: string) {
    return Buffer.from(utils.sha256.hash(groupId), 'hex')
  }

  /**
   * @method _groupPDAPublicKey
   * Computes a group PDA for the given Public Key
   * @param address String version of the Public Key
   * @returns the computed PDA
   */
  protected _groupPDAPublicKey(groupHash: Buffer) {
    const program = this._getProgram()
    return utils.publicKey.findProgramAddressSync(
      [groupHash, groupSeed],
      program.programId,
    )
  }

  /**
   * @method _invitePDAPublicKey
   * Computes a invite PDA for the given Public Key
   * @param user Public Key of user
   * @param group Public Key of group
   * @returns the computed PDA
   */
  protected _invitePDAPublicKey(user: PublicKey, group: PublicKey) {
    const program = this._getProgram()
    return utils.publicKey.findProgramAddressSync(
      [user.toBytes(), group.toBytes(), inviteSeed],
      program.programId,
    )
  }

  /**
   * Computes group address by given id
   * @param id
   * @protected
   */
  protected getGroupAddressById(id: string) {
    const [address] = this._groupPDAPublicKey(this._getGroupHash(id))
    return address
  }

  async getGroup(groupAddress: PublicKey | string) {
    try {
      const program = this._getProgram()
      return await program.account.group.fetch(groupAddress)
    } catch (e: any) {
      throw new Error('Unable to fetch group: ' + e.message)
    }
  }

  async getInvitation(invitationAddress: PublicKey | string) {
    const program = this._getProgram()
    return await program.account.invitation.fetch(invitationAddress)
  }

  /**
   * @method create
   * Create a new group
   * @param groupId Group id
   * @param name Group name
   */
  async create(groupId: string, name: string): Promise<Group> {
    // Throws if the program is not set
    const program = this._getProgram()

    // Throws if the payer is not set
    const payer = this._getPayer()

    const groupHash = this._getGroupHash(groupId)

    const groupPDA = this._groupPDAPublicKey(groupHash)
    const inviterPDA = this._invitePDAPublicKey(payer.publicKey, groupPDA[0])

    const encryptionKey = this.crypto.generateEncryptionKey()

    const encrypted = await this.crypto.encryptInvite({
      groupId,
      encryptionKey,
      sender: payer.publicKey,
      recipient: payer.publicKey,
      groupKey: groupPDA[0],
    })
    await program.rpc.create(
      groupHash,
      encrypted.groupId,
      true,
      name,
      encrypted.encryptionKey,
      1,
      {
        accounts: {
          group: groupPDA[0],
          invitation: inviterPDA[0],
          signer: payer.publicKey,
          payer: payer.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [payer],
      },
    )

    return {
      id: groupId,
      name,
      admin: payer.publicKey.toBase58(),
      creator: payer.publicKey.toBase58(),
      members: 1,
      openInvites: true,
      encryptionKey,
    }
  }

  buildInvitationAccountFilter(
    filter: InvitationAccountsFilter,
  ): GetProgramAccountsFilter[] {
    const filters = []
    const offsets: { [key: string]: number } = {
      sender: 8,
      groupKey: 40,
      recipient: 72,
    }

    for (const [key, value] of Object.entries(filter)) {
      filters.push({
        memcmp: {
          offset: offsets[key],
          bytes: value.toString(),
        },
      })
    }
    return filters
  }

  /**
   * Returns invitation accounts with optional filtering
   * @param filter {InvitationAccountsFilter}
   * @returns Promise<InvitationAccount[]>
   */
  async getInvitationAccounts(
    filter: InvitationAccountsFilter = {},
  ): Promise<InvitationAccount[]> {
    const program = this._getProgram()

    const filters = this.buildInvitationAccountFilter(filter)
    const accounts = await program.account.invitation.all(filters)

    return accounts as InvitationAccount[]
  }

  /**
   * Returns group by given id
   * @param groupId {string} id of the group
   * @returns Promise<Group>
   */
  async getGroupById(groupId: string): Promise<Group> {
    const payer = this._getPayer()
    const groupHash = this._getGroupHash(groupId)
    const [groupPDA] = this._groupPDAPublicKey(groupHash)

    const group = (await this.getGroup(groupPDA)) as RawGroup

    const [invite] = await this.getInvitationAccounts({
      groupKey: groupPDA,
      recipient: payer.publicKey,
    })

    if (!invite) throw new Error('User is not a member of the group')
    const decoded = await this.crypto.decryptInvite(invite.account)

    return {
      ...group,
      id: groupId,
      admin: group.admin.toString(),
      creator: group.creator.toString(),
      encryptionKey: decoded.encryptionKey,
    }
  }

  /**
   * Returns groups the user is a member of
   * @param address {string} user address
   * @returns Promise<Group[]>
   */
  async getUserGroups(address: string | PublicKey): Promise<Group[]> {
    const inviteAccounts = await this.getInvitationAccounts({
      recipient: address,
    })
    const invites = await Promise.all(
      inviteAccounts.map((it) => this.crypto.decryptInvite(it.account)),
    )
    const program = this._getProgram()
    const keys = inviteAccounts.map((acc) => acc.account.groupKey)
    const rawGroups = (await program.account.group.fetchMultiple(
      keys,
    )) as RawGroup[]

    const groups = rawGroups
      .filter((group) => !!group)
      .map((group: RawGroup, i) => ({
        name: '<unnamed>',
        ...group,
        admin: group.admin.toString(),
        creator: group.creator.toString(),
        id: invites[i]?.groupId,
        encryptionKey: invites[i]?.encryptionKey,
      }))
    return groups
  }

  /**
   * Returns members of given group
   * @param groupId {string} group id
   * @returns Promise<string[]> array of user addresses
   */
  async getGroupUsers(groupId: string): Promise<string[]> {
    const inviteAccounts = await this.getInvitationAccounts({
      groupKey: this.getGroupAddressById(groupId),
    })
    return inviteAccounts.map((it) => it.account.recipient.toBase58())
  }

  protected buildEventFilter(
    type: GroupEvents,
    filter: GroupEventsFilter,
  ): GetProgramAccountsFilter[] {
    switch (type) {
      case GroupEvents.NEW_INVITATION:
        return this.buildInvitationAccountFilter(filter)
      default:
        throw new Error('Invalid event type')
    }
  }

  protected decodeEventPayload(
    type: GroupEvents,
    info: KeyedAccountInfo,
  ): InvitationAccount {
    const coder = this._getProgram().coder
    const { accountId, accountInfo } = info
    switch (type) {
      case GroupEvents.NEW_INVITATION:
        return {
          publicKey: accountId,
          account: coder.accounts.decode('invitation', accountInfo.data),
        }
      default:
        throw new Error('Invalid event type')
    }
  }

  /**
   * Subscribe to group events
   * @param type {GroupEvents} event type to subscribe
   * @param filter {GroupEventsFilter} event filter
   * @param callback {(payload: InvitationAccount) => void} event handler
   * @returns {number} subscription id to unsubscribe
   */
  subscribe(
    type: GroupEvents,
    callback: (payload: InvitationAccount) => void,
    filter: GroupEventsFilter = {},
  ): number {
    if (!this.solana) throw new Error('Solana not initialized')

    return this.solana.connection.onProgramAccountChange(
      GROUPCHATS_PROGRAM_ID,
      (info) => callback(this.decodeEventPayload(type, info)),
      Config.solana.defaultCommitment,
      this.buildEventFilter(type, filter),
    )
  }

  /**
   * Unsubscribe from group events
   * @param id {number} event subscription id
   * @returns Promise<void>
   */
  async unsubscribe(id: number): Promise<void> {
    if (!this.solana) throw new Error('Solana not initialized')
    try {
      return await this.solana.connection.removeProgramAccountChangeListener(id)
    } catch (e) {}
  }

  /**
   * @method invite
   * Invite new user into Group
   * @param groupId Group Id
   * @param recipient: recipient address
   */
  async invite(groupId: string, recipient: string) {
    // Throws if the program is not set
    const program = this._getProgram()

    const payer = this._getPayer()

    const user = new PublicKey(recipient)

    const groupHash = this._getGroupHash(groupId)

    const groupPDA = this._groupPDAPublicKey(groupHash)

    const inviterPDA = this._invitePDAPublicKey(payer.publicKey, groupPDA[0])

    const inviteePDA = this._invitePDAPublicKey(user, groupPDA[0])

    const [creatorInvite] = await this.getInvitationAccounts({
      groupKey: groupPDA[0],
      recipient: payer.publicKey,
    })
    if (!creatorInvite) throw new Error('Group not found')

    const decrypted = await this.crypto.decryptInvite(creatorInvite.account)

    const encrypted = await this.crypto.encryptInvite({
      ...decrypted,
      recipient: user,
    })

    await program.rpc.invite(
      encrypted.groupId,
      user,
      encrypted.encryptionKey,
      0,
      {
        accounts: {
          newInvitation: inviteePDA[0],
          group: groupPDA[0],
          invitation: inviterPDA[0],
          signer: payer.publicKey,
          payer: payer.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [payer],
      },
    )
  }

  /**
   * @method modify
   * Modifies the Group settings
   * @param groupId
   * @param openInvites
   */
  async modify(groupId: string, openInvites: boolean, successor: string) {
    const program = this._getProgram()

    const payer = this._getPayer()

    const successorKey = new PublicKey(successor)

    const groupHash = this._getGroupHash(groupId)

    const groupPDA = this._groupPDAPublicKey(groupHash)
    const successorPDA = this._invitePDAPublicKey(successorKey, groupPDA[0])

    await program.rpc.modify(openInvites, {
      accounts: {
        group: groupPDA[0],
        successor: successorPDA[0],
        admin: payer.publicKey,
      },
      signers: [payer],
    })
  }

  /**
   * @method adminLeave
   * Admin leaves group
   * @param groupId
   */
  async adminLeave(groupId: string, receipient: string) {
    const program = this._getProgram()

    const payer = this._getPayer()

    const successor = new PublicKey(receipient)

    const groupHash = this._getGroupHash(groupId)

    const groupPDA = this._groupPDAPublicKey(groupHash)

    const inviterPDA = this._invitePDAPublicKey(payer.publicKey, groupPDA[0])
    const successorPDA = this._invitePDAPublicKey(successor, groupPDA[0])

    await program.rpc.adminLeave({
      accounts: {
        group: groupPDA[0],
        invitation: inviterPDA[0],
        successor: successorPDA[0],
        signer: payer.publicKey,
        invitationSender: payer.publicKey,
      },
      signers: [payer],
    })
  }

  /**
   * @method leave
   * User leaves group
   * @param groupId
   */
  async leave(groupId: string) {
    const program = this._getProgram()

    const payer = this._getPayer()

    const groupHash = this._getGroupHash(groupId)

    const groupPDA = this._groupPDAPublicKey(groupHash)

    const group = await this.getGroup(groupPDA[0])

    const inviteePDA = this._invitePDAPublicKey(payer.publicKey, groupPDA[0])

    await program.rpc.leave({
      accounts: {
        group: groupPDA[0],
        invitation: inviteePDA[0],
        signer: payer.publicKey,
        invitationSender: group.admin,
      },
      signers: [payer],
    })
  }
}
