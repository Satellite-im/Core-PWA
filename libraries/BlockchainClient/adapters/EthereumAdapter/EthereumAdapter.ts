import {
  AcceptFriendRequestParams,
  Account,
  Adapter,
  CreateUserParams,
  DenyFriendRequestParams,
  RemoveFriendParams,
  RemoveFriendRequestParams,
  SendFriendRequestParams,
  User,
} from '~/libraries/BlockchainClient/interfaces'
import { FriendAccount } from '~/libraries/Solana/FriendsProgram/FriendsProgram.types'

export default class EthereumAdapter implements Adapter {
  acceptFriendRequest(params: AcceptFriendRequestParams): Promise<boolean> {
    return Promise.resolve(false)
  }

  createRandomAccount(): Promise<Account> {
    return Promise.resolve(undefined)
  }

  createUser(params: CreateUserParams): Promise<boolean> {
    return Promise.resolve(false)
  }

  denyFriendRequest(params: DenyFriendRequestParams): Promise<boolean> {
    return Promise.resolve(false)
  }

  getAccountBalance(account: Account): Promise<number | null> {
    return Promise.resolve(undefined)
  }

  getAccountFromMnemonic(mnemonic: string): Promise<Account | null> {
    return Promise.resolve(undefined)
  }

  getAccountUser(account: Account): Promise<User | null> {
    return Promise.resolve(undefined)
  }

  getFriendAccount(address: string): Promise<FriendAccount | null> {
    return Promise.resolve(undefined)
  }

  getUser(address: string): Promise<User | null> {
    return Promise.resolve(undefined)
  }

  removeFriend(params: RemoveFriendParams): Promise<boolean> {
    return Promise.resolve(false)
  }

  removeFriendRequest(params: RemoveFriendRequestParams): Promise<boolean> {
    return Promise.resolve(false)
  }

  searchUserByName(name: string): Promise<User[]> {
    return Promise.resolve([])
  }

  sendFriendRequest(params: SendFriendRequestParams): Promise<boolean> {
    return Promise.resolve(false)
  }
}
