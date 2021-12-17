import { Keypair, PublicKey } from '@solana/web3.js'
import ed2curve from 'ed2curve'
import { sharedKey, signMessage } from 'curve25519-js'
import { HashableData } from '~/types/crypto/crypto'



  /**
   *
   * @method initializeRecipient
   * @description Generates the AES key from the shared secret and caches it if
   * it's not present
   * @param recipientPublicKey public key of the recipient
   * @returns AES key
   */
  async initializeRecipient(recipientPublicKey: PublicKey): Promise<CryptoKey> {
    // Check if the instance has been initialized
    if (!this.isInitialized())
      throw new Error('Crypto Instance not initialized')

    const recipientAddress = recipientPublicKey.toBase58()

    // Check if the aes key for the given recipient is in cache
    if (this.aesKeys[recipientAddress]) {
      return this.aesKeys[recipientAddress]
    }

    // Compute the shared secret
    const sharedSecret = this.computeSharedSecret(recipientPublicKey)

    // Check if the shared secret has been properly generated
    if (!sharedSecret) throw new Error('Impossible to generate shared secret')

    const hashedSecret = await this.hash(sharedSecret)

    this.hashedSecrets[recipientAddress] = hashedSecret

    const aesKey = await this.aesKeyFromSharedSecret(sharedSecret)

    // Cache the aesKey to avoid further unnecessary computations
    this.aesKeys[recipientAddress] = aesKey

    return aesKey
  }

  /**
   * @method joinIvAndData
   * @description joins initialization vector for AES CBC to the data
   * that has been encrypted
   * @param iv initialization vector for AES CBC
   * @param data encrypted data converted in Uint8Array
   * @returns concatenated Uint8Array
   */
  joinIvAndData(iv: Uint8Array, data: Uint8Array) {
    const buf = new Uint8Array(iv.length + data.length)
    Array.prototype.forEach.call(iv, function (byte, i) {
      buf[i] = byte
    })
    Array.prototype.forEach.call(data, function (byte, i) {
      buf[ivLen + i] = byte
    })
    return buf
  }

  /**
   * @method separateIvFromData
   * @description separates the initialization vector for AES CBC from
   * the previously joined array. Needed before decryption
   * @param buf concatenated iv and encrypted data
   * @returns an object containing separated values for iv and the data
   */
  separateIvFromData(buf: Uint8Array) {
    const iv = new Uint8Array(ivLen)
    const data = new Uint8Array(buf.length - ivLen)
    Array.prototype.forEach.call(buf, function (byte, i) {
      if (i < ivLen) {
        iv[i] = byte
      } else {
        data[i - ivLen] = byte
      }
    })
    return { iv, data }
  }

  /**
   *
   * @method encrypt
   * @description Encrypts the given string using the provided key
   * @param data string to encrypt
   * @param key AES key for the encryption
   * @returns base64 encrypted string
   */
  async encrypt(data: string, key: CryptoKey): Promise<string> {
    const encodedText = new TextEncoder().encode(data)

    const iv = window.crypto.getRandomValues(new Uint8Array(ivLen))

    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: 'AES-CBC',
        iv,
      },
      key,
      encodedText
    )

    const uintArray = this.joinIvAndData(iv, new Uint8Array(encryptedData))

    return Buffer.from(uintArray).toString('base64')
  }

  /**
   *
   * @method decrypt
   * @description Decrypt the given string using the provided key
   * @param encryptedString base64 encrypted string
   * @param key AES key for the encryption
   * @returns decrypted string (clear text)
   */
  async decrypt(encryptedString: string, key: CryptoKey): Promise<string> {
    const encodedText = new Uint8Array(Buffer.from(encryptedString, 'base64'))

    const { iv, data } = this.separateIvFromData(encodedText)

    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'AES-CBC',
        iv,
      },
      key,
      data
    )

    return new TextDecoder().decode(decryptedData)
  }

  /**
   * @method encryptFor
   * @description Encrypts a string with the ECDH shared secret for a specific address
   * @param recipientAddress Address of the recipient
   * @param data string to be encrypted
   * @returns the encrypted data
   */
  encryptFor(recipientAddress: string, data: string) {
    // Check if the instance has been initialized
    if (!this.isInitialized())
      throw new Error('Crypto Instance not initialized')

    const aesKey = this.aesKeys[recipientAddress]

    if (!aesKey)
      throw new Error(
        'Encryption engine for this recipient has not yet been initialized'
      )

    return this.encrypt(data, aesKey)
  }

  /**
   * @method decryptFor
   * @description Decrypts a string with the ECDH shared secret from a specific address
   * @param senderAddress Address of the sender
   * @param data string to be encrypted
   * @returns the decrypted data
   */
  decryptFrom(senderAddress: string, data: string) {
    // Check if the instance has been initialized
    if (!this.isInitialized())
      throw new Error('Crypto Instance not initialized')

    const aesKey = this.aesKeys[senderAddress]

    if (!aesKey)
      throw new Error(
        'Encryption engine for this sender has not yet been initialized'
      )

    return this.decrypt(data, aesKey)
  }

  /**
   * @function isInitialized
   * @description Checks if the current instance is initialized
   * @returns a boolean value wether the instance has been initialized or not
   */
  isInitialized() {
    return this.signingKey !== undefined
  }

  /**
   * @method getSecret
   * @description returns the hashed ECDH secret for the given
   * recipient address
   * @param address address of the recipient
   * @returns the hashed secret
   */
  getSecret(address: string) {
    return this.hashedSecrets[address]
  }

  /**
   *
   * @method decryptWithPassword
   * @description Decrypts an encrypted text using AES-GCM algorithm
   * @param   encryptedString Ciphertext to be decrypted.
   * @param   password Password to use to decrypt ciphertext.
   * @returns Decrypted plaintext.
   *
   * @example
   *   const plaintext = await Crypto.decryptWithPassword(ciphertext, 'pw');
   */
  async decryptWithPassword(
    encryptedString: string,
    password: string
  ): Promise<string | null> {
    const pwUtf8 = new TextEncoder().encode(password) // encode password as UTF-8
    const pwHash = await this.hash(pwUtf8) // hash the password
    const aesKey = await this.aesKeyFromSharedSecret(pwHash)

    return this.decrypt(encryptedString, aesKey)
  }

  /**
   *
   * @method encryptWithPassword
   * @description Encrypts plaintext using AES-GCM with supplied password
   * @param   plaintext Plaintext to be encrypted.
   * @param   password Password to use to encrypt plaintext.
   * @returns Encrypted ciphertext.
   *
   * @example
   *   const encryptedText = await Crypto.encryptWithPassword('my secret text', 'pw');
   */
  async encryptWithPassword(
    plaintext: string,
    password: string
  ): Promise<string> {
    const pwUtf8 = new TextEncoder().encode(password) // encode password as UTF-8
    const pwHash = await this.hash(pwUtf8)

    const aesKey = await this.aesKeyFromSharedSecret(pwHash)

    return this.encrypt(plaintext, aesKey)
  }

  signMessageWithKey(privateKey: Uint8Array, message: string) {
    const utf8Message = new TextEncoder().encode(message)

    const secretKey = ed2curve.convertSecretKey(privateKey)

    return signMessage(secretKey, utf8Message, undefined)
  }

  signMessage(message: string) {
    if (!this.signingKey) {
      return null
    }

    return this.signMessageWithKey(this.signingKey.secretKey, message)
  }
}
