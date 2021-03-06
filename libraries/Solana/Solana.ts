// eslint-disable-next-line import/named
import { PublicKey, clusterApiUrl } from '@solana/web3.js'

/**
 * Utility function to convert the string from config into a
 * solana Cluster string
 * @param network a generic string from the config file
 * @returns rpc url for the given cluster
 */
export const getClusterFromNetworkConfig = (network: string): string => {
  switch (network) {
    case 'mainnet-beta':
      return (
        process.env.NUXT_ENV_FIGMENT_SOLANA_MAINNET_RPC ||
        clusterApiUrl(network)
      )
    case 'testnet':
      return (
        process.env.NUXT_ENV_FIGMENT_SOLANA_TESTNET_RPC ||
        clusterApiUrl(network)
      )
    case 'local':
      return 'http://localhost:8899'
    default:
      return (
        process.env.NUXT_ENV_FIGMENT_SOLANA_DEVNET_RPC ||
        clusterApiUrl('devnet')
      )
  }
}

/**
 * Utility function to deterministically compute a public key from the
 * given parameters
 * @param seedKey a Solana public key
 * @param seed a string that is used as seed
 * @param programId the id of the solana program that needs to work
 * with the computed public key
 * @returns the base key and the computed public key
 */
export const publicKeyFromSeed = async (
  seedKey: PublicKey,
  seed: string,
  programId: PublicKey,
) => {
  const base = await PublicKey.findProgramAddress(
    [seedKey.toBytes()],
    programId,
  )

  const key = await PublicKey.createWithSeed(base[0], seed, programId)
  return { base, key }
}

/**
 * Utility function to deterministically compute a public key from the
 * given parameters
 * @param seedKey a Solana public key
 * @param seed a string that is used as seed
 * @param programId the id of the solana program that needs to work
 * with the computed public key
 * @returns the base key and the computed public key
 */
export const publicKeyFromSeeds = async (
  seeds: (Buffer | Uint8Array)[],
  seed: string,
  programId: PublicKey,
) => {
  const base = await PublicKey.findProgramAddress(seeds, programId)

  const key = await PublicKey.createWithSeed(base[0], seed, programId)
  return { base, key }
}

/**
 * Utility function to convert a timeout into a promise
 * @param ms number of milliseconds to wait
 * @returns a promise that resolves after the given time
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Utility function to retry a promise
 * @param fn promise function to retry
 * @param retries number of retries
 * @param delay time in ms to wait after each failure
 * @returns a promise that resolves with result of input fn
 */

export const retry = async <T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 2000,
): Promise<T> => {
  try {
    return await fn()
  } catch (e) {
    if (!retries) {
      throw e
    }
    await sleep(delay)
    return await retry(fn, retries - 1, delay)
  }
}

/**
 * Utility function to convert a string into a fixed length buffer
 * @param stringToConvert string to be converted
 * @param length fixed length of the final buffer
 * @returns the buffer representation of the given string
 */
export function stringToBuffer(stringToConvert: string, length: number) {
  return Buffer.from(stringToConvert.padEnd(length, String.fromCharCode(0)))
}

/**
 * Utility function to convert a buffer into string
 * @param bufferToConvert buffer to be converted
 * @returns the string representation of the given buffer
 */
export function stringFromBuffer(bufferToConvert: Buffer) {
  return Buffer.from(bufferToConvert).toString('utf-8').replace(/\0.*$/g, '')
}

/**
 * Seeds to be used for deriving accounts
 */
export enum Seeds {
  Friend = 'friend',
  FriendInfo = 'friendinfo',
  OutgoingRequest = 'outgoing',
  IncomingRequest = 'incoming',
  User = 'user',
  DwellerServer = 'DwellerServer',
  ServerMember = 'ServerMember',
}
