import * as FriendsProgramLayout from '~/libraries/Solana/FriendsProgram/FriendsProgram.layout'

describe('FriendsProgramLayout.encodeInstructionData', () => {
  test('0', () => {
    const inst: any = new Uint8Array([1, 1])
    const inst2: any = new Uint8Array([-100, 0])
    const inst3: any = new Uint8Array([-100, 1])
    const inst4: any = new Uint8Array([0, 0])
    const object: any = [inst, inst2, inst3, inst4]
    const result: any = FriendsProgramLayout.encodeInstructionData({
      acceptRequest: { tex: object },
    })
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = FriendsProgramLayout.encodeInstructionData({
      removeRequest: {},
    })
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = FriendsProgramLayout.encodeInstructionData({
      removeFriend: {},
    })
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const inst: any = new Uint8Array([-1, 1])
    const inst2: any = new Uint8Array([0, -1])
    const inst3: any = new Uint8Array([-1, -100])
    const inst4: any = new Uint8Array([0, -100])
    const object: any = [inst, inst2, inst3, inst4]
    const result: any = FriendsProgramLayout.encodeInstructionData({
      makeRequest: { tex: object },
    })
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const inst: any = new Uint8Array([0, -1])
    const inst2: any = new Uint8Array([100, -1])
    const inst3: any = new Uint8Array([0, -100])
    const inst4: any = new Uint8Array([0, -1])
    const object: any = [inst, inst2, inst3, inst4]
    const result: any = FriendsProgramLayout.encodeInstructionData({
      makeRequest: { tex: object },
    })
    expect(result).toMatchSnapshot()
  })
})

describe('FriendsProgramLayout.encodeInstructionData', () => {
  test('0', () => {
    const result: any = FriendsProgramLayout.encodeInstructionData({
      removeFriend: {},
    })
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const inst: any = new Uint8Array([0, 100])
    const inst2: any = new Uint8Array([100, 1])
    const inst3: any = new Uint8Array([1, 100])
    const inst4: any = new Uint8Array([1, -1])
    const object: any = [inst, inst2, inst3, inst4]
    const result: any = FriendsProgramLayout.encodeInstructionData({
      makeRequest: { tex: object },
    })
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = FriendsProgramLayout.encodeInstructionData({
      denyRequest: {},
    })
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const inst: any = new Uint8Array([0, -100])
    const inst2: any = new Uint8Array([-100, -1])
    const inst3: any = new Uint8Array([-100, 1])
    const inst4: any = new Uint8Array([100, 1])
    const object: any = [inst, inst2, inst3, inst4]
    const result: any = FriendsProgramLayout.encodeInstructionData({
      makeRequest: { tex: object },
    })
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const inst: any = new Uint8Array([-1, 100])
    const inst2: any = new Uint8Array([1, -1])
    const inst3: any = new Uint8Array([100, 0])
    const inst4: any = new Uint8Array([-1, -1])
    const object: any = [inst, inst2, inst3, inst4]
    const result: any = FriendsProgramLayout.encodeInstructionData({
      makeRequest: { tex: object },
    })
    expect(result).toMatchSnapshot()
  })
})
