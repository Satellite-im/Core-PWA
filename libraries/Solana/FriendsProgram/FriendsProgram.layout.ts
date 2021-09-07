// @ts-ignore
import BufferLayout from 'buffer-layout'
import { FriendsInstructionType } from './FriendsProgram.types'

/// Address type input
const ADDRESS_TYPE_INPUT = BufferLayout.union(BufferLayout.u8('addressType'))
// ADDRESS_TYPE_INPUT.addVariant(0, undefined, "friendInfo");
// ADDRESS_TYPE_INPUT.addVariant(1, BufferLayout.nu64("index"), "requestOutgoing");
// ADDRESS_TYPE_INPUT.addVariant(2, BufferLayout.nu64("index"), "requestIncoming");
ADDRESS_TYPE_INPUT.addVariant(
  0,
  BufferLayout.struct([BufferLayout.seq(BufferLayout.u8(), 32, 'friendKey')]),
  'friend'
)

const LAYOUT = BufferLayout.union(BufferLayout.u8('instruction'))
// LAYOUT.addVariant(0, undefined, "initFriendInfo");

LAYOUT.addVariant(
  0,
  BufferLayout.struct([
    BufferLayout.seq(BufferLayout.seq(BufferLayout.u8(), 32), 4, 'tex'),
  ]),
  'makeRequest'
)

LAYOUT.addVariant(
  1,
  BufferLayout.struct([
    BufferLayout.seq(BufferLayout.seq(BufferLayout.u8(), 32), 4, 'tex'),
  ]),
  'acceptRequest'
)

LAYOUT.addVariant(
  2,
  BufferLayout.struct([
    BufferLayout.seq(BufferLayout.seq(BufferLayout.u8(), 32), 4, 'tex'),
  ]),
  'denyRequest'
)

LAYOUT.addVariant(
  3,
  BufferLayout.struct([
    BufferLayout.seq(BufferLayout.seq(BufferLayout.u8(), 32), 4, 'tex'),
  ]),
  'removeRequest'
)

LAYOUT.addVariant(
  4,
  BufferLayout.struct([
    BufferLayout.seq(BufferLayout.seq(BufferLayout.u8(), 32), 4, 'tex'),
  ]),
  'removeFriend'
)

LAYOUT.addVariant(5, ADDRESS_TYPE_INPUT, 'createAccount')

const friendLayout = BufferLayout.struct([
  BufferLayout.seq(BufferLayout.u8(), 32, 'from'),
  BufferLayout.u8('status'),
  BufferLayout.seq(BufferLayout.u8(), 32, 'to'),
  BufferLayout.seq(BufferLayout.u8(), 32, 'textileFrom1'),
  BufferLayout.seq(BufferLayout.u8(), 32, 'textileFrom2'),
  BufferLayout.seq(BufferLayout.u8(), 32, 'textileTo1'),
  BufferLayout.seq(BufferLayout.u8(), 32, 'textileTo2'),
])

const instructionMaxSpan = Math.max(
  // @ts-ignore
  ...Object.values(LAYOUT.registry).map((r) => r.span)
)

function encodeInstructionData(instruction: FriendsInstructionType) {
  const b = Buffer.alloc(instructionMaxSpan)
  const span = LAYOUT.encode(instruction, b)
  return b.slice(0, span)
}

export { LAYOUT, encodeInstructionData, ADDRESS_TYPE_INPUT, friendLayout }
