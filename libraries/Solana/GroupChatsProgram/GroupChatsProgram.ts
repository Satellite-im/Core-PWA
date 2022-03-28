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
  GroupChats,
  GroupEvents,
  GroupEventsFilter,
  IDL,
  InvitationAccount,
  InvitationAccountsFilter,
  RawGroup,
  Invitation,
} from './GroupChatsProgram.types'
import { Config } from '~/config'
import GroupCrypto from '~/libraries/Solana/GroupChatsProgram/GroupCrypto'
import Solana from '~/libraries/Solana/SolanaManager/SolanaManager'

export const GROUPCHATS_PROGRAM_ID = new PublicKey(
  Config.solana.groupchatsProgramId,
)

const groupSeed = Buffer.from(utils.bytes.utf8.encode('groupchat'))
const inviteSeed = Buffer.from(utils.bytes.utf8.encode('invite'))

export default class GroupChatsProgram extends EventEmitter {
  /**
   * SolanaManager instance
   * @private
   */
  private _solana?: Solana
  /**
   * anchor program instance for group chat
   * @private
   */
  private _program?: Program<GroupChats>
  private _crypto?: GroupCrypto

  get crypto() {
    if (!this._crypto) {
      throw new Error('Group crypto not initialized')
    }
    return this._crypto
  }

  get program(): Program<GroupChats> {
    if (!this._program) {
      throw new Error('Group Chat Manager not initialized')
    }
    return this._program
  }

  get solana(): Solana {
    if (!this._solana) {
      throw new Error('Group Chat Program not initialized')
    }
    return this._solana
  }

  /**
   * active account from Solana wallet
   * @readonly
   */
  protected get payer() {
    const payer = this.solana.getActiveAccount()

    if (!payer) {
      throw new Error('Missing payer')
    }

    return payer
  }

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
    this._solana = solana
    this._crypto = new GroupCrypto(this.payer)

    const provider = new Provider(
      this.solana.connection,
      new Wallet(this.payer),
      {
        commitment: Config.solana.defaultCommitment,
      },
    )

    this._program = new Program<GroupChats>(
      IDL,
      GROUPCHATS_PROGRAM_ID.toBase58(),
      provider,
    )
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
    return utils.publicKey.findProgramAddressSync(
      [groupHash, groupSeed],
      this.program.programId,
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
    return utils.publicKey.findProgramAddressSync(
      [user.toBytes(), group.toBytes(), inviteSeed],
      this.program.programId,
    )
  }

  /**
   * Computes group address by given id
   * @param id {string} group id
   * @protected
   */
  protected getGroupAddressById(id: string) {
    const [address] = this._groupPDAPublicKey(this._getGroupHash(id))
    return address
  }

  /**
   * Get group by address
   * @param groupAddress
   * @returns {Promise<RawGroup>}
   */
  async getGroup(groupAddress: PublicKey | string): Promise<RawGroup> {
    try {
      return (await this.program.account.group.fetch(groupAddress)) as RawGroup
    } catch (e: any) {
      throw new Error('Unable to fetch group: ' + e.message)
    }
  }

  async getInvitation(invitationAddress: PublicKey | string) {
    return await this.program.account.invitation.fetch(invitationAddress)
  }

  /**
   * @method create
   * Create a new group
   * @param groupId Group id
   * @param name Group name
   */
  async create(groupId: string, name: string): Promise<Group> {
    // Throws if the payer is not set
    const payer = this.payer

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
    await this.program.rpc.create(
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
      address: groupPDA[0].toBase58(),
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
    const filters = this.buildInvitationAccountFilter(filter)
    const accounts = await this.program.account.invitation.all(filters)

    return accounts as InvitationAccount[]
  }

  /**
   * Returns group by given id
   * @param id {string} id of the group
   * @returns Promise<Group>
   */
  async getGroupById(id: string): Promise<Group> {
    const groupKey = this.getGroupAddressById(id)

    const rawGroup = await this.getGroup(groupKey)
    const invite = await this.getInviteByGroupId(id)

    return this.populateGroup(invite, rawGroup)
  }

  /**
   * Get user invite by group id
   * @param id {string} group id
   * @returns Promise<Invitation>
   */
  async getInviteByGroupId(id: string): Promise<Invitation> {
    const [invite] = await this.getInvitationAccounts({
      groupKey: this.getGroupAddressById(id),
      recipient: this.payer.publicKey,
    })
    if (!invite) throw new Error('Invitation account not found')

    return await this.crypto.decryptInvite(invite.account)
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

    const rawGroups = (await this.program.account.group.fetchMultiple(
      inviteAccounts.map((acc) => acc.account.groupKey),
    )) as RawGroup[]

    return invites
      .map((it, i) => this.populateGroup(it, rawGroups[i]))
      .filter((group) => !!group) as Group[]
  }

  /**
   * Helper method to create typed Group from invitation account and raw group
   * @param invite
   * @param group
   * @protected
   */
  protected populateGroup(invite: Invitation, group: RawGroup): Group {
    return {
      ...group,
      admin: group.admin.toString(),
      creator: group.creator.toString(),
      id: invite.groupId,
      encryptionKey: invite.encryptionKey,
      address: invite.groupKey.toBase58(),
    }
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

  /**
   * @method invite
   * Invite new user into Group
   * @param groupId Group Id
   * @param recipient: recipient address
   */
  async invite(groupId: string, recipient: string) {
    const payer = this.payer
    const user = new PublicKey(recipient)

    const groupKey = this.getGroupAddressById(groupId)

    const inviterPDA = this._invitePDAPublicKey(payer.publicKey, groupKey)
    const inviteePDA = this._invitePDAPublicKey(user, groupKey)

    const creatorInvite = await this.getInviteByGroupId(groupId)
    if (!creatorInvite) throw new Error('Group not found')

    const encrypted = await this.crypto.encryptInvite({
      ...creatorInvite,
      recipient: user,
    })

    await this.program.rpc.invite(
      encrypted.groupId,
      user,
      encrypted.encryptionKey,
      0,
      {
        accounts: {
          newInvitation: inviteePDA[0],
          group: groupKey,
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
  async modifyOpenInvites(groupId: string, openInvites: boolean) {
    await this.program.rpc.modifyOpenIvites(openInvites, {
      accounts: {
        group: this.getGroupAddressById(groupId),
        admin: this.payer.publicKey,
      },
      signers: [this.payer],
    })
  }

  /**
   * @method adminLeave
   * Admin leaves group
   * @param groupId
   */
  async adminLeave(groupId: string, receipient: string) {
    const payer = this.payer
    const successor = new PublicKey(receipient)
    const groupKey = this.getGroupAddressById(groupId)

    const inviterPDA = this._invitePDAPublicKey(payer.publicKey, groupKey)
    const successorPDA = this._invitePDAPublicKey(successor, groupKey)

    await this.program.rpc.adminLeave({
      accounts: {
        group: groupKey,
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
    const payer = this.payer
    const groupKey = this.getGroupAddressById(groupId)

    const group = await this.getGroup(groupKey)

    const inviteePDA = this._invitePDAPublicKey(payer.publicKey, groupKey)

    await this.program.rpc.leave({
      accounts: {
        group: groupKey,
        invitation: inviteePDA[0],
        signer: payer.publicKey,
        invitationSender: group.admin,
      },
      signers: [payer],
    })
  }

  /**
   * Helper method to get group address(group public key) by group id
   * @param id {string}
   * @private
   * @returns {PublicKey}
   */
  private groupAddressFromId(id: string): PublicKey {
    const [address] = this._groupPDAPublicKey(this._getGroupHash(id))
    return address
  }

  /**
   * Update group name
   * @param id {string} group id
   * @param name {string} new group name
   * @returns Promise<void>
   */
  async updateGroupName(id: string, name: string): Promise<void> {
    const address = this.groupAddressFromId(id)
    await this.program.rpc.modifyName(name, {
      accounts: {
        group: address,
        admin: this.payer.publicKey,
      },
    })
  }

  protected buildEventFilter(
    type: GroupEvents,
    filter: GroupEventsFilter,
  ): GetProgramAccountsFilter[] {
    switch (type) {
      case GroupEvents.GROUP_INVITE:
        return this.buildInvitationAccountFilter(filter)
      default:
        throw new Error('Invalid event type')
    }
  }

  private decodeEventPayload(
    type: GroupEvents,
    info: KeyedAccountInfo,
  ): InvitationAccount {
    const coder = this.program.coder
    const { accountId, accountInfo } = info
    switch (type) {
      case GroupEvents.GROUP_INVITE:
        return {
          publicKey: accountId,
          account: coder.accounts.decode('invitation', accountInfo.data),
        }
      default:
        throw new Error('Invalid event type')
    }
  }

  /**
   * Unsubscribe from group invite events
   * @param id {number} event subscription id
   * @returns Promise<void>
   */
  async unsubscribe(id: number): Promise<void> {
    try {
      return await this.solana.connection.removeProgramAccountChangeListener(id)
    } catch (e) {}
  }

  /**
   * Register event listener for new group invites
   * @param cb
   */
  addInviteListener(cb: (group: Group) => void): string {
    const type = GroupEvents.GROUP_INVITE
    const filter = this.buildInvitationAccountFilter({
      recipient: this.payer.publicKey.toBase58(),
    })
    const handler = async (payload: InvitationAccount) => {
      const invite = await this.crypto.decryptInvite(payload.account)
      const rawGroup = await this.getGroup(payload.account.groupKey)
      const group = this.populateGroup(invite, rawGroup)

      if (group) cb(group)
    }

    const id = this.solana.connection.onProgramAccountChange(
      GROUPCHATS_PROGRAM_ID,
      (info) => handler(this.decodeEventPayload(type, info)),
      Config.solana.defaultCommitment,
      filter,
    )

    return String(id)
  }

  /**
   * Register event listener for group updates
   * @param cb
   * @returns {string[]} array of addresses for unsubscribe
   */
  async addGroupsListener(cb: (value: Group) => void): Promise<string[]> {
    const inviteAccounts = await this.getInvitationAccounts({
      recipient: this.payer.publicKey.toBase58(),
    })
    const invites = await Promise.all(
      inviteAccounts.map((it) => this.crypto.decryptInvite(it.account)),
    )

    const handler = (payload: RawGroup, invite: Invitation) => {
      const group = this.populateGroup(invite, payload)

      if (group) cb(group)
    }

    invites.forEach((invite) => {
      this.program.account.group
        .subscribe(invite.groupKey)
        .on('change', (payload) => handler(payload, invite))
    })

    return invites.map((it) => it.groupKey.toBase58())
  }

  /**
   * Remove group updates listeners
   * @param keys
   */
  async removeGroupListeners(keys: string[]): Promise<void> {
    await Promise.all(keys.map((key) => this.removeGroupListener(key)))
  }

  /**
   * Register update listener for single group
   * @param id {string} group id
   * @param cb
   * @returns {string} address for unsubscribe
   */
  async addGroupListener(
    id: string,
    cb: (value: Group) => void,
  ): Promise<string> {
    const invite = await this.getInviteByGroupId(id)

    const handler = (payload: RawGroup) => {
      const group = this.populateGroup(invite, payload)
      if (group) cb(group)
    }

    this.program.account.group.subscribe(invite.groupKey).on('change', handler)
    return invite.groupKey.toString()
  }

  /**
   * Remove group event listener for given address
   * @param address {string}
   */
  async removeGroupListener(address: string): Promise<void> {
    try {
      await this.program.account.group.unsubscribe(address).catch()
    } catch (e) {}
  }
}
