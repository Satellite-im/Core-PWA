import { expect } from '@jest/globals'
import * as ServerProgramLayout from '~/libraries/Solana/ServerProgram/ServerProgram.layout'

describe('ServerProgramLayout.encodeInstructionData', () => {
  test('0', () => {
    const result: any = ServerProgramLayout.encodeInstructionData({
      initializeDweller: {
        name: Buffer.from('name', 'utf8'),
        hash: Buffer.from('hash', 'utf8'),
        status: Buffer.from('status', 'utf8'),
      },
    })
    expect(result).toMatchSnapshot()
  })
})
