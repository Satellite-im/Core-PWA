import {
  ConfirmOptions,
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'
import base58 from 'micro-base58'
import {
  dwellerAccountLayout,
  encodeInstructionData,
} from './ServerProgram.layout'
import { CreateDerivedAccountParams } from './ServerProgram.types'
import { RawUser } from '~/types/ui/user'
import { Config } from '~/config'
import {
  Seeds,
  stringFromBuffer,
  stringToBuffer,
} from '~/libraries/Solana/Solana'
import Solana from '~/libraries/Solana/SolanaManager/SolanaManager'

const SERVER_PROGRAM_ID = new PublicKey(Config.solana.serverProgramId)

export default class ServerProgram {
  solana?: Solana

  constructor(solana?: Solana) {
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
   * @method isInitialized
   * Checks if the ServerProgram instance is properly initialized
   * @returns true | false
   */
  isInitialized() {
    return Boolean(this.solana)
  }

  /**
   * @method initializeUser
   * Generate the transaction object to be sent
   * for the user initialization
   * @param userAccount the account that will contain the user information
   * @param name the username
   * @param photoHash the profile picture IPFS hash
   * @param status the status string
   * @returns the transaction object to be sent
   */
  initializeUser(
    userAccount: Keypair,
    name: string,
    photoHash: string,
    status: string,
  ) {
    const params = {
      initializeDweller: {
        name: stringToBuffer(name, 32),
        hash: stringToBuffer(photoHash, 64),
        status: stringToBuffer(status, 128),
      },
    }

    return new TransactionInstruction({
      keys: [
        { pubkey: userAccount.publicKey, isSigner: true, isWritable: true },
      ],
      programId: SERVER_PROGRAM_ID,
      data: encodeInstructionData(params),
    })
  }

  /**
   * @method getUserPublicKey
   * Deterministically computes the user public key starting
   * from the payer account keypair
   * @param payerAccount the payer account keypair
   * @returns the computed user public key
   */
  getUserPublicKey(payerAccount: Keypair) {
    return PublicKey.createWithSeed(
      payerAccount.publicKey,
      Seeds.User,
      SERVER_PROGRAM_ID,
    )
  }

  /**
   * @method createUser
   * Generates and sends the transaction to register a new
   * user on the network
   * @param name the username
   * @param photoHash profile picture IPFS hash
   * @param status the status string
   * @param confirmOptionsOverride Solana confirm options to be eventually
   * overwritten (eg. commitment, preflightCommitment)
   * @returns
   */
  async createUser(
    name: string,
    photoHash: string,
    status: string,
    confirmOptionsOverride?: ConfirmOptions,
  ) {
    if (!this.solana) {
      throw new Error('Server program not initialized')
    }

    const { connection } = this.solana

    const space = dwellerAccountLayout.span
    const lamports = await connection.getMinimumBalanceForRentExemption(space)

    const payerAccount = this.solana.getActiveAccount()
    const userAccount = this.solana.getUserAccount()

    if (!payerAccount) return null
    if (!userAccount) return null

    const transaction = new Transaction()
      .add(
        SystemProgram.createAccount({
          fromPubkey: payerAccount.publicKey,
          newAccountPubkey: userAccount.publicKey,
          lamports,
          space,
          programId: SERVER_PROGRAM_ID,
        }),
      )
      .add(this.initializeUser(userAccount, name, photoHash, status))

    await sendAndConfirmTransaction(
      connection,
      transaction,
      [payerAccount, userAccount],
      {
        commitment: Config.solana.defaultCommitment,
        preflightCommitment: Config.solana.defaultPreflightCommitment,
        ...confirmOptionsOverride,
      },
    )

    return userAccount
  }

  /**
   * @method parseUserInfo
   * @param userInfo raw account info related to the user that has
   * been retrieved from the network
   * @returns a parsed object representing the user information
   * //TODO: use strong type - AP-405
   */
  parseUserInfo(userInfo: any): RawUser | null {
    if (!userInfo) {
      return null
    }

    return {
      name: stringFromBuffer(userInfo.name),
      servers: userInfo.servers,
      status: stringFromBuffer(userInfo.status),
      photoHash: stringFromBuffer(userInfo.photo_hash),
    }
  }

  /**
   * @method getUser
   * Retrieves and parses the user information from the network
   * @param userPubkey the userAccount public key
   * @returns an object representing the user information
   */
  async getUser(userPubkey: PublicKey) {
    if (!this.solana) {
      throw new Error('Server program not initialized')
    }

    const { connection } = this.solana
    const accountInfo = await connection.getAccountInfo(
      userPubkey,
      Config.solana.defaultCommitment,
    )

    return accountInfo
      ? this.parseUserInfo(
          dwellerAccountLayout.decode(Buffer.from(accountInfo.data)),
        )
      : null
  }

  /**
   * @method searchByName
   * @description Allow to search for users by name
   * @param name name to search for
   * @returns a list of found users
   */
  async searchByName(name: string) {
    if (!this.solana) {
      throw new Error('Server program not initialized')
    }

    const { connection } = this.solana

    const convertedName = base58(Buffer.from(name))

    const accounts = await connection.getProgramAccounts(SERVER_PROGRAM_ID, {
      filters: [{ memcmp: { offset: 9, bytes: convertedName } }],
    })

    const parsedAccounts = accounts.map(({ account, pubkey }) => ({
      address: pubkey,
      userData: this.parseUserInfo(
        dwellerAccountLayout.decode(Buffer.from(account.data)),
      ),
    }))

    return parsedAccounts
  }

  /**
   * @method createDerivedAccount
   * Utility function to create derived accounts that are owned by the server program
   * @param connection Solana connection
   * @param payerAccount payer account keypair
   * @param seedKey the seed key to generate the account
   * @param seedString the seed string to generate the account
   * @param index index of the derived account
   * @param addressTypeValue type of account to create
   * @param confirmOptionsOverride Solana confirm options to be eventually
   * overwritten (eg. commitment, preflightCommitment)
   * @returns the public key of the generated account
   */
  async createDerivedAccount(
    connection: Connection,
    payerAccount: Keypair,
    seedKey: PublicKey,
    seedString: string,
    index: number,
    addressTypeValue: string,
    confirmOptionsOverride?: ConfirmOptions,
  ) {
    const base = await PublicKey.findProgramAddress(
      [seedKey.toBytes()],
      SERVER_PROGRAM_ID,
    )

    const addressToCreate = await PublicKey.createWithSeed(
      base[0],
      seedString + index,
      SERVER_PROGRAM_ID,
    )

    const params: CreateDerivedAccountParams = {
      createDerivedAccount: {
        [addressTypeValue]: index,
      },
    }

    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: payerAccount.publicKey, isSigner: true, isWritable: true },
        { pubkey: seedKey, isSigner: false, isWritable: false },
        { pubkey: base[0], isSigner: false, isWritable: false },
        { pubkey: addressToCreate, isSigner: false, isWritable: true },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      programId: SERVER_PROGRAM_ID,
      data: encodeInstructionData(params),
    })

    const transaction = new Transaction().add(instruction)

    await sendAndConfirmTransaction(connection, transaction, [payerAccount], {
      commitment: Config.solana.defaultCommitment,
      preflightCommitment: Config.solana.defaultPreflightCommitment,
      ...confirmOptionsOverride,
    })
    return addressToCreate
  }
}
