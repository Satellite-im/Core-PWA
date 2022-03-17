// @ts-ignore
import BufferLayout from 'buffer-layout'
import { ServerInstructionType } from './ServerProgram.types'

/// Address type input
const ADDRESS_TYPE_INPUT = BufferLayout.union(BufferLayout.u8('addressType'))
ADDRESS_TYPE_INPUT.addVariant(0, BufferLayout.nu64('index'), 'dwellerServer')
ADDRESS_TYPE_INPUT.addVariant(
  1,
  BufferLayout.nu64('index'),
  'dwellerMemberStatus',
)
ADDRESS_TYPE_INPUT.addVariant(2, BufferLayout.nu64('index'), 'serverMember')
ADDRESS_TYPE_INPUT.addVariant(
  3,
  BufferLayout.nu64('index'),
  'serverAdministrator',
)
ADDRESS_TYPE_INPUT.addVariant(4, BufferLayout.nu64('index'), 'serverChannel')
ADDRESS_TYPE_INPUT.addVariant(5, BufferLayout.nu64('index'), 'serverGroup')
ADDRESS_TYPE_INPUT.addVariant(6, BufferLayout.nu64('index'), 'groupChannel')

const LAYOUT = BufferLayout.union(BufferLayout.u8('instruction'))
LAYOUT.addVariant(0, ADDRESS_TYPE_INPUT, 'createDerivedAccount')
LAYOUT.addVariant(
  1,
  BufferLayout.struct([
    BufferLayout.seq(BufferLayout.u8(), 32, 'name'),
    BufferLayout.seq(BufferLayout.u8(), 64, 'hash'),
    BufferLayout.seq(BufferLayout.u8(), 128, 'status'),
  ]),
  'initializeDweller',
)
LAYOUT.addVariant(
  2,
  BufferLayout.struct([BufferLayout.seq(BufferLayout.u8(), 32, 'name')]),
  'initializeServer',
)

const dwellerAccountLayout = BufferLayout.struct([
  BufferLayout.u8('version'),
  BufferLayout.nu64('servers'),
  BufferLayout.seq(BufferLayout.u8(), 32, 'name'),
  BufferLayout.seq(BufferLayout.u8(), 64, 'photo_hash'),
  BufferLayout.seq(BufferLayout.u8(), 128, 'status'),
])

const serverAccountLayout = BufferLayout.struct([
  BufferLayout.u8('version'),
  BufferLayout.seq(BufferLayout.u8(), 32, 'owner'),
  BufferLayout.seq(BufferLayout.u8(), 32, 'name'),
  BufferLayout.seq(BufferLayout.u8(), 64, 'photo_hash'),
  BufferLayout.seq(BufferLayout.u8(), 64, 'db_hash'),
  BufferLayout.nu64('members'),
  BufferLayout.nu64('member_statuses'),
  BufferLayout.nu64('administrators'),
  BufferLayout.nu64('channels'),
  BufferLayout.nu64('groups'),
])

const instructionMaxSpan = Math.max(
  // @ts-ignore
  ...Object.values(LAYOUT.registry).map((r) => r.span),
)

function encodeInstructionData(instruction: ServerInstructionType) {
  const b = Buffer.alloc(instructionMaxSpan)
  const span = LAYOUT.encode(instruction, b)
  return b.slice(0, span)
}

export {
    LAYOUT,
    encodeInstructionData,
    dwellerAccountLayout,
    serverAccountLayout,
    ADDRESS_TYPE_INPUT,
}

