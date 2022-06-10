import * as EthereumAdapter from '~/libraries/BlockchainClient/adapters/EthereumAdapter/EthereumAdapter'
describe('EthereumAdapter.default.acceptFriendRequest', () => {
  let inst: any

  beforeEach(() => {
    inst = new EthereumAdapter.default()
  })

  test('0', () => {
    const param1: any = [
      [false, true, false, false],
      [false, true, false, false],
      [true, false, true, true],
      [false, true, true, false],
    ]
    const result: any = inst.acceptFriendRequest(param1)
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const param1: any = [
      [false, false, true, false],
      [false, false, false, false],
      [true, true, true, false],
      [true, false, false, false],
    ]
    const result: any = inst.acceptFriendRequest(param1)
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const param1: any = [
      [false, true, false, true],
      [true, false, false, false],
      [false, true, false, false],
      [false, false, false, true],
    ]
    const result: any = inst.acceptFriendRequest(param1)
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const param1: any = [
      [true, true, false, false],
      [false, true, false, true],
      [false, false, false, false],
      [true, true, true, false],
    ]
    const result: any = inst.acceptFriendRequest(param1)
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const param1: any = [
      [true, true, false, false],
      [false, true, false, true],
      [false, true, false, false],
      [true, true, false, true],
    ]
    const result: any = inst.acceptFriendRequest(param1)
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = inst.acceptFriendRequest([])
    expect(result).toMatchSnapshot()
  })
})
