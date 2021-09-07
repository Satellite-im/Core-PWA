import {
  SystemProgram,
  Transaction,
  TransactionInstruction,
  PublicKey,
  sendAndConfirmTransaction,
  SYSVAR_RENT_PUBKEY,
  Keypair,
  // eslint-disable-next-line import/named
  ConfirmOptions,
} from '@solana/web3.js'
import base58 from 'micro-base58'
import { encodeInstructionData, friendLayout } from './FriendsProgram.layout'
import { CreateFriendParams, FriendStatus } from './FriendsProgram.types'

import { Seeds, publicKeyFromSeeds } from '~/libraries/Solana/Solana'

import Solana from '~/libraries/Solana/SolanaManager/SolanaManager'
import { Config } from '~/config'

export const FRIENDS_PROGRAM_ID = new PublicKey(Config.solana.friendsProgramId)

export default class FriendsProgram {
  solana: Solana
  constructor(solana: Solana) {
    this.solana = solana
  }

  async createDerivedAccount(
    seedKey: PublicKey,
    seedString: string,
    params: CreateFriendParams,
    confirmOptionsOverride?: ConfirmOptions
  ) {
    const { connection } = this.solana
    const payerAccount = this.solana.getActiveAccount()
    if (!payerAccount) return null

    const { base, key } = await publicKeyFromSeeds(
      [seedKey.toBytes(), params.createAccount.friend.friendKey],
      seedString,
      FRIENDS_PROGRAM_ID
    )

    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: payerAccount.publicKey, isSigner: true, isWritable: true },
        { pubkey: seedKey, isSigner: false, isWritable: false },
        { pubkey: base[0], isSigner: false, isWritable: false },
        { pubkey: key, isSigner: false, isWritable: true },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      programId: FRIENDS_PROGRAM_ID,
      data: encodeInstructionData(params),
    })

    const transaction = new Transaction().add(instruction)

    await sendAndConfirmTransaction(connection, transaction, [payerAccount], {
      commitment: 'finalized',
      preflightCommitment: 'finalized',
      ...confirmOptionsOverride,
    })
    return key
  }

  async createFriend(
    userFromKey: PublicKey,
    userToKey: PublicKey,
    confirmOptionsOverride?: ConfirmOptions
  ) {
    const payerAccount = this.solana.getActiveAccount()
    if (!payerAccount) return null
    if (!userFromKey) return null

    const params = {
      createAccount: {
        friend: { friendKey: userToKey.toBytes() },
      },
    }
    const friendKey = await this.createDerivedAccount(
      userFromKey,
      Seeds.Friend,
      params,
      confirmOptionsOverride
    )

    if (!friendKey) throw new Error('Derived account error')

    return friendKey
  }

  initFriendRequest(
    friendKey: PublicKey,
    friend2Key: PublicKey,
    userFromKey: PublicKey,
    userToKey: PublicKey,
    fromPaddedBuffer: Uint8Array,
    toPaddedBuffer: Uint8Array
  ) {
    return new TransactionInstruction({
      keys: [
        { pubkey: friendKey, isSigner: false, isWritable: true },
        { pubkey: friend2Key, isSigner: false, isWritable: true },
        { pubkey: userFromKey, isSigner: true, isWritable: false },
        { pubkey: userToKey, isSigner: false, isWritable: true },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      ],
      programId: FRIENDS_PROGRAM_ID,
      data: encodeInstructionData({
        makeRequest: {
          tex: [
            fromPaddedBuffer.slice(0, 32),
            fromPaddedBuffer.slice(32, 64),
            toPaddedBuffer.slice(0, 32),
            toPaddedBuffer.slice(32, 64),
          ],
        },
      }),
    })
  }

  initAcceptFriendRequest(
    friendKey: PublicKey,
    userFromKey: PublicKey,
    userToKey: PublicKey,
    fromPaddedBuffer: Uint8Array,
    toPaddedBuffer: Uint8Array
  ) {
    return new TransactionInstruction({
      keys: [
        { pubkey: friendKey, isSigner: false, isWritable: true },
        { pubkey: userFromKey, isSigner: false, isWritable: true },
        { pubkey: userToKey, isSigner: true, isWritable: false },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      ],
      programId: FRIENDS_PROGRAM_ID,
      data: encodeInstructionData({
        acceptRequest: {
          tex: [
            fromPaddedBuffer.slice(0, 32),
            fromPaddedBuffer.slice(32, 64),
            toPaddedBuffer.slice(0, 32),
            toPaddedBuffer.slice(32, 64),
          ],
        },
      }),
    })
  }

  initDenyFriendRequest(
    friendKey: PublicKey,
    userFromKey: PublicKey,
    userToKey: PublicKey,
    fromPaddedBuffer: Uint8Array,
    toPaddedBuffer: Uint8Array
  ) {
    return new TransactionInstruction({
      keys: [
        { pubkey: friendKey, isSigner: false, isWritable: true },
        { pubkey: userFromKey, isSigner: false, isWritable: true },
        { pubkey: userToKey, isSigner: true, isWritable: false },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      ],
      programId: FRIENDS_PROGRAM_ID,
      data: encodeInstructionData({
        denyRequest: {
          tex: [
            fromPaddedBuffer.slice(0, 32),
            fromPaddedBuffer.slice(32, 64),
            toPaddedBuffer.slice(0, 32),
            toPaddedBuffer.slice(32, 64),
          ],
        },
      }),
    })
  }

  initRemoveFriendRequest(
    friendKey: PublicKey,
    userFromKey: PublicKey,
    userToKey: PublicKey,
    fromPaddedBuffer: Uint8Array,
    toPaddedBuffer: Uint8Array
  ) {
    return new TransactionInstruction({
      keys: [
        { pubkey: friendKey, isSigner: false, isWritable: true },
        { pubkey: userFromKey, isSigner: true, isWritable: false },
        { pubkey: userToKey, isSigner: false, isWritable: true },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      ],
      programId: FRIENDS_PROGRAM_ID,
      data: encodeInstructionData({
        removeRequest: {
          tex: [
            fromPaddedBuffer.slice(0, 32),
            fromPaddedBuffer.slice(32, 64),
            toPaddedBuffer.slice(0, 32),
            toPaddedBuffer.slice(32, 64),
          ],
        },
      }),
    })
  }

  initRemoveFriend(
    friendKey: PublicKey,
    userFromKey: PublicKey,
    userToKey: PublicKey,
    fromPaddedBuffer: Uint8Array,
    toPaddedBuffer: Uint8Array
  ) {
    return new TransactionInstruction({
      keys: [
        { pubkey: friendKey, isSigner: false, isWritable: true },
        { pubkey: userFromKey, isSigner: true, isWritable: false },
        { pubkey: userToKey, isSigner: false, isWritable: true },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      ],
      programId: FRIENDS_PROGRAM_ID,
      data: encodeInstructionData({
        removeFriend: {
          tex: [
            fromPaddedBuffer.slice(0, 32),
            fromPaddedBuffer.slice(32, 64),
            toPaddedBuffer.slice(0, 32),
            toPaddedBuffer.slice(32, 64),
          ],
        },
      }),
    })
  }

  createFriendRequest(
    friendKey: PublicKey,
    friend2Key: PublicKey,
    userFromAccount: Keypair,
    userToKey: PublicKey,
    fromPaddedBuffer: Uint8Array,
    toPaddedBuffer: Uint8Array,
    confirmOptionsOverride?: ConfirmOptions
  ) {
    const { connection } = this.solana
    const payerAccount = this.solana.getActiveAccount()
    if (!payerAccount) return null

    const transaction = new Transaction().add(
      this.initFriendRequest(
        friendKey,
        friend2Key,
        userFromAccount.publicKey,
        userToKey,
        fromPaddedBuffer,
        toPaddedBuffer
      )
    )

    return sendAndConfirmTransaction(
      connection,
      transaction,
      [payerAccount, userFromAccount],
      {
        commitment: 'singleGossip',
        preflightCommitment: 'singleGossip',
        ...confirmOptionsOverride,
      }
    )
  }

  acceptFriendRequest(
    friendKey: PublicKey,
    userFromKey: PublicKey,
    userToAccount: Keypair,
    fromPaddedBuffer: Uint8Array,
    toPaddedBuffer: Uint8Array,
    confirmOptionsOverride?: ConfirmOptions
  ) {
    const { connection } = this.solana
    const payerAccount = this.solana.getActiveAccount()
    if (!payerAccount) return null

    const transaction = new Transaction().add(
      this.initAcceptFriendRequest(
        friendKey,
        userFromKey,
        userToAccount.publicKey,
        fromPaddedBuffer,
        toPaddedBuffer
      )
    )

    return sendAndConfirmTransaction(
      connection,
      transaction,
      [payerAccount, userToAccount],
      {
        commitment: 'singleGossip',
        preflightCommitment: 'singleGossip',
        ...confirmOptionsOverride,
      }
    )
  }

  denyFriendRequest(
    friendKey: PublicKey,
    userFromKey: PublicKey,
    userToAccount: Keypair,
    fromPaddedBuffer: Uint8Array,
    toPaddedBuffer: Uint8Array,
    confirmOptionsOverride?: ConfirmOptions
  ) {
    const { connection } = this.solana
    const payerAccount = this.solana.getActiveAccount()
    if (!payerAccount) return null

    const transaction = new Transaction().add(
      this.initDenyFriendRequest(
        friendKey,
        userFromKey,
        userToAccount.publicKey,
        fromPaddedBuffer,
        toPaddedBuffer
      )
    )

    return sendAndConfirmTransaction(
      connection,
      transaction,
      [payerAccount, userToAccount],
      {
        commitment: 'singleGossip',
        preflightCommitment: 'singleGossip',
        ...confirmOptionsOverride,
      }
    )
  }

  removeFriendRequest(
    friendKey: PublicKey,
    userFromKey: PublicKey,
    userToAccount: Keypair,
    fromPaddedBuffer: Uint8Array,
    toPaddedBuffer: Uint8Array,
    confirmOptionsOverride?: ConfirmOptions
  ) {
    const { connection } = this.solana
    const payerAccount = this.solana.getActiveAccount()
    if (!payerAccount) return null

    const transaction = new Transaction().add(
      this.initRemoveFriendRequest(
        friendKey,
        userFromKey,
        userToAccount.publicKey,
        fromPaddedBuffer,
        toPaddedBuffer
      )
    )

    return sendAndConfirmTransaction(
      connection,
      transaction,
      [payerAccount, userToAccount],
      {
        commitment: 'singleGossip',
        preflightCommitment: 'singleGossip',
        ...confirmOptionsOverride,
      }
    )
  }

  removeFriend(
    friendKey: PublicKey,
    userFromKey: PublicKey,
    userToAccount: Keypair,
    fromPaddedBuffer: Uint8Array,
    toPaddedBuffer: Uint8Array,
    confirmOptionsOverride?: ConfirmOptions
  ) {
    const { connection } = this.solana
    const payerAccount = this.solana.getActiveAccount()
    if (!payerAccount) return null

    const transaction = new Transaction().add(
      this.initRemoveFriend(
        friendKey,
        userFromKey,
        userToAccount.publicKey,
        fromPaddedBuffer,
        toPaddedBuffer
      )
    )

    return sendAndConfirmTransaction(
      connection,
      transaction,
      [payerAccount, userToAccount],
      {
        commitment: 'singleGossip',
        preflightCommitment: 'singleGossip',
        ...confirmOptionsOverride,
      }
    )
  }

  async getFriend(friendKey: PublicKey) {
    const { connection } = this.solana
    const accountInfo = await connection.getAccountInfo(friendKey)

    if (accountInfo === null) {
      return null
      //   throw new Error('Error: cannot find the account')
    }
    return friendLayout.decode(Buffer.from(accountInfo.data))
  }

  async computeFriendAccountKey(userFromKey: PublicKey, userToKey: PublicKey) {
    const { key } = await publicKeyFromSeeds(
      [userFromKey.toBytes(), userToKey.toBytes()],
      Seeds.Friend,
      FRIENDS_PROGRAM_ID
    )

    return key
  }

  async getFriendRequests(status: FriendStatus) {
    const { connection } = this.solana

    const userAccount = this.solana.getUserAccount()
    if (!userAccount) {
      throw new Error('User account not found')
    }

    const fromKeyAndStatus = base58(
      Buffer.from([...userAccount.publicKey.toBytes(), status])
    )

    const statusAndToKey = base58(
      Buffer.from([status, ...userAccount.publicKey.toBytes()])
    )

    const resultFrom = await connection.getParsedProgramAccounts(
      FRIENDS_PROGRAM_ID,
      {
        filters: [{ memcmp: { offset: 0, bytes: fromKeyAndStatus } }],
      }
    )

    const resultTo = await connection.getParsedProgramAccounts(
      FRIENDS_PROGRAM_ID,
      {
        filters: [{ memcmp: { offset: 32, bytes: statusAndToKey } }],
      }
    )

    return [...resultFrom, ...resultTo]
  }
}
