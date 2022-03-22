import { Keypair } from '@solana/web3.js'
import Crypto from '~/libraries/Crypto/Crypto'
import { Invitation } from '~/libraries/Solana/GroupChatsProgram/GroupChatsProgram.types'

export default class GroupCrypto {
  protected crypto: Crypto

  constructor(keyPair: Keypair) {
    this.crypto = new Crypto()
    this.crypto.init(keyPair)
  }

  generateEncryptionKey() {
    return this.crypto.getRandomString(16) // becomes 64 length after encryption
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
