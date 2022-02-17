import { EventEmitter } from 'events'
import { Program, Provider, utils, Wallet } from '@project-serum/anchor'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import { Groupchats, IDL } from './GroupchatsProgram.types'
import { Config } from '~/config'
import Solana from '~/libraries/Solana/SolanaManager/SolanaManager'

export const GROUPCHATS_PROGRAM_ID = new PublicKey(
  Config.solana.groupchatsProgramId,
)

const groupSeed = Buffer.from(utils.bytes.utf8.encode('groupchat'))
const inviteSeed = Buffer.from(utils.bytes.utf8.encode('invite'))

export default class GroupchatsProgram extends EventEmitter {
  solana?: Solana
  program?: Program<Groupchats>
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

  async getGroup(groupAddress: PublicKey | string) {
    const program = this._getProgram()
    return await program.account.group.fetch(groupAddress)
  }

  async getInvitation(invitationAddress: PublicKey | string) {
    const program = this._getProgram()
    return await program.account.invitation.fetch(invitationAddress)
  }

  /**
   * @method create
   * Create a new group
   * @param groupId Group Id
   */
  async create(groupId: string) {
    // Throws if the program is not set
    const program = this._getProgram()

    // Throws if the payer is not set
    const payer = this._getPayer()

    const groupHash = this._getGroupHash(groupId)

    const groupPDA = this._groupPDAPublicKey(groupHash)
    const inviterPDA = this._invitePDAPublicKey(payer.publicKey, groupPDA[0])

    // GroupID must be encrypted
    await program.rpc.create(groupHash, groupId, true, {
      accounts: {
        group: groupPDA[0],
        invitation: inviterPDA[0],
        signer: payer.publicKey,
        payer: payer.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [payer],
    })
  }

  /**
   * @method invite
   * Invite new user into Group
   * @param groupId Group Id
   * @param recipient: receipient address
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

    await program.rpc.invite(groupId, user, {
      accounts: {
        newInvitation: inviteePDA[0],
        group: groupPDA[0],
        invitation: inviterPDA[0],
        signer: payer.publicKey,
        payer: payer.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [payer],
    })
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
