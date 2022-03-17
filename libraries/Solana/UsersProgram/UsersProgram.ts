import { Program, Provider, utils, Wallet, web3 } from '@project-serum/anchor'
import { EventEmitter } from 'events'
import { Config } from '~/config'
import Solana from '~/libraries/Solana/SolanaManager/SolanaManager'
import { IDL, Users } from './UsersProgram.types'


const { PublicKey, SystemProgram } = web3

export const USERS_PROGRAM_ID = new PublicKey(Config.solana.usersProgramId)

const userSeed = Buffer.from(utils.bytes.utf8.encode('user'))

export default class UsersProgram extends EventEmitter {
  solana?: Solana
  program?: Program<Users>
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
      preflightCommitment: Config.solana.defaultPreflightCommitment,
    })

    this.program = new Program<Users>(
      IDL,
      USERS_PROGRAM_ID.toBase58(),
      provider,
    )
  }

  /**
   * @method _userPDAPublicKey
   * Computes a user PDA for the given Public Key
   * @param address String version of the Public Key
   * @returns the computed PDA
   */
  protected async _userPDAPublicKey(address: string) {
    const program = this._getProgram()

    const user = new PublicKey(address)

    return utils.publicKey.findProgramAddressSync(
      [user.toBytes(), userSeed],
      program.programId,
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
   * @method _getUpdateOpts
   * Get multiple information useful for the update functions
   * @returns program instance, payer account, user info and user PDA
   */
  protected async _getUpdateOpts() {
    const program = this._getProgram()
    const payer = this._getPayer()

    const userPDA = await this._userPDAPublicKey(payer.publicKey.toBase58())

    const userInfo = await this.getCurrentUserInfo()

    if (!userInfo) {
      throw new Error('Non existent account')
    }

    return { program, payer, userPDA, userInfo }
  }

  /**
   * @method create
   * Create a new user
   * @param name Username
   * @param photoHash Profile picture IPFS hash
   * @param statusMessage Status message string
   */
  async create(name: string, photoHash: string, statusMessage: string) {
    // Throws if the program is not set
    const program = this._getProgram()

    // Throws if the payer is not set
    const payer = this._getPayer()

    const userPDA = utils.publicKey.findProgramAddressSync(
      [payer.publicKey.toBytes(), userSeed],
      program.programId,
    )

    await program.rpc.create(name, photoHash, statusMessage, {
      accounts: {
        user: userPDA[0],
        signer: payer.publicKey,
        payer: payer.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [payer],
    })
  }

  /**
   * @method getUserInfo
   * Fetch the user information from the user program
   * @param address string representation of the Public key
   * @returns the parsed user info
   */
  async getUserInfo(address: string) {
    const program = this._getProgram()

    const userPDA = await this._userPDAPublicKey(address)

    const userInfo = await program.account.user.fetchNullable(userPDA[0])

    if (!userInfo) {
      return null
    }

    return {
      name: userInfo.name as string,
      photoHash: userInfo.photoHash as string,
      status: userInfo.status as string,
    }
  }

  /**
   * @method getCurrentUserInfo
   * Returns the user info for the active account
   * @returns the user info object for the current
   */
  async getCurrentUserInfo() {
    const payer = this._getPayer()

    return this.getUserInfo(payer.publicKey.toBase58())
  }

  /**
   * @method setName
   * Allow the user to update the user name
   * @param name user name
   * @returns the transaction to update the status message
   */
  async setName(name: string) {
    const { program, userPDA, payer } = await this._getUpdateOpts()

    return program.rpc.setName(name, {
      accounts: {
        user: userPDA[0],
        signer: payer.publicKey,
        payer: payer.publicKey,
      },
      signers: [payer],
    })
  }

  /**
   * @method setPhotoHash
   * Allow the user to update the profile picture
   * @param photoHash profile picture IPFS hash
   * @returns the transaction to update the photo hash
   */
  async setPhotoHash(photoHash: string) {
    const { program, userPDA, payer } = await this._getUpdateOpts()

    return program.rpc.setPhotoHash(photoHash, {
      accounts: {
        user: userPDA[0],
        signer: payer.publicKey,
        payer: payer.publicKey,
      },
      signers: [payer],
    })
  }

  /**
   * @method setStatusMessage
   * Allow the user to update the status message
   * @param statusMessage status message
   * @returns the transaction to update the status message
   */
  async setStatusMessage(statusMessage: string) {
    const { program, userPDA, payer } = await this._getUpdateOpts()

    return program.rpc.setStatus(statusMessage, {
      accounts: {
        user: userPDA[0],
        signer: payer.publicKey,
        payer: payer.publicKey,
      },
      signers: [payer],
    })
  }
}

export type UserInfo = Awaited<ReturnType<UsersProgram['getUserInfo']>>
