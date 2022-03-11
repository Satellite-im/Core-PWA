// eslint-disable-next-line import/named
import { PublicKey } from '@solana/web3.js'
// @ts-ignore
import BufferLayout from 'buffer-layout'
import { ProgramAccountInfo } from '~/types/solana/solana'
import {
  FriendAccount,
  FriendsInstructionType,
} from '~/libraries/Solana/FriendsProgramOld/FriendsProgram.types'

/// Address type input
const ADDRESS_TYPE_INPUT = BufferLayout.union(BufferLayout.u8('addressType'))
ADDRESS_TYPE_INPUT.addVariant(
  0,
  BufferLayout.struct([BufferLayout.seq(BufferLayout.u8(), 32, 'friendKey')]),
  'friend',
)

const LAYOUT = BufferLayout.union(BufferLayout.u8('instruction'))

LAYOUT.addVariant(
  0,
  BufferLayout.struct([
    BufferLayout.seq(BufferLayout.seq(BufferLayout.u8(), 32), 4, 'tex'),
  ]),
  'makeRequest',
)

LAYOUT.addVariant(
  1,
  BufferLayout.struct([
    BufferLayout.seq(BufferLayout.seq(BufferLayout.u8(), 32), 4, 'tex'),
  ]),
  'acceptRequest',
)

LAYOUT.addVariant(2, undefined, 'denyRequest')

LAYOUT.addVariant(3, undefined, 'removeRequest')

LAYOUT.addVariant(4, undefined, 'removeFriend')

LAYOUT.addVariant(5, ADDRESS_TYPE_INPUT, 'createAccount')

const friendLayout = BufferLayout.struct([
  BufferLayout.seq(BufferLayout.u8(), 32, 'from'),
  BufferLayout.u8('status'),
  BufferLayout.seq(BufferLayout.u8(), 32, 'to'),
  BufferLayout.seq(BufferLayout.u8(), 32, 'textileFrom1'),
  BufferLayout.seq(BufferLayout.u8(), 32, 'textileFrom2'),
  BufferLayout.seq(BufferLayout.u8(), 32, 'textileFrom3'),
  BufferLayout.seq(BufferLayout.u8(), 32, 'textileFrom4'),
  BufferLayout.seq(BufferLayout.u8(), 32, 'textileTo1'),
  BufferLayout.seq(BufferLayout.u8(), 32, 'textileTo2'),
  BufferLayout.seq(BufferLayout.u8(), 32, 'textileTo3'),
  BufferLayout.seq(BufferLayout.u8(), 32, 'textileTo4'),
])

const instructionMaxSpan = Math.max(
  // @ts-ignore
  ...Object.values(LAYOUT.registry).map((r) => r.span),
)

function encodeInstructionData(instruction: FriendsInstructionType) {
  const b = Buffer.alloc(instructionMaxSpan)
  const span = LAYOUT.encode(instruction, b)
  return b.slice(0, span)
}

/**
 * Utility function that removes leading zeros the given string
 */
const leadingZerosRegex = /^0+/gm
function removeLeadingZerosFromString(input: string) {
  return input.replaceAll(leadingZerosRegex, '')
}

/**
 * Utility function that merges the textile key that
 * has been split in 2 arraybuffer into a single
 * utf-8 string
 * @param part1 The first part of the array buffer
 * @param part2 The second part of the array buffer
 * @returns the utf-8 string representing the mailboxId
 */
function parseMailboxId(
  part1: Uint8Array,
  part2: Uint8Array,
  part3: Uint8Array,
  part4: Uint8Array,
) {
  return removeLeadingZerosFromString(
    Buffer.from([...part1, ...part2, ...part3, ...part4]).toString('utf-8'),
  )
}

/**
 * Utility function that parses a given Program Account
 * into a friend account
 * @param account account to be parsed
 * @returns a parsed object containing the friend information
 */
function parseFriendAccount(account: ProgramAccountInfo) {
  const decoded = friendLayout.decode(account.account.data)

  const parsedFriendInfo: FriendAccount = {
    accountId: account.pubkey.toBase58(),
    from: new PublicKey(decoded.from).toBase58(),
    status: parseInt(decoded.status),
    fromMailboxId: parseMailboxId(
      decoded.textileFrom1,
      decoded.textileFrom2,
      decoded.textileFrom3,
      decoded.textileFrom4,
    ),
    toMailboxId: parseMailboxId(
      decoded.textileTo1,
      decoded.textileTo2,
      decoded.textileTo3,
      decoded.textileTo4,
    ),
    to: new PublicKey(decoded.to).toBase58(),
  }

  return parsedFriendInfo
}

/**
 * Utility function that parses a given array of Program accounts
 * into Friend Accounts
 * @param accounts Array of program accounts fetched using connection.getProgramAccounts
 * @returns an array of parsed friend accounts
 */
function parseFriendAccounts(accounts: Array<ProgramAccountInfo>) {
  return accounts.map((account) => parseFriendAccount(account))
}

export {
  LAYOUT,
  encodeInstructionData,
  ADDRESS_TYPE_INPUT,
  friendLayout,
  parseFriendAccount,
  parseFriendAccounts,
}
