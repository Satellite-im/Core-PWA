// eslint-disable-next-line import/named
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'

/**
 * Utility function to convert the string from config into a
 * solana Cluster string
 * @param network a generic string from the config file
 * @returns rpc url for the given cluster
 */
export const getClusterFromNetworkConfig = (network: string): string => {
  switch (network) {
    case 'mainnet-beta':
      return clusterApiUrl(network)
    case 'testnet':
      return clusterApiUrl(network)
    case 'devnet':
      return clusterApiUrl(network)
    case 'local':
      return 'http://localhost:8899'
    default:
      return clusterApiUrl('devnet')
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
 * Waits until a given Solana account exists on the network
 * @param connection Solana connection instance
 * @param accountKey Account public key to wait for
 */
export async function waitForAccount(
  connection: Connection,
  accountKey: PublicKey,
) {
  while (true) {
    const accountInfo = await connection.getAccountInfo(accountKey)
    if (accountInfo === null) {
      continue
    } else {
      break
    }
  }
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
