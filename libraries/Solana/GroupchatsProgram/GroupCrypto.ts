import { Keypair } from '@solana/web3.js'
import base58 from 'micro-base58'
import Crypto from '~/libraries/Crypto/Crypto'
import { Invitation } from '~/libraries/Solana/GroupchatsProgram/GroupchatsProgram.types'

export default class GroupCrypto {
  protected crypto: Crypto

  constructor(keyPair: Keypair) {
    this.crypto = new Crypto()
    this.crypto.init(keyPair)
  }

  generateEncryptionKey() {
    // TODO consider to change random key generation AP-1102
    return base58(Keypair.generate().secretKey).slice(0, 16) // becomes 64 length after encryption
  }

  async encryptInvite(invite: Invitation): Promise<Invitation> {
    await this.crypto.initializeRecipient(invite.recipient)

    const encryptionKey = await this.crypto.encryptFor(
      invite.recipient.toString(),
      invite.encryptionKey,
    )

    const groupId = await this.crypto.encryptWithPassword(
      invite.groupId,
      invite.encryptionKey,
    )

    return {
      ...invite,
      groupId,
      encryptionKey,
    }
  }

  async decryptInvite(invite: Invitation): Promise<Invitation> {
    await this.crypto.initializeRecipient(invite.sender)

    const encryptionKey = await this.crypto.decryptFrom(
      invite.sender.toString(),
      invite.encryptionKey,
    )

    const groupId = await this.crypto.decryptWithPassword(
      invite.groupId,
      encryptionKey,
    )
    if (!groupId) {
      throw new Error('Unable to decrypt group id')
    }

    return {
      ...invite,
      groupId,
      encryptionKey,
    }
  }
}
