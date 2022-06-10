import { EventEmitter } from 'events'
import { Program, web3, utils } from '@project-serum/anchor'

import PhantomManager from '../PhantomManager/PhantomManager'
import { Config } from '~/config'
import { IDL, Users } from '~/libraries/Solana/UsersProgram/UsersProgram.types'

const { PublicKey, SystemProgram } = web3

export const USERS_PROGRAM_ID = new PublicKey(Config.solana.usersProgramId)

const userSeed = Buffer.from(utils.bytes.utf8.encode('user'))

export default class PhantomUser extends EventEmitter {
  phantomManager?: PhantomManager
  program?: Program<Users>
  subscriptions?: { [eventName: string]: number }

  constructor(phantomManager: PhantomManager) {
    super()
    if (phantomManager) {
      this.init(phantomManager)
    }
  }

  init(phantomManager: PhantomManager) {
    this.phantomManager = phantomManager

    const provider = this._getPhantomManager().getProvider()

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
    const payer = this._getPhantomManager().getwalletPublicKey()
    if (!payer) {
      throw new Error('Missing payer')
    }

    return payer
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
   * @method _getUpdateOpts
   * Get multiple information useful for the update functions
   * @returns program instance, payer account, user info and user PDA
   */
  protected async _getUpdateOpts() {
    const program = this._getProgram()
    const payer = this._getPayer()

    const userPDA = await this._userPDAPublicKey(payer.toBase58())

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

    // Throws if Adapter is not set
    const $PhantomWalletAdapter = this._getPhantomManager().getAdapter()

    const userPDA = utils.publicKey.findProgramAddressSync(
      [payer.toBytes(), userSeed],
      program.programId,
    )

    const tx = program.transaction.create(name, photoHash, statusMessage, {
      accounts: {
        user: userPDA[0],
        signer: payer,
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
      address,
      name: userInfo.name as string,
      photoHash: userInfo.photoHash as string,
      status: userInfo.status as string,
      bannerImageHash: userInfo.bannerImageHash as string,
      extra1: userInfo.extra1 as string,
      extra2: userInfo.extra2 as string,
    }
  }

  /**
   * @method getUsersInfo
   * Fetch multiple users information from the user program
   * @param addresses array af user addresses
   * @returns the parsed users info
   */
  async getUsersInfo(addresses: string[]) {
    const program = this._getProgram()
    const pubKeys = await Promise.all(
      addresses.map(async (it) => (await this._userPDAPublicKey(it))[0]),
    )
    const users = await program.account.user.fetchMultiple(pubKeys)
    return users.map((it, i) => ({ ...it, address: addresses[i] }))
  }

  /**
   * @method getCurrentUserInfo
   * Returns the user info for the active account
   * @returns the user info object for the current
   */
  async getCurrentUserInfo() {
    const payer = this._getPayer()

    return this.getUserInfo(payer.toBase58())
  }

  /**
   * @method setName
   * Allow the user to update the user name
   * @param name user name
   * @returns the transaction to update the status message
   */
  async setName(name: string) {
    const { program, userPDA, payer } = await this._getUpdateOpts()
    // Throws if Adapter is not set
    const $PhantomWalletAdapter = this._getPhantomManager().getAdapter()

    const tx = program.transaction.setName(name, {
      accounts: {
        user: userPDA[0],
        signer: payer,
        payer,
      },
    })

    tx.recentBlockhash = (
      await this._getPhantomManager().connection.getLatestBlockhash()
    ).blockhash

    tx.feePayer = payer
    const signed = await $PhantomWalletAdapter.signTransaction(tx)
    const sent = await $PhantomWalletAdapter.sendTransaction(
      signed,
      this._getPhantomManager().connection,
    )
  }

  /**
   * @method setPhotoHash
   * Allow the user to update the profile picture
   * @param photoHash profile picture IPFS hash
   * @returns the transaction to update the photo hash
   */
  async setPhotoHash(photoHash: string) {
    const { program, userPDA, payer } = await this._getUpdateOpts()
    // Throws if Adapter is not set
    const $PhantomWalletAdapter = this._getPhantomManager().getAdapter()
    const tx = program.transaction.setPhotoHash(photoHash, {
      accounts: {
        user: userPDA[0],
        signer: payer,
        payer,
      },
    })
    tx.recentBlockhash = (
      await this._getPhantomManager().connection.getLatestBlockhash()
    ).blockhash

    tx.feePayer = payer
    const signed = await $PhantomWalletAdapter.signTransaction(tx)
    return await $PhantomWalletAdapter.sendTransaction(
      signed,
      this._getPhantomManager().connection,
    )
  }

  /**
   * @method setStatusMessage
   * Allow the user to update the status message
   * @param statusMessage status message
   * @returns the transaction to update the status message
   */
  async setStatusMessage(statusMessage: string) {
    const { program, userPDA, payer } = await this._getUpdateOpts()

    // Throws if Adapter is not set
    const $PhantomWalletAdapter = this._getPhantomManager().getAdapter()

    const tx = program.transaction.setStatus(statusMessage, {
      accounts: {
        user: userPDA[0],
        signer: payer,
        payer,
      },
    })

    tx.recentBlockhash = (
      await this._getPhantomManager().connection.getLatestBlockhash()
    ).blockhash

    tx.feePayer = payer
    const signed = await $PhantomWalletAdapter.signTransaction(tx)
    const sent = await $PhantomWalletAdapter.sendTransaction(
      signed,
      this._getPhantomManager().connection,
    )
  }

  /**
   * @method setBannerImageHash
   * Allow the user to update the profile banner image
   * @param bannerImageHash profile banner image IPFS hash
   * @returns the transaction signature
   */
  async setBannerImageHash(bannerImageHash: string): Promise<string> {
    const { program, userPDA, payer } = await this._getUpdateOpts()

    // Throws if Adapter is not set
    const $PhantomWalletAdapter = this._getPhantomManager().getAdapter()

    const tx = program.transaction.setBannerImageHash(bannerImageHash, {
      accounts: {
        user: userPDA[0],
        signer: payer,
        payer,
      },
    })

    tx.recentBlockhash = (
      await this._getPhantomManager().connection.getLatestBlockhash()
    ).blockhash

    tx.feePayer = payer
    const signed = await $PhantomWalletAdapter.signTransaction(tx)

    return await $PhantomWalletAdapter.sendTransaction(
      signed,
      this._getPhantomManager().connection,
    )
  }

  /**
   * @method setExtraOne
   * Allow the user to update the first extra field of profile
   * @param value extra field value
   * @returns the transaction signature
   */
  async setExtraOne(value: string): Promise<string> {
    const { program, userPDA, payer } = await this._getUpdateOpts()

    // Throws if Adapter is not set
    const $PhantomWalletAdapter = this._getPhantomManager().getAdapter()

    const tx = program.transaction.setExtraOne(value, {
      accounts: {
        user: userPDA[0],
        signer: payer,
        payer,
      },
    })

    tx.recentBlockhash = (
      await this._getPhantomManager().connection.getLatestBlockhash()
    ).blockhash

    tx.feePayer = payer
    const signed = await $PhantomWalletAdapter.signTransaction(tx)

    return await $PhantomWalletAdapter.sendTransaction(
      signed,
      this._getPhantomManager().connection,
    )
  }

  /**
   * @method setExtraTwo
   * Allow the user to update the second extra field of profile
   * @param value extra field value
   * @returns the transaction signature
   */
  async setExtraTwo(value: string): Promise<string> {
    const { program, userPDA, payer } = await this._getUpdateOpts()

    // Throws if Adapter is not set
    const $PhantomWalletAdapter = this._getPhantomManager().getAdapter()

    const tx = program.transaction.setExtraTwo(value, {
      accounts: {
        user: userPDA[0],
        signer: payer,
        payer,
      },
    })

    tx.recentBlockhash = (
      await this._getPhantomManager().connection.getLatestBlockhash()
    ).blockhash

    tx.feePayer = payer
    const signed = await $PhantomWalletAdapter.signTransaction(tx)

    return await $PhantomWalletAdapter.sendTransaction(
      signed,
      this._getPhantomManager().connection,
    )
  }
}

export type UserInfo = Awaited<ReturnType<PhantomUser['getUserInfo']>>
