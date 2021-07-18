import { Cluster, PublicKey } from '@solana/web3.js'

/**
 * Utility function to convert the string from config into a
 * solana Cluster string
 * @param network a generic string from the config file
 * @returns a Solana Cluster type ('mainnet-beta | testnet | devnet')
 */
export const getClusterFromNetworkConfig = (network: string): Cluster => {
  switch (network) {
    case 'mainnet-beta':
      return network
    case 'testnet':
      return network
    default:
      return 'devnet'
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
  programId: PublicKey
) => {
  const base = await PublicKey.findProgramAddress(
    [seedKey.toBytes()],
    programId
  )

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

export enum Seeds {
  FriendInfo = 'friendinfo',
  OutgoingRequest = 'outgoing',
  IncomingRequest = 'incoming',
}
