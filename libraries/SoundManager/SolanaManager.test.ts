import * as SolanaManager from '~/libraries/Solana/SolanaManager/SolanaManager'
const SolanaManagerDefault = SolanaManager.default

describe.skip('SolanaManager.default.stringToBuffer', () => {
  // AP-329
  test('0', () => {
    const result: any = SolanaManagerDefault.stringToBuffer('Foo bar', 100)
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = SolanaManagerDefault.stringToBuffer(
      'This is a Text',
      -5.48,
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = SolanaManagerDefault.stringToBuffer('foo bar', -100)
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = SolanaManagerDefault.stringToBuffer(
      'Hello, world!',
      100,
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = SolanaManagerDefault.stringToBuffer('This is a Text', 1)
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = SolanaManagerDefault.stringToBuffer('', -Infinity)
    expect(result).toMatchSnapshot()
  })
})

describe.skip('SolanaManager.default.waitForAccount', () => {
  // AP-329
  test('0', () => {
    const result: any = SolanaManagerDefault.waitForAccount(
      'Foo bar',
      'Foo bar',
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = SolanaManagerDefault.waitForAccount(
      'Hello, world!',
      'foo bar',
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = SolanaManagerDefault.waitForAccount(
      'Foo bar',
      'This is a Text',
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = SolanaManagerDefault.waitForAccount(
      'foo bar',
      'foo bar',
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = SolanaManagerDefault.waitForAccount(
      'This is a Text',
      'Hello, world!',
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = SolanaManagerDefault.waitForAccount('', '')
    expect(result).toMatchSnapshot()
  })
})

describe.skip('SolanaManager.default.publicKeyFromSeeds', () => {
  // AP-329
  test('0', () => {
    const result: any = SolanaManagerDefault.publicKeyFromSeeds(
      'This is a Text',
      'foo bar',
      'foo bar',
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = SolanaManagerDefault.publicKeyFromSeeds(
      'foo bar',
      'Foo bar',
      'Hello, world!',
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = SolanaManagerDefault.publicKeyFromSeeds(
      'Foo bar',
      'foo bar',
      'Hello, world!',
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = SolanaManagerDefault.publicKeyFromSeeds(
      'foo bar',
      'This is a Text',
      'foo bar',
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = SolanaManagerDefault.publicKeyFromSeeds(
      'foo bar',
      'foo bar',
      'foo bar',
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = SolanaManagerDefault.publicKeyFromSeeds('', '', '')
    expect(result).toMatchSnapshot()
  })
})

describe.skip('SolanaManager.default.getClusterFromNetworkConfig', () => {
  // AP-329
  test('0', () => {
    const result: any =
      SolanaManager.default.getClusterFromNetworkConfig('foo bar')
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any =
      SolanaManager.default.getClusterFromNetworkConfig('Hello, world!')
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any =
      SolanaManager.default.getClusterFromNetworkConfig('Foo bar')
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = SolanaManagerDefault.getClusterFromNetworkConfig('')
    expect(result).toMatchSnapshot()
  })
})
