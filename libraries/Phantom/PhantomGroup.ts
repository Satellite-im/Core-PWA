import { EventEmitter } from 'events'
import { Program, Provider, utils, Wallet } from '@project-serum/anchor'
import {
  GetProgramAccountsFilter,
  KeyedAccountInfo,
  PublicKey,
  SystemProgram,
} from '@solana/web3.js'
import PhantomManager from './PhantomManager'
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
} from '~/libraries/Solana/GroupChatsProgram/GroupChatsProgram.types'
import { Config } from '~/config'
import GroupCrypto from '~/libraries/Solana/GroupChatsProgram/GroupCrypto'

export const GROUPCHATS_PROGRAM_ID = new PublicKey(
  Config.solana.groupchatsProgramId,
)

const groupSeed = Buffer.from(utils.bytes.utf8.encode('groupchat'))
const inviteSeed = Buffer.from(utils.bytes.utf8.encode('invite'))

export default class PhantomGroup extends EventEmitter {
  phantomManager?: PhantomManager
  program?: Program<GroupChats>
  subscriptions?: { [eventName: string]: number }
  private _crypto?: GroupCrypto

  constructor(phantomManager: PhantomManager) {
    super()
    if (phantomManager) {
      this.init(phantomManager)
    }
  }

  init(phantomManager: PhantomManager) {
    this.phantomManager = phantomManager

    const provider = this._getPhantomManager()._getProvider()

    this.program = new Program<GroupChats>(
      IDL,
      GROUPCHATS_PROGRAM_ID.toBase58(),
      provider,
    )
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
      this._getProgram().programId,
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
      this._getProgram().programId,
    )
  }

  get crypto() {
    if (!this._crypto) {
      throw new Error('Group crypto not initialized')
    }
    return this._crypto
  }

  /**
   * Helper method to get group address(group public key) by group id
   * @param id {string} group id
   * @private
   * @returns {PublicKey}
   */
  private groupAddressFromId(id: string): PublicKey {
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
      return (await this._getProgram().account.group.fetch(
        groupAddress,
      )) as RawGroup
    } catch (e: any) {
      throw new Error('Unable to fetch group: ' + e.message)
    }
  }

  async getInvitation(invitationAddress: PublicKey | string) {
    return await this._getProgram().account.invitation.fetch(invitationAddress)
  }

  /**
   * @method create
   * Create a new group
   * @param groupId Group id
   * @param name Group name
   */
  async create(groupId: string, name: string): Promise<Group> {
    // Throws if the payer is not set
    const payer = this._getPayer()

    // Throws if Adapter is not set
    const $PhantomWalletAdapter = this._getPhantomManager().getAdapter()

    const groupHash = this._getGroupHash(groupId)

    const groupPDA = this._groupPDAPublicKey(groupHash)
    const inviterPDA = this._invitePDAPublicKey(payer, groupPDA[0])

    const encryptionKey = this.crypto.generateEncryptionKey()

    const encrypted = await this.crypto.encryptInvite({
      groupId,
      encryptionKey,
      sender: payer,
      recipient: payer,
      groupKey: groupPDA[0],
    })

    const tx = this._getProgram().transaction.create(
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
          signer: payer,
          payer,
          systemProgram: SystemProgram.programId,
        },
      },
    )

    tx.recentBlockhash = (
      await this._getPhantomManager().connection.getLatestBlockhash()
    ).blockhash

    tx.feePayer = payer
    const signed = await $PhantomWalletAdapter?.signTransaction(tx)
    const sent = await $PhantomWalletAdapter?.sendTransaction(
      signed,
      this._getPhantomManager().connection,
    )

    return {
      id: groupId,
      address: groupPDA[0].toBase58(),
      name,
      admin: payer.toBase58(),
      creator: payer.toBase58(),
      membersCount: 1,
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
    const accounts = await this._getProgram().account.invitation.all(filters)

    return accounts as InvitationAccount[]
  }

  /**
   * Returns group by given id
   * @param id {string} id of the group
   * @returns Promise<Group>
   */
  async getGroupById(id: string): Promise<Group> {
    const groupKey = this.groupAddressFromId(id)

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
      groupKey: this.groupAddressFromId(id),
      recipient: this._getPayer(),
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

    const rawGroups = (await this._getProgram().account.group.fetchMultiple(
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
      id: invite.groupId,
      name: group.name,
      admin: group.admin.toString(),
      creator: group.creator.toString(),
      address: invite.groupKey.toBase58(),
      encryptionKey: invite.encryptionKey,
      openInvites: group.openInvites,
      membersCount: group.members,
    }
  }

  /**
   * Returns members of given group
   * @param groupId {string} group id
   * @returns Promise<string[]> array of user addresses
   */
  async getGroupUsers(groupId: string): Promise<string[]> {
    const inviteAccounts = await this.getInvitationAccounts({
      groupKey: this.groupAddressFromId(groupId),
    })
    return inviteAccounts.map((it) => it.account.recipient.toBase58())
  }

  /**
   * Returns user addresses who are members of given groups
   * @param groupIds {string[]} array of group id
   * @returns Promise<{ id: string, users: string[] }[]>
   */
  async getGroupsUsers(
    groupIds: string[],
  ): Promise<{ id: string; users: string[] }[]> {
    const users = await Promise.all(groupIds.map(this.getGroupUsers.bind(this)))
    return groupIds.map((id, i) => ({
      id,
      users: users[i],
    }))
  }

  /**
   * @method invite
   * Invite new user into Group
   * @param groupId group id
   * @param recipient: recipient address
   */
  async invite(groupId: string, recipient: string) {
    const payer = this._getPayer()

    // Throws if Adapter is not set
    const $PhantomWalletAdapter = this._getPhantomManager().getAdapter()
    const user = new PublicKey(recipient)

    const groupKey = this.groupAddressFromId(groupId)

    const inviterPDA = this._invitePDAPublicKey(payer, groupKey)
    const inviteePDA = this._invitePDAPublicKey(user, groupKey)

    const creatorInvite = await this.getInviteByGroupId(groupId)
    if (!creatorInvite) throw new Error('Group not found')

    const encrypted = await this.crypto.encryptInvite({
      ...creatorInvite,
      recipient: user,
    })

    const tx = await this._getProgram().transaction.invite(
      encrypted.groupId,
      user,
      encrypted.encryptionKey,
      0,
      {
        accounts: {
          newInvitation: inviteePDA[0],
          group: groupKey,
          invitation: inviterPDA[0],
          signer: payer,
          payer,
          systemProgram: SystemProgram.programId,
        },
      },
    )

    tx.recentBlockhash = (
      await this._getPhantomManager().connection.getLatestBlockhash()
    ).blockhash

    tx.feePayer = payer
    const signed = await $PhantomWalletAdapter?.signTransaction(tx)
    const sent = await $PhantomWalletAdapter?.sendTransaction(
      signed,
      this._getPhantomManager().connection,
    )
  }

  /**
   * @method modify
   * Modifies the Group settings
   * @param groupId
   * @param openInvites
   */
  async modifyOpenInvites(groupId: string, openInvites: boolean) {
    const payer = this._getPayer()
    // Throws if Adapter is not set
    const $PhantomWalletAdapter = this._getPhantomManager().getAdapter()

    const tx = await this._getProgram().transaction.modifyOpenIvites(
      openInvites,
      {
        accounts: {
          group: this.groupAddressFromId(groupId),
          admin: this._getPayer(),
        },
      },
    )

    tx.recentBlockhash = (
      await this._getPhantomManager().connection.getLatestBlockhash()
    ).blockhash

    tx.feePayer = payer
    const signed = await $PhantomWalletAdapter?.signTransaction(tx)
    const sent = await $PhantomWalletAdapter?.sendTransaction(
      signed,
      this._getPhantomManager().connection,
    )
  }

  /**
   * @method adminLeave
   * Admin leaves group
   * @param groupId
   */
  async adminLeave(groupId: string, receipient: string) {
    const payer = this._getPayer()

    // Throws if Adapter is not set
    const $PhantomWalletAdapter = this._getPhantomManager().getAdapter()
    const successor = new PublicKey(receipient)
    const groupKey = this.groupAddressFromId(groupId)

    const inviterPDA = this._invitePDAPublicKey(payer, groupKey)
    const successorPDA = this._invitePDAPublicKey(successor, groupKey)

    const tx = this._getProgram().transaction.adminLeave({
      accounts: {
        group: groupKey,
        invitation: inviterPDA[0],
        successor: successorPDA[0],
        signer: payer,
        invitationSender: payer,
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
  }

  /**
   * @method leave
   * User leaves group
   * @param groupId
   */
  async leave(groupId: string) {
    const payer = this._getPayer()

    // Throws if Adapter is not set
    const $PhantomWalletAdapter = this._getPhantomManager().getAdapter()
    const groupKey = this.groupAddressFromId(groupId)

    const group = await this.getGroup(groupKey)

    const inviteePDA = this._invitePDAPublicKey(payer, groupKey)

    const tx = this._getProgram().transaction.leave({
      accounts: {
        group: groupKey,
        invitation: inviteePDA[0],
        signer: payer,
        invitationSender: group.admin,
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
  }

  /**
   * Update group name
   * @param id {string} group id
   * @param name {string} new group name
   * @returns Promise<void>
   */
  async updateGroupName(id: string, name: string): Promise<void> {
    const address = this.groupAddressFromId(id)
    const payer = this._getPayer()
    // Throws if Adapter is not set
    const $PhantomWalletAdapter = this._getPhantomManager().getAdapter()

    const tx = this._getProgram().transaction.modifyName(name, {
      accounts: {
        group: address,
        admin: this._getPayer(),
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
    const coder = this._getProgram().coder
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
      return await this._getPhantomManager()
        ._getConnection()
        .removeProgramAccountChangeListener(id)
    } catch (e) {}
  }

  /**
   * Register event listener for new group invites
   * @param cb
   */
  addInviteListener(cb: (group: Group) => void): string {
    const type = GroupEvents.GROUP_INVITE
    const filter = this.buildInvitationAccountFilter({
      recipient: this._getPayer().toBase58(),
    })
    const handler = async (payload: InvitationAccount) => {
      const invite = await this.crypto.decryptInvite(payload.account)
      const rawGroup = await this.getGroup(payload.account.groupKey)
      const group = this.populateGroup(invite, rawGroup)

      if (group) cb(group)
    }

    const id = this._getPhantomManager()
      ._getConnection()
      .onProgramAccountChange(
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
      recipient: this._getPayer().toBase58(),
    })
    const invites = await Promise.all(
      inviteAccounts.map((it) => this.crypto.decryptInvite(it.account)),
    )

    const handler = (payload: RawGroup, invite: Invitation) => {
      const group = this.populateGroup(invite, payload)

      if (group) cb(group)
    }

    invites.forEach((invite) => {
      this._getProgram()
        .account.group.subscribe(invite.groupKey)
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

    this._getProgram()
      .account.group.subscribe(invite.groupKey)
      .on('change', handler)
    return invite.groupKey.toString()
  }

  /**
   * Remove group event listener for given address
   * @param address {string}
   */
  async removeGroupListener(address: string): Promise<void> {
    try {
      await this._getProgram().account.group.unsubscribe(address).catch()
    } catch (e) {}
  }
}
