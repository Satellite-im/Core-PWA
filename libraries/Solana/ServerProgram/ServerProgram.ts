import {
  SystemProgram,
  Transaction,
  TransactionInstruction,
  PublicKey,
  sendAndConfirmTransaction,
  SYSVAR_RENT_PUBKEY,
  Keypair,
  Connection,
  // eslint-disable-next-line import/named
  ConfirmOptions,
} from '@solana/web3.js'
import {
  encodeInstructionData,
  dwellerAccountLayout,
} from './ServerProgram.layout'
import { CreateDerivedAccountParams } from './ServerProgram.types'
import {
  Seeds,
  stringFromBuffer,
  stringToBuffer,
} from '~/libraries/Solana/Solana'
import { Config } from '~/config'
import Solana from '~/libraries/Solana/SolanaManager/SolanaManager'

const SERVER_PROGRAM_ID = new PublicKey(Config.solana.serverProgramId)

export default class ServerProgram {
  solana: Solana
  constructor(solana: Solana) {
    this.solana = solana
  }

  initializeUser(
    userAccount: Keypair,
    name: string,
    photoHash: string,
    status: string
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

  getUserPublicKey(payerAccount: Keypair) {
    return PublicKey.createWithSeed(
      payerAccount.publicKey,
      Seeds.User,
      SERVER_PROGRAM_ID
    )
  }

  async createUser(
    name: string,
    photoHash: string,
    status: string,
    confirmOptionsOverride?: ConfirmOptions
  ) {
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
        })
      )
      .add(this.initializeUser(userAccount, name, photoHash, status))

    await sendAndConfirmTransaction(
      connection,
      transaction,
      [payerAccount, userAccount],
      {
        commitment: 'finalized',
        preflightCommitment: 'finalized',
        ...confirmOptionsOverride,
      }
    )

    return userAccount
  }

  // TODO: use strong type
  parseUserInfo(userInfo: any) {
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

  async getUser(userPubkey: PublicKey) {
    const { connection } = this.solana
    const accountInfo = await connection.getAccountInfo(userPubkey)

    return accountInfo
      ? this.parseUserInfo(
          dwellerAccountLayout.decode(Buffer.from(accountInfo.data))
        )
      : null
  }

  async createDerivedAccount(
    connection: Connection,
    payerAccount: Keypair,
    seedKey: PublicKey,
    seedString: string,
    index: number,
    addressTypeValue: string,
    confirmOptionsOverride?: ConfirmOptions
  ) {
    const base = await PublicKey.findProgramAddress(
      [seedKey.toBytes()],
      SERVER_PROGRAM_ID
    )

    const addressToCreate = await PublicKey.createWithSeed(
      base[0],
      seedString + index,
      SERVER_PROGRAM_ID
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
      commitment: 'singleGossip',
      preflightCommitment: 'singleGossip',
      ...confirmOptionsOverride,
    })
    return addressToCreate
  }
}
